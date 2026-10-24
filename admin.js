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
    const tabs = [["overview", "Overview"], ["students", "Students"], ["invite", "✉️ Invite"], ["subjects", "Subjects"], ["settings", "Settings"]];
    view.innerHTML = `<div class="subtabs">${tabs.map(([k, l]) => `<button class="subtab ${st.tab === k ? "active" : ""}" data-tab="${k}">${l}</button>`).join("")}
      <span class="spacer"></span><button class="ghost small" id="refresh" style="margin-bottom:6px">↻ Refresh</button></div><div id="adm"></div>`;
    view.querySelectorAll("[data-tab]").forEach((b) => (b.onclick = () => { st.tab = b.dataset.tab; st.student = null; render(view, subjects); }));
    $("#refresh", view).onclick = () => { st.data = null; render(view, subjects); };
    const el = $("#adm", view);
    if (st.student) return studentDetail(el, view);
    ({ overview, students, invite, subjectsView, settings }[st.tab === "subjects" ? "subjectsView" : st.tab])(el, view);
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

  // ---------- creating student accounts ----------
  const WORDS = ["tiger", "maple", "river", "rocket", "mango", "planet", "comet", "lotus", "falcon", "pixel", "coral", "cedar",
    "orbit", "panda", "amber", "storm", "lemon", "zebra", "piano", "delta", "sunny", "ocean", "eagle", "tulip"];
  const rand = (n) => crypto.getRandomValues(new Uint32Array(1))[0] % n;
  // Easy to read out and type, e.g. "comet4827".
  const newPassword = () => WORDS[rand(WORDS.length)] + String(1000 + rand(9000));
  function suggestUsername(name, taken) {
    const parts = name.toLowerCase().normalize("NFKD").replace(/[^a-z\s]/g, "").trim().split(/\s+/).filter(Boolean);
    let base = parts.length > 1 ? `${parts[0]}.${parts[parts.length - 1]}` : parts[0] || "student";
    base = base.slice(0, 24);
    if (base.length < 3) base += "student";
    let u = base, i = 2;
    while (taken.has(u)) u = `${base}${i++}`;
    taken.add(u);
    return u;
  }
  const takenUsernames = () => new Set(st.data.profiles.map((p) => p.username).filter(Boolean));

  function credentialsCard(rows) {
    const ok = rows.filter((r) => !r.error);
    const text = ok.map((r) => `${r.name}\n  Username: ${r.username}\n  Password: ${r.password}`).join("\n\n");
    return `<div class="card creds">
      <h3>🔑 Login details to give your students</h3>
      <p class="small muted">Website: <b>${esc(location.origin + location.pathname)}</b>. Save or print this now. For safety, passwords are not shown again (you can always reset one).</p>
      <div class="table-wrap"><table><tr><th>Student</th><th>Username</th><th>Password</th><th></th></tr>
        ${rows.map((r) => `<tr><td>${esc(r.name)}</td><td><code>${esc(r.username)}</code></td><td>${r.error ? "" : `<code>${esc(r.password)}</code>`}</td>
          <td class="small">${r.error ? `<span style="color:var(--bad)">${esc(r.error)}</span>` : "✅ created"}</td></tr>`).join("")}
      </table></div>
      ${ok.length ? `<div class="row" style="margin-top:10px"><button class="btn" id="copyCreds">📋 Copy all</button><button class="btn secondary" id="printCreds">🖨 Print login slips</button></div>` : ""}
      <textarea id="credsText" hidden>${esc(text)}</textarea>
    </div>`;
  }

  function bindCredentials(box, rows) {
    const copy = $("#copyCreds", box);
    if (copy) copy.onclick = async () => {
      const t = $("#credsText", box).value;
      try { await navigator.clipboard.writeText(t); copy.textContent = "✅ Copied"; }
      catch (e) { const ta = $("#credsText", box); ta.hidden = false; ta.select(); document.execCommand("copy"); ta.hidden = true; copy.textContent = "✅ Copied"; }
    };
    const print = $("#printCreds", box);
    if (print) print.onclick = () => {
      const site = location.origin + location.pathname;
      const w = window.open("", "_blank");
      w.document.write(`<!doctype html><meta charset="utf-8"><title>Login slips</title>
        <style>body{font-family:Arial,sans-serif;margin:20px}.slip{border:1px dashed #999;padding:14px 18px;margin:0 0 12px;break-inside:avoid;border-radius:8px}
        h3{margin:0 0 6px}code{font-size:18px;font-weight:bold}p{margin:4px 0}</style>
        ${rows.filter((r) => !r.error).map((r) => `<div class="slip"><h3>Checkpoint Preparation: ${esc(r.name)}</h3>
          <p>Website: ${esc(site)}</p><p>Username: <code>${esc(r.username)}</code></p><p>Password: <code>${esc(r.password)}</code></p></div>`).join("")}
        <script>window.onload=()=>window.print()<\/script>`);
      w.document.close();
    };
  }

  function addStudentsCard(box, view) {
    const mode = st.addMode || "one";
    box.innerHTML = `<div class="card">
      <div class="row"><h3 style="margin:0">➕ Add students</h3><span class="spacer"></span>
        <button class="chip ${mode === "one" ? "on" : ""}" data-am="one">One student</button>
        <button class="chip ${mode === "many" ? "on" : ""}" data-am="many">Whole class</button></div>
      ${mode === "one" ? `
        <form id="addOne" class="grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));margin-top:12px">
          <label class="small">Student's full name<input name="name" required placeholder="Riya Kumar"></label>
          <label class="small">Username<input name="username" required autocapitalize="none" spellcheck="false" placeholder="riya.kumar"></label>
          <label class="small">Password<input name="password" required minlength="6" value="${newPassword()}"></label>
          <div style="align-self:end"><button class="btn" type="submit">Create account</button></div>
        </form>` : `
        <form id="addMany" style="margin-top:12px">
          <label class="small">Paste student names, one per line<textarea name="names" rows="7" placeholder="Riya Kumar&#10;Arjun Reddy&#10;Sara Thomas" style="width:100%;margin-top:4px"></textarea></label>
          <p class="small muted">A username and password is made for each name. You can print them as login slips afterwards.</p>
          <button class="btn" type="submit">Create all accounts</button>
        </form>`}
      <p class="small" id="addMsg"></p>
    </div><div id="credsBox"></div>`;
    box.querySelectorAll("[data-am]").forEach((b) => (b.onclick = () => { st.addMode = b.dataset.am; addStudentsCard(box, view); }));

    const msg = $("#addMsg", box);
    // The form is redrawn after creating accounts, so look the credentials box up afresh.
    const finish = async (rows) => {
      const credsBox = $("#credsBox", box);
      credsBox.innerHTML = credentialsCard(rows);
      bindCredentials(credsBox, rows);
      try { await fetchAll(); renderStudentList($("#listBox", view.querySelector("#adm")), view); } catch (e) { /* list refreshes on next visit */ }
    };

    const one = $("#addOne", box);
    if (one) {
      one.name.oninput = () => { if (!one.username.dataset.touched) one.username.value = suggestUsername(one.name.value, new Set(takenUsernames())); };
      one.username.oninput = () => { one.username.dataset.touched = "1"; };
      one.onsubmit = async (e) => {
        e.preventDefault();
        const row = { name: one.name.value.trim(), username: one.username.value.trim().toLowerCase(), password: one.password.value };
        const btn = one.querySelector("button"); btn.disabled = true; msg.textContent = "";
        try { await window.Cloud.adminCreateStudent(row.username, row.password, row.name); }
        catch (err) { btn.disabled = false; msg.style.color = "var(--bad)"; msg.textContent = err.message; return; }
        addStudentsCard(box, view);
        finish([row]);
      };
    }

    const many = $("#addMany", box);
    if (many) many.onsubmit = async (e) => {
      e.preventDefault();
      const names = [...new Set(many.names.value.split("\n").map((n) => n.trim()).filter(Boolean))];
      if (!names.length) { msg.style.color = "var(--bad)"; msg.textContent = "Add at least one name."; return; }
      if (names.length > 100) { msg.style.color = "var(--bad)"; msg.textContent = "Please add at most 100 names at a time."; return; }
      const btn = many.querySelector("button"); btn.disabled = true;
      const taken = takenUsernames(), rows = [];
      for (const [i, name] of names.entries()) {
        msg.style.color = "var(--muted)"; msg.textContent = `Creating ${i + 1} of ${names.length}…`;
        const row = { name, username: suggestUsername(name, taken), password: newPassword() };
        try { await window.Cloud.adminCreateStudent(row.username, row.password, row.name); }
        catch (err) { row.error = err.message; }
        rows.push(row);
      }
      msg.textContent = "";
      addStudentsCard(box, view);
      finish(rows);
    };
  }

  // ---------- invitations ----------
  // An invite is a link that opens the sign-up form with the class join code (and optionally name/email) filled in.
  // Sending goes through the admin's own WhatsApp or email app, so no email service is needed.
  const appUrl = () => location.origin + location.pathname.replace(/index\.html$/, "");
  function inviteLink(extra) {
    const q = new URLSearchParams({ code: st.data.settings.join_code, ...extra });
    return `${appUrl()}#invite?${q.toString()}`;
  }
  const inviteMessage = (link, name) =>
    `Hi${name ? " " + name : ""}! You're invited to join ${st.data.settings.school_name} for Cambridge Lower Secondary Stage 8 revision.\n\n` +
    `Open this link to create your account:\n${link}\n\nClass join code: ${st.data.settings.join_code}`;

  function shareButtons(link, msg, email) {
    const subject = encodeURIComponent(`Invitation: ${st.data.settings.school_name}`);
    return `<div class="row" style="margin-top:10px">
      <button class="btn" data-copy="${esc(link)}">📋 Copy link</button>
      <button class="btn secondary" data-copy="${esc(msg)}">📋 Copy message</button>
      <a class="btn secondary" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">💬 WhatsApp</a>
      <a class="btn secondary" href="mailto:${encodeURIComponent(email || "")}?subject=${subject}&body=${encodeURIComponent(msg)}">✉️ Email</a>
    </div>`;
  }

  function bindCopy(el) {
    el.querySelectorAll("[data-copy]").forEach((b) => (b.onclick = async () => {
      const text = b.dataset.copy, label = b.textContent;
      try { await navigator.clipboard.writeText(text); }
      catch (e) { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
      b.textContent = "✅ Copied"; setTimeout(() => (b.textContent = label), 1500);
    }));
  }

  function invite(el) {
    const link = inviteLink({});
    const msg = inviteMessage(link);
    el.innerHTML = `
      <div class="card">
        <h3>✉️ Invite the whole class</h3>
        <p class="small muted">Share this link. Students open it, the sign-up form appears with the class code already filled in, and they choose their own password. Google sign-in works too, if it's switched on.</p>
        <div class="invite-link"><code>${esc(link)}</code></div>
        ${shareButtons(link, msg)}
        <div class="row" style="margin-top:14px;align-items:flex-start">
          <div id="qr" class="qr-box"></div>
          <div class="small muted" style="flex:1;min-width:200px">
            <b>📱 Scan to join.</b> Show this QR code on the classroom screen or print it. Students scan it with their phone camera.
            <div class="row" style="margin-top:8px"><button class="btn secondary" id="printQr">🖨 Print QR poster</button></div>
          </div>
        </div>
      </div>

      <div class="card admin">
        <h3>👤 Invite one student</h3>
        <p class="small muted">Their name and email are filled in for them when they open the link.</p>
        <form id="personal" class="grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">
          <label class="small">Student's name<input name="name" required placeholder="Riya Kumar"></label>
          <label class="small">Email (optional)<input name="email" type="email" placeholder="riya@example.com"></label>
          <div style="align-self:end"><button class="btn" type="submit">Create invite</button></div>
        </form>
        <div id="personalOut"></div>
      </div>

      <div class="card small muted">
        🔒 Anyone with an invite link can join your class. To stop old links working, change the join code in <b>Settings</b>.
        Then share a fresh link from this page. Students who already joined are not affected.
      </div>`;
    bindCopy(el);

    const qrBox = $("#qr", el);
    if (window.QRCode) new window.QRCode(qrBox, { text: link, width: 168, height: 168, correctLevel: window.QRCode.CorrectLevel.M });
    else qrBox.innerHTML = `<p class="small muted">QR code unavailable.</p>`;

    $("#printQr", el).onclick = () => {
      const img = qrBox.querySelector("img[src]") || qrBox.querySelector("canvas");
      const src = img && (img.tagName === "CANVAS" ? img.toDataURL() : img.src);
      const w = window.open("", "_blank");
      w.document.write(`<!doctype html><meta charset="utf-8"><title>Join ${esc(st.data.settings.school_name)}</title>
        <style>body{font-family:Arial,sans-serif;text-align:center;padding:40px}img{width:320px;height:320px;image-rendering:pixelated}
        h1{margin:0 0 8px}p{font-size:18px}code{font-size:26px;font-weight:bold;letter-spacing:2px}</style>
        <h1>📚 Join ${esc(st.data.settings.school_name)}</h1><p>Scan with your phone camera to create your account</p>
        ${src ? `<img src="${src}" alt="QR code">` : ""}
        <p>or open <b>${esc(appUrl())}</b></p><p>Class join code: <code>${esc(st.data.settings.join_code)}</code></p>
        <script>window.onload=()=>window.print()<\/script>`);
      w.document.close();
    };

    $("#personal", el).onsubmit = (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const name = f.get("name").trim(), email = f.get("email").trim();
      const plink = inviteLink(email ? { name, email } : { name });
      const pmsg = inviteMessage(plink, name.split(/\s+/)[0]);
      const out = $("#personalOut", el);
      out.innerHTML = `<div class="invite-link" style="margin-top:12px"><code>${esc(plink)}</code></div>${shareButtons(plink, pmsg, email)}`;
      bindCopy(out);
    };
  }

  function students(el, view) {
    el.innerHTML = `<div id="addBox"></div><div id="listBox"></div>`;
    addStudentsCard($("#addBox", el), view);
    renderStudentList($("#listBox", el), view);
  }

  function renderStudentList(el, view) {
    if (!el) return;
    const { profiles, attempts } = st.data;
    const q = st.query.toLowerCase();
    const list = profiles.filter((p) => !q || (p.full_name + " " + (p.email || "") + " " + (p.username || "")).toLowerCase().includes(q));
    el.innerHTML = `
      <div class="card">
        <div class="row"><input id="search" class="inline" placeholder="Search name, username or email" value="${esc(st.query)}" style="flex:1;min-width:200px">
          <button class="btn secondary" id="csv">Export CSV</button></div>
        <p class="small muted">Click a student to see their results, reset their password or manage the account.</p>
        <div class="table-wrap"><table>
          <tr><th>Name</th><th>Login</th><th>Role</th><th>Status</th><th>Tests</th><th>Average</th><th>Last seen</th></tr>
          ${list.map((p) => {
            const s = summarize(attempts.filter((a) => a.user_id === p.id));
            return `<tr class="click" data-sid="${p.id}"><td>${esc(p.full_name)}</td><td class="small">${p.username ? `<code>${esc(p.username)}</code>` : esc(p.email)}</td>
              <td>${p.role === "admin" ? `<span class="pill warn">admin</span>` : "student"}</td>
              <td>${!p.active ? `<span class="pill bad">disabled</span>` : p.joined === false ? `<span class="pill warn">needs code</span>` : `<span class="pill good">active</span>`}</td>
              <td>${s.tests}</td><td>${pill(s.avg)}</td><td class="small">${ago(p.last_seen)}</td></tr>`;
          }).join("") || `<tr><td colspan="7" class="muted">No matches.</td></tr>`}
        </table></div>
      </div>`;
    const search = $("#search", el);
    search.oninput = () => { st.query = search.value; renderStudentList(el, view); const s2 = $("#search", el); s2.focus(); s2.setSelectionRange(s2.value.length, s2.value.length); };
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
        <p class="small muted">${p.username ? `username: <code>${esc(p.username)}</code>` : esc(p.email)} · joined ${fmtDate(p.created_at)} · last seen ${ago(p.last_seen)}</p>
        <div class="row">
          <label class="small">Name <input class="inline" id="fName" value="${esc(p.full_name)}"></label>
          <label class="small">Grade <input class="inline" id="fGrade" value="${esc(p.grade)}" style="width:110px"></label>
          <button class="btn secondary" id="saveInfo">Save</button>
        </div>
        ${self ? `<p class="small muted">This is your own account. You can't remove your own admin role or disable yourself.</p>` : `
        <div class="row" style="margin-top:10px">
          <button class="btn secondary" id="toggleRole">${p.role === "admin" ? "Make student" : "Make admin"}</button>
          <button class="btn secondary" id="toggleActive">${p.active ? "Disable account" : "Re-enable account"}</button>
          ${p.joined === false ? `<button class="btn" id="approve">Approve without code</button>` : ""}
          <button class="btn secondary" id="resetPw">🔑 Reset password</button>
          ${p.role !== "admin" ? `<button class="btn secondary" id="delStudent" style="color:var(--bad)">🗑 Delete account</button>` : ""}
        </div>
        <div id="pwBox"></div>
        ${p.joined === false ? `<p class="small muted">Signed in with Google but hasn't entered the class join code yet.</p>` : ""}`}
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
      $("#resetPw", el).onclick = async () => {
        const pw = newPassword();
        if (!confirm(`Set a new password for ${p.full_name}? Their old password will stop working.`)) return;
        try { await window.Cloud.adminSetPassword(p.id, pw); }
        catch (err) { msg.style.color = "var(--bad)"; msg.textContent = err.message; return; }
        const box = $("#pwBox", el);
        const rows = [{ name: p.full_name, username: p.username || p.email, password: pw }];
        box.innerHTML = credentialsCard(rows);
        bindCredentials(box, rows);
      };
      if ($("#delStudent", el)) $("#delStudent", el).onclick = async () => {
        if (!confirm(`Permanently delete ${p.full_name}'s account and all their scores? This cannot be undone.`)) return;
        try { await window.Cloud.adminDeleteStudent(p.id); }
        catch (err) { msg.style.color = "var(--bad)"; msg.textContent = err.message; return; }
        st.data.profiles = st.data.profiles.filter((x) => x.id !== p.id);
        st.data.attempts = st.data.attempts.filter((a) => a.user_id !== p.id);
        st.student = null; render(view, st.subjects);
      };
      if ($("#approve", el)) $("#approve", el).onclick = () => {
        if (confirm(`Let ${p.full_name} into the class without the join code?`)) update({ joined: true }, "Approved.");
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
      <div class="card"><h3>📧 Email test results to</h3>
        <p class="small muted">Every 10 minutes, newly completed tests are emailed to this address with each score and the topics to revise. Leave it empty to stop the emails.</p>
        <div class="row"><input class="inline" id="notify" type="email" value="${esc(s.notify_email || "")}" placeholder="name@example.com" style="min-width:260px">
          <button class="btn" id="saveNotify">Save</button></div>
        <p class="small" id="notifyMsg"></p>
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
    $("#saveNotify", el).onclick = () => {
      const v = $("#notify", el).value.trim();
      if (v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { $("#notifyMsg", el).style.color = "var(--bad)"; $("#notifyMsg", el).textContent = "That doesn't look like an email address."; return; }
      save({ notify_email: v || null }, $("#notifyMsg", el));
    };
    $("#saveSchool", el).onclick =() => save({ school_name: $("#school", el).value.trim() || "Checkpoint Preparation" }, null);
    $("#csv2", el).onclick = exportCsv;
  }

  function exportCsv() {
    const { profiles, attempts } = st.data;
    const byId = Object.fromEntries(profiles.map((p) => [p.id, p]));
    const cell = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const rows = [["Date", "Student", "Login", "Subject", "Test", "Type", "Score", "Max", "Percent"]];
    attempts.forEach((a) => {
      const p = byId[a.user_id] || {};
      rows.push([new Date(a.created_at).toISOString().slice(0, 16).replace("T", " "), p.full_name, p.username || p.email, subjectName(a.subject_id), a.test_title || a.test_id, a.kind, a.score, a.max, pct(a.score, a.max)]);
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
