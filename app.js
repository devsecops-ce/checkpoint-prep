(function () {
  "use strict";

  const SUBJECTS = window.SUBJECTS || [];
  const STORE_KEY = "cp8.progress.v1";
  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const Cloud = window.Cloud || { enabled: false };

  // ---------- storage ----------
  // In cloud mode each signed-in user gets their own local cache; the server is the source of truth.
  const storeKey = () => (Cloud.enabled && Cloud.user ? `${STORE_KEY}.${Cloud.user.id}` : STORE_KEY);
  function load() {
    try { return JSON.parse(localStorage.getItem(storeKey())) || {}; } catch (e) { return {}; }
  }
  function save(data) {
    try { localStorage.setItem(storeKey(), JSON.stringify(data)); } catch (e) { /* storage unavailable */ }
  }
  let progress = Cloud.enabled ? {} : load();
  // progress[subjectId] = { tests: { testId: {best, max, last, attempts, date} }, topics: { topic: {got, max} }, read: {topicTitle: true} }
  function subj(id) {
    progress[id] = progress[id] || { tests: {}, topics: {}, read: {} };
    return progress[id];
  }

  // ---------- state & routing ----------
  const state = { subject: "home", section: "overview", run: null };
  function go(subject, section) {
    stopTimer();
    state.subject = subject;
    state.section = section || "overview";
    state.run = null;
    location.hash = subject === "home" ? "" : `${subject}/${state.section}`;
    render();
    window.scrollTo(0, 0);
  }
  function fromHash() {
    const [s, sec] = location.hash.replace(/^#\/?/, "").split("/");
    if (s && (SUBJECTS.some((x) => x.id === s) || (s === "admin" && isAdmin()))) { state.subject = s; state.section = sec || "overview"; }
  }

  // ---------- theme ----------
  const themeBtn = $("#themeBtn");
  try { const t = localStorage.getItem("cp8.theme"); if (t) document.documentElement.dataset.theme = t; } catch (e) {}
  themeBtn.onclick = () => {
    const dark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("cp8.theme", next); } catch (e) {}
  };

  // ---------- helpers ----------
  const totalMarks = (qs) => qs.reduce((a, q) => a + q.marks, 0);
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  function grade(p) {
    if (p >= 85) return { label: "Outstanding", cls: "good" };
    if (p >= 70) return { label: "Very good", cls: "good" };
    if (p >= 50) return { label: "Developing", cls: "warn" };
    return { label: "Needs practice", cls: "bad" };
  }
  function norm(s) {
    return String(s).toLowerCase()
      .replace(/[−–—]/g, "-").replace(/×/g, "x").replace(/÷/g, "/")
      .replace(/\s+/g, "").replace(/[.,;:!]+$/, "").replace(/^["']|["']$/g, "");
  }
  function subjectStats(s) {
    const p = subj(s.id);
    const all = [...s.papers, ...s.quickTests];
    const done = all.filter((t) => p.tests[t.id]);
    const avg = done.length ? Math.round(done.reduce((a, t) => a + pct(p.tests[t.id].best, p.tests[t.id].max), 0) / done.length) : null;
    const weak = Object.entries(p.topics)
      .filter(([, v]) => v.max >= 2)
      .map(([k, v]) => ({ topic: k, p: pct(v.got, v.max) }))
      .sort((a, b) => a.p - b.p);
    return { done: done.length, total: all.length, avg, weak, read: Object.keys(p.read).length };
  }

  // ---------- tabs ----------
  function renderTabs() {
    const nav = $("#subjectTabs");
    nav.innerHTML = "";
    const mk = (id, label, color) => {
      const b = document.createElement("button");
      b.className = "tab" + (state.subject === id ? " active" : "");
      b.style.setProperty("--c", color || "var(--accent)");
      b.innerHTML = label;
      b.onclick = () => go(id);
      nav.appendChild(b);
    };
    mk("home", "🏠 Dashboard");
    SUBJECTS.forEach((s) => mk(s.id, `${s.icon} ${esc(s.name)}`, s.color));
    if (isAdmin()) mk("admin", "🛠 Admin", "#475569");
  }
  const isAdmin = () => Cloud.enabled && Cloud.profile && Cloud.profile.role === "admin";

  function renderUserChip() {
    const box = $("#userBox");
    if (!box) return;
    if (!Cloud.enabled || !Cloud.profile) { box.innerHTML = ""; return; }
    box.innerHTML = `<span class="small muted">${esc(Cloud.profile.full_name)}${isAdmin() ? " · admin" : ""}</span>
      <button class="ghost small" id="logoutBtn">Log out</button>`;
    $("#logoutBtn").onclick = async () => {
      if (!confirm("Log out?")) return;
      await Cloud.signOut();
      progress = {};
      showAuth();
    };
  }

  // ---------- dashboard ----------
  function renderHome(view) {
    if (!SUBJECTS.length) {
      view.innerHTML = `<div class="card">No subject data found. Make sure the <code>data/</code> folder is next to index.html.</div>`;
      return;
    }
    let html = `
      <div class="card">
        <h2>Your path to outstanding marks</h2>
        <p class="muted">For each subject: read the topic notes, take a quick test, then sit the mock papers under timed conditions.
        Read every worked solution, even when you were right, and redo your weakest topics until you score 85% or more.</p>
        <div class="row small">
          <span class="pill good">85%+ Outstanding</span><span class="pill good">70%+ Very good</span>
          <span class="pill warn">50%+ Developing</span><span class="pill bad">&lt;50% Needs practice</span>
        </div>
      </div>
      <div class="grid">`;
    SUBJECTS.forEach((s) => {
      const st = subjectStats(s);
      const g = st.avg != null ? grade(st.avg) : null;
      html += `
        <div class="card subject-card" style="--c:${s.color}" data-go="${s.id}">
          <div class="row"><span style="font-size:28px">${s.icon}</span><h3 style="margin:0">${esc(s.name)}</h3></div>
          <div class="bar"><span style="width:${pct(st.done, st.total)}%"></span></div>
          <div class="small muted">${st.done}/${st.total} tests done · ${st.read}/${s.topics.length} topics revised</div>
          <div style="margin-top:8px">${g ? `<span class="pill ${g.cls}">Avg best ${st.avg}% · ${g.label}</span>` : `<span class="pill">Not started</span>`}</div>
          ${st.weak.length && st.weak[0].p < 70 ? `<div class="small" style="margin-top:8px">Focus next: <b>${esc(st.weak[0].topic)}</b> (${st.weak[0].p}%)</div>` : ""}
        </div>`;
    });
    html += `</div>
      <div class="card">
        <h3>Suggested weekly routine</h3>
        <ul class="tips">
          <li><b>Mon–Thu (30–40 min/day):</b> one subject per day. Revise 2 topics from the notes, then take a quick test.</li>
          <li><b>Fri:</b> redo every question you got wrong this week without looking at the solution first.</li>
          <li><b>Sat:</b> one full mock paper, timed and without notes. Mark it honestly with the mark scheme.</li>
          <li><b>Sun:</b> rest, or a short review of your "Focus next" topics.</li>
        </ul>
        ${Cloud.enabled ? "" : `<div class="row"><span class="spacer"></span><button class="btn secondary" id="resetAll">Reset all progress</button></div>`}
      </div>
      ${Cloud.enabled && Cloud.profile ? `<div class="card"><h3>My account</h3>
        <p class="small muted">${esc(Cloud.profile.full_name)} · ${esc(Cloud.profile.email || "")}</p>
        <div class="row"><button class="btn secondary" id="logout2">Log out</button><span class="spacer"></span>
          <button class="btn secondary" id="deleteAcct" style="color:var(--bad)">Delete my account</button></div>
        <p class="small" id="acctMsg"></p></div>` : ""}`;
    view.innerHTML = html;
    view.querySelectorAll("[data-go]").forEach((el) => (el.onclick = () => go(el.dataset.go)));
    if ($("#resetAll")) $("#resetAll").onclick = () => {
      if (confirm("Delete all saved scores and progress?")) { progress = {}; save(progress); render(); }
    };
    if ($("#logout2")) $("#logout2").onclick = () => $("#logoutBtn").click();
    if ($("#deleteAcct")) $("#deleteAcct").onclick = async () => {
      if (!confirm("Permanently delete your account and all your scores? This cannot be undone.")) return;
      try { await Cloud.deleteAccount(); progress = {}; showAuth(); }
      catch (e) { $("#acctMsg").style.color = "var(--bad)"; $("#acctMsg").textContent = e.message; }
    };
  }

  // ---------- subject ----------
  const SECTIONS = [
    ["overview", "Overview"],
    ["notes", "Topic Notes"],
    ["quick", "Quick Tests"],
    ["papers", "Mock Papers"],
    ["tips", "Exam Tips"],
  ];

  function renderSubject(view, s) {
    view.style.setProperty("--c", s.color);
    if (state.run) return renderRunner(view, s);
    const labels = s.labels || {};
    let html = `<div class="subtabs">` +
      SECTIONS.map(([k, l]) => `<button class="subtab ${state.section === k ? "active" : ""}" data-sec="${k}">${labels[k] || l}</button>`).join("") +
      `</div><div id="sec"></div>`;
    view.innerHTML = html;
    view.querySelectorAll("[data-sec]").forEach((b) => (b.onclick = () => go(s.id, b.dataset.sec)));
    const sec = $("#sec", view);
    ({ overview: secOverview, notes: secNotes, quick: secQuick, papers: secPapers, tips: secTips }[state.section] || secOverview)(sec, s);
  }

  function secOverview(el, s) {
    const st = subjectStats(s);
    el.innerHTML = `
      <div class="card hero">
        <div class="icon">${s.icon}</div>
        <div><h2 style="margin:0">${esc(s.name)}</h2><p class="muted" style="margin:4px 0 0">${s.overview}</p></div>
      </div>
      <div class="grid">
        <div class="card"><div class="muted small">Tests completed</div><div class="score-big">${st.done}<span class="muted" style="font-size:20px">/${st.total}</span></div></div>
        <div class="card"><div class="muted small">Average best score</div><div class="score-big">${st.avg != null ? st.avg + "%" : "–"}</div></div>
        <div class="card"><div class="muted small">Topics revised</div><div class="score-big">${st.read}<span class="muted" style="font-size:20px">/${s.topics.length}</span></div></div>
      </div>
      <div class="card"><h3>Exam format</h3><ul>${s.examFormat.map((x) => `<li>${x}</li>`).join("")}</ul></div>
      ${st.weak.length ? `<div class="card"><h3>Your topic strengths</h3>${st.weak.map((w) => {
        const g = grade(w.p);
        return `<div class="row small" style="margin:4px 0"><span style="min-width:200px">${esc(w.topic)}</span><span class="pill ${g.cls}">${w.p}%</span></div>`;
      }).join("")}</div>` : ""}
      <div class="row">
        <button class="btn" data-sec="notes">Start revising →</button>
        <button class="btn secondary" data-sec="papers">Go to ${((s.labels || {}).papers || "mock papers").toLowerCase()}</button>
      </div>`;
    el.querySelectorAll("[data-sec]").forEach((b) => (b.onclick = () => go(s.id, b.dataset.sec)));
  }

  function secNotes(el, s) {
    const p = subj(s.id);
    const strands = [...new Set(s.topics.map((t) => t.strand))];
    let html = `<p class="muted">Tap a topic to open it. Tick <b>Revised</b> once you can explain it without looking.</p>`;
    strands.forEach((str) => {
      html += `<h3 class="strand-h">${esc(str)}</h3>`;
      s.topics.filter((t) => t.strand === str).forEach((t) => {
        const i = s.topics.indexOf(t);
        html += `
          <details class="topic">
            <summary>${esc(t.title)} <span class="spacer"></span>${p.read[t.title] ? `<span class="pill good">✓ Revised</span>` : ""}</summary>
            <div class="body">
              <ul>${t.notes.map((n) => `<li>${n}</li>`).join("")}</ul>
              ${t.keyTerms && t.keyTerms.length ? `<p class="small"><b>Key terms:</b> ${t.keyTerms.map(esc).join(" · ")}</p>` : ""}
              ${t.commonMistakes && t.commonMistakes.length ? `<div class="solution" style="background:var(--warn-bg)"><h5>⚠ Common mistakes</h5><ul style="margin:0">${t.commonMistakes.map((m) => `<li>${m}</li>`).join("")}</ul></div>` : ""}
              ${t.example ? `<div class="example" style="margin-top:12px"><b>Worked example:</b> ${t.example.q}
                <details style="margin-top:8px"><summary class="small" style="cursor:pointer">Show solution</summary><div style="margin-top:6px">${t.example.a}</div></details></div>` : ""}
              <label class="row small" style="margin-top:12px"><input type="checkbox" data-read="${i}" ${p.read[t.title] ? "checked" : ""}> Revised</label>
            </div>
          </details>`;
      });
    });
    el.innerHTML = html;
    el.querySelectorAll("[data-read]").forEach((cb) => (cb.onchange = () => {
      const t = s.topics[+cb.dataset.read];
      if (cb.checked) p.read[t.title] = true; else delete p.read[t.title];
      save(progress);
      if (Cloud.enabled) Cloud.setRevised(s.id, t.title, cb.checked);
      const sum = cb.closest("details").querySelector("summary");
      const pill = sum.querySelector(".pill");
      if (cb.checked && !pill) sum.insertAdjacentHTML("beforeend", `<span class="pill good">✓ Revised</span>`);
      if (!cb.checked && pill) pill.remove();
    }));
  }

  function testList(el, s, tests, kind) {
    const p = subj(s.id);
    el.innerHTML = `<div class="grid">` + tests.map((t) => {
      const r = p.tests[t.id];
      const max = totalMarks(t.questions);
      const g = r ? grade(pct(r.best, r.max)) : null;
      return `<div class="card">
        <h3>${esc(t.title)}</h3>
        <div class="small muted">${t.questions.length} questions · ${max} marks${t.duration ? ` · ${t.duration} min` : ""}</div>
        <div style="margin:10px 0">${r ? `<span class="pill ${g.cls}">Best ${r.best}/${r.max} (${pct(r.best, r.max)}%)</span> <span class="small muted">${r.attempts} attempt${r.attempts > 1 ? "s" : ""}</span>` : `<span class="pill">Not attempted</span>`}</div>
        <div class="row">
          <button class="btn" data-start="${t.id}">${r ? "Retake" : "Start"}</button>
          ${kind === "paper" ? `<button class="btn secondary" data-view="${t.id}">View with solutions</button>` : ""}
        </div>
      </div>`;
    }).join("") + `</div>`;
    el.querySelectorAll("[data-start]").forEach((b) => (b.onclick = () => startRun(s, tests.find((t) => t.id === b.dataset.start), kind, false)));
    el.querySelectorAll("[data-view]").forEach((b) => (b.onclick = () => startRun(s, tests.find((t) => t.id === b.dataset.view), kind, true)));
  }
  function secQuick(el, s) {
    el.innerHTML = `<p class="muted">10-question multiple-choice checks, marked instantly. Aim for 9/10 before moving on.</p><div id="lst"></div>`;
    testList($("#lst", el), s, s.quickTests, "quick");
  }
  function secPapers(el, s) {
    el.innerHTML = s.labels && s.labels.papers
      ? `<p class="muted">Start at Level 1, even if it feels easy, because it finds hidden gaps. Score 80% or more to move up a level. Short answers are marked instantly. For written answers, compare yours with the mark scheme and award your own marks honestly.</p><div id="lst"></div>`
      : `<p class="muted">Five full exam-style mock papers with worked solutions and mark schemes. Sit them timed.
      Multiple-choice and short answers are marked automatically. For written answers, compare yours with the mark scheme and award your own marks honestly.</p><div id="lst"></div>`;
    testList($("#lst", el), s, s.papers, "paper");
  }
  // Each tip gets a picture category from its wording, so content files stay plain text.
  const TIP_KINDS = [
    { key: "command", icon: "🗣️", label: "Command words", color: "#7c3aed", re: /command word/i },
    { key: "practice", icon: "🔁", label: "Practise", color: "#d97706", re: /practi[cs]e|revis|routine|flashcard|daily|every day|memori[sz]e|error log|foundations/i },
    { key: "time", icon: "⏱️", label: "Time", color: "#2563eb", re: /\bminutes?\b|\bseconds?\b|time management|manage (your )?time|timing|budget|stuck|move on|per mark/i },
    { key: "check", icon: "✅", label: "Check", color: "#0d9488", re: /\bcheck|\bunits?\b|re-?read|proofread|estimate/i },
    { key: "read", icon: "🔍", label: "Read carefully", color: "#9333ea", re: /\bread\b|underline|question first|passage|source|scan|highlight/i },
    { key: "avoid", icon: "⚠️", label: "Avoid mistakes", color: "#dc2626", re: /mistake|never|don['’]t|do not|avoid|wrong|lose marks|lost marks|zero/i },
    { key: "marks", icon: "✍️", label: "Earn marks", color: "#16a34a", re: /\bmarks?\b|method|working|show|step|examiner/i },
  ];
  const TIP_DEFAULT = { key: "idea", icon: "💡", label: "Smart idea", color: "#475569" };
  const plain = (x) => x.replace(/<[^>]+>/g, "");
  // The headline says what a tip is about; the detail is only a fallback (and too often mentions
  // minutes in passing to count as a time tip).
  const tipKind = (head, body) => (head && TIP_KINDS.find((k) => k.re.test(plain(head))))
    || TIP_KINDS.find((k) => k.key !== "time" && k.re.test(plain(body))) || TIP_DEFAULT;

  // Split a tip into a short headline and the detail underneath.
  const capFirst = (x) => x.replace(/^(\s*(?:<[^>]+>\s*)*)([a-z])/, (m, pre, c) => pre + c.toUpperCase());
  function splitTip(t) {
    const bold = t.match(/^\s*<b>([\s\S]+?)<\/b>\s*([\s\S]*)$/);
    if (bold) return { head: bold[1].replace(/[.:]\s*$/, ""), body: capFirst(bold[2]) };
    const balanced = (x) => (x.match(/<b>/g) || []).length === (x.match(/<\/b>/g) || []).length;
    for (const m of t.matchAll(/[.:!?](?=\s+)/g)) {
      const head = t.slice(0, m.index + 1);
      if (head.length < 10 || /\b(e\.g|i\.e|etc|vs|approx)\.$/i.test(head) || !balanced(head)) continue;
      if (head.length > 120) break;
      return { head: head.replace(/[.:]$/, ""), body: capFirst(t.slice(m.index + 1).trim()) };
    }
    return { head: "", body: t };
  }

  function secTips(el, s) {
    const tips = s.tips.map((t, i) => { const p = splitTip(t); return { i, ...p, kind: tipKind(p.head, p.body) }; });
    const used = TIP_KINDS.concat([TIP_DEFAULT]).filter((k) => tips.some((t) => t.kind.key === k.key));
    el.innerHTML = `
      <div class="card">
        <h3>How to move from average to outstanding in ${esc(s.name)}</h3>
        <div class="row tip-filters">
          <button class="chip on" data-kind="all">All tips</button>
          ${used.map((k) => `<button class="chip" data-kind="${k.key}" style="--k:${k.color}">${k.icon} ${k.label}</button>`).join("")}
        </div>
      </div>
      <div class="tip-grid">
        ${tips.map((t) => `
          <div class="tip-card" data-kind="${t.kind.key}" style="--k:${t.kind.color}">
            <div class="tip-top"><span class="tip-icon">${t.kind.icon}</span><span class="tip-num">${t.i + 1}</span><span class="tip-label">${t.kind.label}</span></div>
            ${t.head ? `<div class="tip-head">${t.head}</div>` : ""}
            <div class="tip-body">${t.body}</div>
          </div>`).join("")}
      </div>

      <div class="card">
        <h3>🗣️ Command words: how deep to go</h3>
        <div class="ladder">
          <div class="step" style="--k:#2563eb"><div class="big">📝</div><b>State / Give</b><span>A short fact.<br>No reason needed.</span><em>1 line</em></div>
          <div class="arrow">➜</div>
          <div class="step" style="--k:#0d9488"><div class="big">👀</div><b>Describe</b><span>Say what happens<br>or the pattern.</span><em>2–3 lines</em></div>
          <div class="arrow">➜</div>
          <div class="step" style="--k:#d97706"><div class="big">🤔</div><b>Explain</b><span>Say <u>why</u>.<br>Use "because…"</span><em>Point + reason</em></div>
          <div class="arrow">➜</div>
          <div class="step" style="--k:#dc2626"><div class="big">⚖️</div><b>Evaluate</b><span>For ✔ and against ✘,<br>then your verdict.</span><em>Both sides + judgement</em></div>
        </div>
        <p class="small muted" style="margin-top:10px">The further right the word, the deeper your answer must go.</p>
      </div>

      <div class="card">
        <h3>🎯 Marks = points to make</h3>
        <div class="marks-viz">
          ${[1, 2, 3, 4].map((n) => `<div class="mrow"><span class="mlabel">${n} mark${n > 1 ? "s" : ""}</span>
            <span class="dots">${"●".repeat(n)}</span><span class="small">→ ${["one fact or answer", "two points, or method + answer", "three separate points or steps", "four points, or a full worked method"][n - 1]}</span></div>`).join("")}
        </div>
        <p class="small muted">Write each point as its own sentence, or each step on its own line, so the examiner can tick every one.</p>
      </div>

      <div class="card">
        <h3>🗓️ Exam day plan</h3>
        <div class="timeline">
          <div class="tl" style="--k:#2563eb"><div class="tl-dot">🌙</div><b>Night before</b><ul><li>Sleep 8+ hours</li><li>Pack pen, pencil, ruler, calculator</li><li>Light review only, nothing new</li></ul></div>
          <div class="tl" style="--k:#7c3aed"><div class="tl-dot">🔍</div><b>First 5 minutes</b><ul><li>Read every question</li><li>Spot the easy marks</li><li>Plan about 1 minute per mark</li></ul></div>
          <div class="tl" style="--k:#16a34a"><div class="tl-dot">✍️</div><b>During</b><ul><li>Show all working</li><li>Stuck for 2 minutes? Skip and come back</li><li>Never leave a blank</li></ul></div>
          <div class="tl" style="--k:#0d9488"><div class="tl-dot">✅</div><b>Last 5 minutes</b><ul><li>Units and rounding</li><li>Every part (a), (b), (c) done</li><li>Spelling of key words</li></ul></div>
        </div>
      </div>`;

    el.querySelectorAll(".chip").forEach((c) => (c.onclick = () => {
      el.querySelectorAll(".chip").forEach((x) => x.classList.toggle("on", x === c));
      el.querySelectorAll(".tip-card").forEach((card) => {
        card.style.display = c.dataset.kind === "all" || card.dataset.kind === c.dataset.kind ? "" : "none";
      });
    }));
  }

  // ---------- test runner ----------
  let timerId = null;
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  function startRun(s, test, kind, reviewOnly) {
    state.run = { key: `${s.id}:${test.id}:${Date.now()}`, test, kind, answers: {}, self: {}, submitted: reviewOnly, reviewOnly, endsAt: null };
    if (!reviewOnly && test.duration) state.run.endsAt = Date.now() + test.duration * 60000;
    render();
    window.scrollTo(0, 0);
  }

  function autoMark(q, a) {
    if (q.type === "mcq") return a === q.answer ? q.marks : 0;
    if (q.type === "short") {
      if (a == null || a === "") return 0;
      const n = norm(a);
      return [q.answer, ...(q.accept || [])].some((x) => norm(x) === n) ? q.marks : 0;
    }
    return null; // long: self-marked
  }

  function renderRunner(view, s) {
    const run = state.run;
    const { test } = run;
    const max = totalMarks(test.questions);
    let html = `<div class="runner-head">
      <button class="ghost" id="back">← Back</button>
      <b>${esc(test.title)}</b>
      <span class="spacer"></span>
      ${run.endsAt && !run.submitted ? `<span class="timer" id="timer"></span>` : ""}
      <span class="small muted">${max} marks</span>
    </div>`;

    if (run.submitted && !run.reviewOnly) html += resultCard(test, run);
    if (test.intro) html += `<p class="muted">${test.intro}</p>`;
    if (test.passage) html += `<div class="passage">${test.passage}</div>`;

    test.questions.forEach((q, i) => {
      const a = run.answers[i];
      let cls = "";
      if (run.submitted && !run.reviewOnly && q.type !== "long") cls = autoMark(q, a) === q.marks ? "correct" : "wrong";
      html += `<div class="q ${cls}" id="q${i}">
        <div class="qhead"><span class="qnum">Q${i + 1}</span><span class="small muted">${esc(q.topic)} · ${q.marks} mark${q.marks > 1 ? "s" : ""}</span></div>
        ${q.passage ? `<div class="passage">${q.passage}</div>` : ""}
        <div>${q.q}</div>`;
      if (q.type === "mcq") {
        q.options.forEach((o, j) => {
          let oc = "";
          if (run.submitted) { if (j === q.answer) oc = "right"; else if (a === j) oc = "chosen-wrong"; }
          html += `<label class="opt ${oc}"><input type="radio" name="q${i}" value="${j}" ${a === j ? "checked" : ""} ${run.submitted ? "disabled" : ""}><span><b>${String.fromCharCode(65 + j)}.</b> ${o}</span></label>`;
        });
      } else if (q.type === "short") {
        html += `<input type="text" data-q="${i}" placeholder="Your answer" value="${a != null ? esc(a) : ""}" ${run.submitted ? "disabled" : ""} style="margin-top:8px">`;
      } else {
        html += `<textarea data-q="${i}" placeholder="Write your answer / working here" ${run.submitted ? "disabled" : ""} style="margin-top:8px">${a != null ? esc(a) : ""}</textarea>`;
      }
      if (run.submitted) {
        html += `<div class="solution">
          ${q.type !== "mcq" ? `<h5>Model answer</h5><div>${q.answer}</div><br>` : ""}
          <h5>${q.type === "long" ? "Mark scheme & explanation" : "Explanation"}</h5><div>${q.solution}</div>
        </div>`;
        if (q.type === "long" && !run.reviewOnly) {
          html += `<div class="small" style="margin-top:10px">Award your marks honestly against the mark scheme:</div><div class="selfmark">` +
            Array.from({ length: q.marks + 1 }, (_, m) => `<button data-self="${i}" data-m="${m}" class="${run.self[i] === m ? "on" : ""}">${m}</button>`).join("") + `</div>`;
        }
      }
      html += `</div>`;
    });

    if (!run.submitted) html += `<div class="row"><span class="spacer"></span><button class="btn" id="submit">Submit & mark</button></div>`;
    else if (!run.reviewOnly) html += `<div class="row"><button class="btn secondary" id="retry">Retake</button><span class="spacer"></span><button class="btn" id="done">Done</button></div>`;
    view.innerHTML = html;

    // events
    $("#back", view).onclick = () => {
      if (!run.submitted && Object.keys(run.answers).length && !confirm("Leave this test? Your answers will be lost.")) return;
      go(s.id, run.kind === "paper" ? "papers" : "quick");
    };
    view.querySelectorAll("input[type=radio]").forEach((r) => (r.onchange = () => { run.answers[+r.name.slice(1)] = +r.value; }));
    view.querySelectorAll("[data-q]").forEach((t) => (t.oninput = () => { run.answers[+t.dataset.q] = t.value; }));
    view.querySelectorAll("[data-self]").forEach((b) => (b.onclick = () => {
      run.self[+b.dataset.self] = +b.dataset.m;
      record(s, run);
      const y = window.scrollY;
      render();
      window.scrollTo(0, y);
    }));
    if ($("#submit", view)) $("#submit", view).onclick = () => submit(s);
    if ($("#retry", view)) $("#retry", view).onclick = () => startRun(s, test, run.kind, false);
    if ($("#done", view)) $("#done", view).onclick = () => go(s.id, run.kind === "paper" ? "papers" : "quick");

    stopTimer();
    if (run.endsAt && !run.submitted) {
      const tick = () => {
        const left = Math.max(0, run.endsAt - Date.now());
        const el = $("#timer");
        if (!el) return stopTimer();
        const m = Math.floor(left / 60000), sec = Math.floor((left % 60000) / 1000);
        el.textContent = `⏱ ${m}:${String(sec).padStart(2, "0")}`;
        el.classList.toggle("low", left < 5 * 60000);
        if (left === 0) { stopTimer(); alert("Time is up! Your paper will now be marked."); submit(s); }
      };
      tick();
      timerId = setInterval(tick, 1000);
    }
  }

  function scoreRun(run) {
    let got = 0, pending = 0;
    run.test.questions.forEach((q, i) => {
      const m = autoMark(q, run.answers[i]);
      if (m == null) { if (run.self[i] == null) pending += q.marks; else got += run.self[i]; }
      else got += m;
    });
    return { got, pending, max: totalMarks(run.test.questions) };
  }

  function resultCard(test, run) {
    const { got, pending, max } = scoreRun(run);
    const p = pct(got, max);
    const g = grade(p);
    const wrongTopics = [...new Set(test.questions.filter((q, i) => {
      const m = autoMark(q, run.answers[i]);
      return m != null ? m < q.marks : run.self[i] != null && run.self[i] < q.marks;
    }).map((q) => q.topic))];
    return `<div class="card">
      <div class="row"><div class="score-big">${got}/${max}</div><span class="pill ${g.cls}">${p}% · ${g.label}</span></div>
      ${pending ? `<p class="warn small" style="color:var(--warn)">${pending} marks are still waiting for self-marking. Scroll down and award marks for the written answers.</p>` : ""}
      ${wrongTopics.length ? `<p class="small"><b>Revise:</b> ${wrongTopics.map(esc).join(", ")}</p>` : `<p class="small">Perfect on every marked question. Excellent work!</p>`}
      <p class="small muted">Read every explanation below, including for questions you got right.</p>
    </div>`;
  }

  function record(s, run) {
    const p = subj(s.id);
    const { got, max } = scoreRun(run);
    const prev = p.tests[run.test.id];
    if (!run.recorded) {
      p.tests[run.test.id] = { best: Math.max(got, prev ? prev.best : 0), max, last: got, attempts: (prev ? prev.attempts : 0) + 1, date: Date.now() };
      run.recorded = { topicsSnapshot: JSON.parse(JSON.stringify(p.topics)) };
    } else {
      p.tests[run.test.id].last = got;
      p.tests[run.test.id].best = Math.max(got, run.prevBest || 0);
    }
    // rebuild topic stats from the snapshot so re-marking doesn't double count
    p.topics = JSON.parse(JSON.stringify(run.recorded.topicsSnapshot));
    const runTopics = {};
    run.test.questions.forEach((q, i) => {
      let m = autoMark(q, run.answers[i]);
      if (m == null) m = run.self[i];
      if (m == null) return;
      const t = (p.topics[q.topic] = p.topics[q.topic] || { got: 0, max: 0 });
      t.got += m; t.max += q.marks;
      const r = (runTopics[q.topic] = runTopics[q.topic] || { got: 0, max: 0 });
      r.got += m; r.max += q.marks;
    });
    save(progress);
    if (Cloud.enabled) {
      Cloud.saveAttempt(run.key, {
        subject_id: s.id, test_id: run.test.id, test_title: run.test.title,
        kind: run.kind, score: got, max, topics: runTopics,
      });
    }
  }

  function submit(s) {
    const run = state.run;
    const unanswered = run.test.questions.filter((q, i) => run.answers[i] == null || run.answers[i] === "").length;
    if (unanswered && run.endsAt && Date.now() < run.endsAt && !confirm(`${unanswered} question(s) unanswered. Submit anyway?`)) return;
    if (!run.endsAt && unanswered && !confirm(`${unanswered} question(s) unanswered. Submit anyway?`)) return;
    stopTimer();
    run.prevBest = (subj(s.id).tests[run.test.id] || {}).best || 0;
    run.submitted = true;
    record(s, run);
    render();
    window.scrollTo(0, 0);
  }

  // ---------- main render ----------
  function render() {
    renderTabs();
    renderUserChip();
    const view = $("#view");
    view.style.removeProperty("--c");
    view.classList.remove("admin");
    if (state.subject === "admin" && isAdmin() && window.Admin) return window.Admin.render(view, SUBJECTS);
    const s = SUBJECTS.find((x) => x.id === state.subject);
    if (!s) renderHome(view); else renderSubject(view, s);
  }

  // ---------- accounts ----------
  function showAuth(message) {
    stopTimer();
    state.subject = "home"; state.section = "overview"; state.run = null;
    history.replaceState(null, "", location.pathname + location.search);
    $("#subjectTabs").innerHTML = "";
    renderUserChip();
    const view = $("#view");
    let mode = "login";
    const draw = (msg, isErr) => {
      view.innerHTML = `
        <div class="card auth">
          <h2>${mode === "login" ? "Welcome back 👋" : mode === "signup" ? "Create your account" : "Reset password"}</h2>
          <p class="muted small">${mode === "signup" ? "Ask your teacher or admin for the class join code." : "Log in to save your progress and see it on any device."}</p>
          ${Cloud.googleEnabled && mode !== "reset" ? `
            <button class="btn google-btn" id="googleBtn" type="button"><span class="g-logo">G</span> Continue with Google</button>
            <div class="or-line"><span>or use email</span></div>` : ""}
          <form id="authForm">
            ${mode === "signup" ? `<label>Full name<input name="name" required autocomplete="name"></label>` : ""}
            <label>Email<input name="email" type="email" required autocomplete="email"></label>
            ${mode !== "reset" ? `<label>Password<input name="password" type="password" required minlength="6" autocomplete="${mode === "signup" ? "new-password" : "current-password"}"></label>` : ""}
            ${mode === "signup" ? `<label>Class join code <span class="muted small">(leave empty only when creating the very first admin account)</span><input name="code" autocapitalize="characters"></label>` : ""}
            ${msg ? `<p class="small" style="color:var(${isErr ? "--bad" : "--good"})">${esc(msg)}</p>` : ""}
            <button class="btn" type="submit" style="width:100%">${mode === "login" ? "Log in" : mode === "signup" ? "Create account" : "Send reset link"}</button>
          </form>
          <div class="row small" style="margin-top:12px">
            ${mode !== "login" ? `<a href="#" data-mode="login">Back to log in</a>` : `<a href="#" data-mode="signup">New student? Create account</a><span class="spacer"></span><a href="#" data-mode="reset">Forgot password?</a>`}
          </div>
        </div>`;
      view.querySelectorAll("[data-mode]").forEach((a) => (a.onclick = (e) => { e.preventDefault(); mode = a.dataset.mode; draw(); }));
      if ($("#googleBtn")) $("#googleBtn").onclick = async () => {
        $("#googleBtn").disabled = true;
        try { await Cloud.signInWithGoogle(); } catch (err) { draw(err.message, true); }
      };
      $("#authForm").onsubmit = async (e) => {
        e.preventDefault();
        const f = new FormData(e.target);
        const btn = e.target.querySelector("button");
        btn.disabled = true; btn.textContent = "Please wait…";
        try {
          if (mode === "login") { await Cloud.signIn(f.get("email"), f.get("password")); return enterApp(); }
          if (mode === "signup") {
            const r = await Cloud.signUp({ email: f.get("email"), password: f.get("password"), fullName: f.get("name"), joinCode: f.get("code") });
            if (r.needsConfirm) { mode = "login"; return draw("Account created. Check your email to confirm it, then log in."); }
            return enterApp();
          }
          await Cloud.resetPassword(f.get("email"));
          mode = "login"; draw("If that email has an account, a reset link is on its way.");
        } catch (err) { draw(err.message, true); }
      };
    };
    draw(message, true);
  }

  // A Google sign-in that hasn't entered the class join code yet.
  function showJoin(message) {
    $("#subjectTabs").innerHTML = "";
    renderUserChip();
    const view = $("#view");
    view.innerHTML = `
      <div class="card auth">
        <h2>One last step 🎓</h2>
        <p class="muted small">Hi ${esc(Cloud.profile.full_name)}! Enter your class join code to finish setting up your account. You only do this once.</p>
        <form id="joinForm">
          <label>Class join code<input name="code" required autocapitalize="characters" autocomplete="off"></label>
          ${message ? `<p class="small" style="color:var(--bad)">${esc(message)}</p>` : ""}
          <button class="btn" type="submit" style="width:100%">Join class</button>
        </form>
        <div class="row small" style="margin-top:12px"><a href="#" id="joinLogout">Use a different account</a></div>
      </div>`;
    $("#joinForm").onsubmit = async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector("button");
      btn.disabled = true; btn.textContent = "Please wait…";
      try { await Cloud.joinClass(new FormData(e.target).get("code")); enterApp(); }
      catch (err) { showJoin(err.message); }
    };
    $("#joinLogout").onclick = async (e) => { e.preventDefault(); await Cloud.signOut(); showAuth(); };
  }

  async function enterApp() {
    if (Cloud.profile && Cloud.profile.joined === false) return showJoin();
    const view = $("#view");
    view.innerHTML = `<div class="card muted">Loading your progress…</div>`;
    progress = load(); // cached copy for this user, shown if the server can't be reached
    try { progress = await Cloud.loadProgress(); save(progress); }
    catch (e) { /* offline: keep the cached copy */ }
    fromHash();
    render();
  }

  async function boot() {
    fromHash();
    if (!Cloud.enabled) return render();
    $("#view").innerHTML = `<div class="card muted">Loading…</div>`;
    try {
      if (await Cloud.restore()) return enterApp();
      showAuth();
    } catch (e) { showAuth(e.message); }
  }
  boot();
})();
