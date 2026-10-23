// Admin panel: class overview, student management, subject analytics and settings.
// Data access is enforced server-side by the row-level security rules in supabase/schema.sql.
(function () {
  "use strict";

  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const DAY = 86400000;
  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "–");
  const ago = (d) => {
    if (!d) return "never";
    const days = Math.floor((Date.now() - Date.parse(d)) / DAY);
    return days <= 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`;
  };
  function pill(p) {
    if (p == null) return `<span class="pill">–</span>`;
    const cls = p >= 70 ? "good" : p >= 50 ? "warn" : "bad";
    return `<span class="pill ${cls}">${p}%</span>`;
  }

  const st = { tab: "overview", student: null, query: "", data: null, subjects: [] };

  async function fetchAll() {
    const sb = window.Cloud.client;
    const profiles = await sb.from("profiles").select("*").order("full_name");
    if (profiles.error) throw profiles.error;
    const attempts = [];
    for (let from = 0; ; from += 1000) {
      const r = await sb.from("attempts").select("id,user_id,subject_id,test_id,test_title,kind,score,max,topics,created_at")
        .order("created_at", { ascending: false }).range(from, from + 999);
      if (r.error) throw r.error;
      attempts.push(...r.data);
      if (r.data.length < 1000) break;
    }
    const settings = await sb.from("settings").select("*").eq("id", 1).single();
    if (settings.error) throw settings.error;
    st.data = { profiles: profiles.data, attempts, settings: settings.data };
  }

  // Best score per test, averaged — the same measure students see on their dashboard.
  function summarize(attempts) {
    const best = {};
    attempts.forEach((a) => {
      const k = a.subject_id + ":" + a.test_id;
      if (!best[k] || a.score / a.max > best[k].score / best[k].max) best[k] = a;
    });
    const bests = Object.values(best);
    const avg = bests.length ? Math.round(bests.reduce((s, a) => s + pct(a.score, a.max), 0) / bests.length) : null;
    const topics = {};
    attempts.forEach((a) => Object.entries(a.topics || {}).forEach(([t, v]) => {
      const key = a.subject_id + "|" + t;
      const x = (topics[key] = topics[key] || { subject: a.subject_id, topic: t, got: 0, max: 0 });
      x.got += v.got; x.max += v.max;
    }));
    const weak = Object.values(topics).filter((t) => t.max >= 3).map((t) => ({ ...t, p: pct(t.got, t.max) })).sort((a, b) => a.p - b.p);
    return { tests: bests.length, attempts: attempts.length, avg, weak, last: attempts[0] && attempts[0].created_at };
  }
  const subjectName = (id) => (st.subjects.find((s) => s.id === id) || { name: id }).name;

  // ---------- views ----------
  async function render(view, subjects) {
    st.subjects = subjects;
    view.classList.add("admin");
    if (!st.data) {
      view.innerHTML = `<div class="card muted">Loading class data…</div>`;
      try { await fetchAll(); } catch (e) { view.innerHTML = `<div class="card">Could not load data: ${esc(window.Cloud.friendly(e))}</div>`; return; }
    }
    const tabs = [["overview", "Overview"], ["students", "Students"], ["subjects", "Subjects"], ["settings", "Settings"]];
    view.innerHTML = `<div class="subtabs">${tabs.map(([k, l]) => `<button class="subtab ${st.tab === k ? "active" : ""}" data-tab="${k}">${l}</button>`).join("")}
      <span class="spacer"></span><button class="ghost small" id="refresh" style="margin-bottom:6px">↻ Refresh</button></div><div id="adm"></div>`;
    view.querySelectorAll("[data-tab]").forEach((b) => (b.onclick = () => { st.tab = b.dataset.tab; st.student = null; render(view, subjects); }));
    $("#refresh", view).onclick = () => { st.data = null; render(view, subjects); };
    const el = $("#adm", view);
    if (st.student) return studentDetail(el, view);
    ({ overview, students, subjectsView, settings }[st.tab === "subjects" ? "subjectsView" : st.tab])(el, view);
  }

  function overview(el, view) {
    const { profiles, attempts } = st.data;
    const studs = profiles.filter((p) => p.role === "student");
    const week = attempts.filter((a) => Date.now() - Date.parse(a.created_at) < 7 * DAY);
    const activeWeek = new Set(week.map((a) => a.user_id)).size;
    const rows = studs.map((p) => ({ p, s: summarize(attempts.filter((a) => a.user_id === p.id)) }));
    const scored = rows.filter((r) => r.s.avg != null);
    const classAvg = scored.length ? Math.round(scored.reduce((a, r) => a + r.s.avg, 0) / scored.length) : null;
    const attention = rows.filter((r) => r.p.active && ((r.s.avg != null && r.s.avg < 50) || !r.s.last || Date.now() - Date.parse(r.s.last) > 7 * DAY));
    const classWeak = summarize(attempts).weak.slice(0, 8);
    el.innerHTML = `
      <div class="grid">
        <div class="card"><div class="muted small">Students</div><div class="stat">${studs.length}</div></div>
        <div class="card"><div class="muted small">Active this week</div><div class="stat">${activeWeek}</div></div>
        <div class="card"><div class="muted small">Tests taken this week</div><div class="stat">${week.length}</div></div>
        <div class="card"><div class="muted small">Class average (best scores)</div><div class="stat">${classAvg != null ? classAvg + "%" : "–"}</div></div>
      </div>
      <div class="card"><h3>Needs attention</h3>
        ${attention.length ? `<div class="table-wrap"><table><tr><th>Student</th><th>Average</th><th>Last test</th><th>Reason</th></tr>
          ${attention.map((r) => `<tr class="click" data-sid="${r.p.id}"><td>${esc(r.p.full_name)}</td><td>${pill(r.s.avg)}</td><td>${ago(r.s.last)}</td>
            <td class="small">${r.s.avg != null && r.s.avg < 50 ? "Low scores" : "No test in 7+ days"}</td></tr>`).join("")}</table></div>`
          : `<p class="muted">Everyone is active and scoring 50% or more. 🎉</p>`}
      </div>
      <div class="card"><h3>Weakest topics across the class</h3>
        ${classWeak.length ? `<div class="table-wrap"><table><tr><th>Subject</th><th>Topic</th><th>Score</th></tr>
          ${classWeak.map((t) => `<tr><td>${esc(subjectName(t.subject))}</td><td>${esc(t.topic)}</td><td>${pill(t.p)}</td></tr>`).join("")}</table></div>`
          : `<p class="muted">Not enough results yet.</p>`}
      </div>`;
    bindStudentLinks(el, view);
  }

  function students(el, view) {
    const { profiles, attempts } = st.data;
    const q = st.query.toLowerCase();
    const list = profiles.filter((p) => !q || (p.full_name + " " + (p.email || "")).toLowerCase().includes(q));
    el.innerHTML = `
      <div class="card">
        <div class="row"><input id="search" class="inline" placeholder="Search name or email" value="${esc(st.query)}" style="flex:1;min-width:200px">
          <button class="btn secondary" id="csv">Export CSV</button></div>
        <p class="small muted">New students sign up in the app with the class join code (see Settings). Click a row to see details and manage the account.</p>
        <div class="table-wrap"><table>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Tests</th><th>Average</th><th>Last seen</th></tr>
          ${list.map((p) => {
            const s = summarize(attempts.filter((a) => a.user_id === p.id));
            return `<tr class="click" data-sid="${p.id}"><td>${esc(p.full_name)}</td><td class="small">${esc(p.email)}</td>
              <td>${p.role === "admin" ? `<span class="pill warn">admin</span>` : "student"}</td>
              <td>${p.active ? `<span class="pill good">active</span>` : `<span class="pill bad">disabled</span>`}</td>
              <td>${s.tests}</td><td>${pill(s.avg)}</td><td class="small">${ago(p.last_seen)}</td></tr>`;
          }).join("") || `<tr><td colspan="7" class="muted">No matches.</td></tr>`}
        </table></div>
      </div>`;
    const search = $("#search", el);
    search.oninput = () => { st.query = search.value; students(el, view); const s2 = $("#search", el); s2.focus(); s2.setSelectionRange(s2.value.length, s2.value.length); };
    $("#csv", el).onclick = exportCsv;
    bindStudentLinks(el, view);
  }

  function studentDetail(el, view) {
    const { profiles, attempts } = st.data;
    const p = profiles.find((x) => x.id === st.student);
    if (!p) { st.student = null; return render(view, st.subjects); }
    const mine = attempts.filter((a) => a.user_id === p.id);
    const all = summarize(mine);
    const self = window.Cloud.user && window.Cloud.user.id === p.id;
    el.innerHTML = `
      <button class="ghost" id="backList">← All students</button>
      <div class="card" style="margin-top:12px">
        <div class="row"><h2 style="margin:0">${esc(p.full_name)}</h2>${p.role === "admin" ? `<span class="pill warn">admin</span>` : ""}
          ${p.active ? `<span class="pill good">active</span>` : `<span class="pill bad">disabled</span>`}</div>
        <p class="small muted">${esc(p.email)} · joined ${fmtDate(p.created_at)} · last seen ${ago(p.last_seen)}</p>
        <div class="row">
          <label class="small">Name <input class="inline" id="fName" value="${esc(p.full_name)}"></label>
          <label class="small">Grade <input class="inline" id="fGrade" value="${esc(p.grade)}" style="width:110px"></label>
          <button class="btn secondary" id="saveInfo">Save</button>
        </div>
        ${self ? `<p class="small muted">This is your own account. You can't remove your own admin role or disable yourself.</p>` : `
        <div class="row" style="margin-top:10px">
          <button class="btn secondary" id="toggleRole">${p.role === "admin" ? "Make student" : "Make admin"}</button>
          <button class="btn secondary" id="toggleActive">${p.active ? "Disable account" : "Re-enable account"}</button>
        </div>`}
        <p class="small" id="msg"></p>
      </div>
      <div class="grid">
        <div class="card"><div class="muted small">Tests completed</div><div class="stat">${all.tests}</div></div>
        <div class="card"><div class="muted small">Total attempts</div><div class="stat">${all.attempts}</div></div>
        <div class="card"><div class="muted small">Average (best scores)</div><div class="stat">${all.avg != null ? all.avg + "%" : "–"}</div></div>
      </div>
      <div class="card"><h3>By subject</h3><div class="table-wrap"><table><tr><th>Subject</th><th>Tests done</th><th>Average</th><th>Weakest topic</th></tr>
        ${st.subjects.map((s) => {
          const r = summarize(mine.filter((a) => a.subject_id === s.id));
          const total = s.papers.length + s.quickTests.length;
          return `<tr><td>${s.icon} ${esc(s.name)}</td><td>${r.tests}/${total}</td><td>${pill(r.avg)}</td>
            <td class="small">${r.weak[0] && r.weak[0].p < 70 ? `${esc(r.weak[0].topic)} (${r.weak[0].p}%)` : "–"}</td></tr>`;
        }).join("")}</table></div></div>
      <div class="card"><h3>Recent attempts</h3>
        ${mine.length ? `<div class="table-wrap"><table><tr><th>Date</th><th>Subject</th><th>Test</th><th>Score</th></tr>
          ${mine.slice(0, 50).map((a) => `<tr><td class="small">${fmtDate(a.created_at)}</td><td>${esc(subjectName(a.subject_id))}</td>
            <td>${esc(a.test_title || a.test_id)}</td><td>${a.score}/${a.max} ${pill(pct(a.score, a.max))}</td></tr>`).join("")}</table></div>`
          : `<p class="muted">No tests taken yet.</p>`}
      </div>`;
    $("#backList", el).onclick = () => { st.student = null; render(view, st.subjects); };
    const msg = $("#msg", el);
    const update = async (patch, ok) => {
      const { error } = await window.Cloud.client.from("profiles").update(patch).eq("id", p.id);
      if (error) { msg.style.color = "var(--bad)"; msg.textContent = window.Cloud.friendly(error); return; }
      Object.assign(p, patch);
      studentDetail(el, view);
      const m2 = $("#msg", el); m2.style.color = "var(--good)"; m2.textContent = ok;
    };
    $("#saveInfo", el).onclick = () => {
      const full_name = $("#fName", el).value.trim(), grade = $("#fGrade", el).value.trim();
      if (!full_name) return;
      update({ full_name, grade: grade || "Stage 8" }, "Saved.");
    };
    if (!self) {
      $("#toggleRole", el).onclick = () => {
        const role = p.role === "admin" ? "student" : "admin";
        if (confirm(role === "admin" ? `Give ${p.full_name} full admin access to every student's data?` : `Remove admin access from ${p.full_name}?`))
          update({ role }, "Role updated.");
      };
      $("#toggleActive", el).onclick = () => {
        if (confirm(p.active ? `Disable ${p.full_name}? They will be logged out and can't save progress until re-enabled. Their scores are kept.` : `Re-enable ${p.full_name}?`))
          update({ active: !p.active }, p.active ? "Account disabled." : "Account re-enabled.");
      };
    }
  }

  function subjectsView(el) {
    const { attempts, profiles } = st.data;
    const studentIds = new Set(profiles.filter((p) => p.role === "student").map((p) => p.id));
    const sa = attempts.filter((a) => studentIds.has(a.user_id));
    el.innerHTML = st.subjects.map((s) => {
      const mine = sa.filter((a) => a.subject_id === s.id);
      const r = summarize(mine);
      const tests = [...s.quickTests.map((t) => [t, "Quick test"]), ...s.papers.map((t) => [t, "Paper"])];
      return `<details class="topic card" style="padding:0">
        <summary>${s.icon} ${esc(s.name)} <span class="spacer"></span><span class="small muted">${mine.length} attempts</span> ${pill(r.avg)}</summary>
        <div class="body">
          <div class="table-wrap"><table><tr><th>Test</th><th>Type</th><th>Students</th><th>Average score</th></tr>
            ${tests.map(([t, kind]) => {
              const ta = mine.filter((a) => a.test_id === t.id);
              const users = new Set(ta.map((a) => a.user_id)).size;
              const avg = ta.length ? Math.round(ta.reduce((x, a) => x + pct(a.score, a.max), 0) / ta.length) : null;
              return `<tr><td>${esc(t.title)}</td><td class="small">${kind}</td><td>${users}</td><td>${pill(avg)}</td></tr>`;
            }).join("")}</table></div>
          <h4 style="margin-top:14px">Weakest topics</h4>
          ${r.weak.length ? r.weak.slice(0, 6).map((t) => `<div class="row small" style="margin:4px 0"><span style="min-width:220px">${esc(t.topic)}</span>${pill(t.p)}</div>`).join("") : `<p class="muted small">Not enough results yet.</p>`}
        </div></details>`;
    }).join("");
  }

  function settings(el) {
    const s = st.data.settings;
    el.innerHTML = `
      <div class="card"><h3>Class join code</h3>
        <p class="small muted">Students need this code to create an account. Change it any time. Existing accounts are not affected.</p>
        <div class="row"><input class="inline" id="code" value="${esc(s.join_code)}" style="text-transform:uppercase;min-width:200px">
          <button class="btn" id="saveCode">Save code</button></div>
        <p class="small" id="codeMsg"></p>
      </div>
      <div class="card"><h3>School / class name</h3>
        <div class="row"><input class="inline" id="school" value="${esc(s.school_name)}" style="min-width:240px"><button class="btn secondary" id="saveSchool">Save</button></div>
      </div>
      <div class="card"><h3>Data</h3>
        <p class="small muted">Download every test attempt as a spreadsheet (CSV).</p>
        <button class="btn secondary" id="csv2">Export all results (CSV)</button>
      </div>
      <div class="card"><h3>Adding another admin or teacher</h3>
        <p class="small muted">Ask them to sign up in the app with the join code, then open them in <b>Students</b> and press <b>Make admin</b>.</p>
      </div>`;
    const save = async (patch, msgEl) => {
      const { error } = await window.Cloud.client.from("settings").update(patch).eq("id", 1);
      if (msgEl) { msgEl.style.color = error ? "var(--bad)" : "var(--good)"; msgEl.textContent = error ? window.Cloud.friendly(error) : "Saved."; }
      if (!error) Object.assign(s, patch);
    };
    $("#saveCode", el).onclick = () => {
      const code = $("#code", el).value.trim().toUpperCase();
      if (code.length < 4) { $("#codeMsg", el).textContent = "Use at least 4 characters."; return; }
      save({ join_code: code }, $("#codeMsg", el));
    };
    $("#saveSchool", el).onclick = () => save({ school_name: $("#school", el).value.trim() || "Checkpoint Prep" }, null);
    $("#csv2", el).onclick = exportCsv;
  }

  function exportCsv() {
    const { profiles, attempts } = st.data;
    const byId = Object.fromEntries(profiles.map((p) => [p.id, p]));
    const cell = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const rows = [["Date", "Student", "Email", "Subject", "Test", "Type", "Score", "Max", "Percent"]];
    attempts.forEach((a) => {
      const p = byId[a.user_id] || {};
      rows.push([new Date(a.created_at).toISOString().slice(0, 16).replace("T", " "), p.full_name, p.email, subjectName(a.subject_id), a.test_title || a.test_id, a.kind, a.score, a.max, pct(a.score, a.max)]);
    });
    const blob = new Blob([rows.map((r) => r.map(cell).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `checkpoint-results-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function bindStudentLinks(el, view) {
    el.querySelectorAll("[data-sid]").forEach((r) => (r.onclick = () => { st.student = r.dataset.sid; render(view, st.subjects); }));
  }

  window.Admin = { render };
})();
