// Cloud sync: accounts, roles and progress via Supabase. Inactive when config.js is empty.
(function () {
  "use strict";

  const cfg = window.APP_CONFIG || {};
  const enabled = !!(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  const QUEUE_KEY = "cp8.syncQueue.v1";

  const Cloud = { enabled, user: null, profile: null, client: null };
  // Google blocks sign-in inside embedded app web views, so only offer it on the real website.
  Cloud.googleEnabled = enabled && cfg.googleSignIn === true && /^https?:$/.test(location.protocol);
  if (!enabled) { window.Cloud = Cloud; return; }

  const sb = (Cloud.client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  }));

  function friendly(error) {
    const m = (error && error.message) || String(error);
    if (/Database error saving new user|Invalid join code/i.test(m)) return "That join code is not correct. Ask your teacher or admin for the class code.";
    if (/Invalid login credentials/i.test(m)) return "Username/email or password is wrong.";
    if (/Email not confirmed/i.test(m)) return "Please confirm your email first (check your inbox), then log in.";
    if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return "No internet connection. Please try again when you are online.";
    if (/provider is not enabled|Unsupported provider/i.test(m)) return "Google sign-in isn't switched on yet. Please use email and password for now.";
    return m;
  }
  Cloud.friendly = friendly;

  async function loadProfile() {
    const { data, error } = await sb.from("profiles").select("*").eq("id", Cloud.user.id).single();
    if (error) throw error;
    Cloud.profile = data;
    sb.from("profiles").update({ last_seen: new Date().toISOString() }).eq("id", data.id).then(() => {});
  }

  // Returns true when a usable, active session exists.
  Cloud.restore = async function () {
    const { data } = await sb.auth.getSession();
    if (!data.session) return false;
    Cloud.user = data.session.user;
    try { await loadProfile(); } catch (e) { return false; }
    if (!Cloud.profile.active) { await Cloud.signOut(); throw new Error("Your account has been deactivated. Please contact your admin."); }
    flushQueue();
    return true;
  };

  // Admin-created students log in with a username, stored as <username>@students.checkpoint.local
  // (see student_email() in supabase/schema.sql).
  const STUDENT_DOMAIN = "students.checkpoint.local";
  Cloud.loginName = (p) => (p && p.username) || (p && p.email) || "";
  Cloud.signIn = async function (login, password) {
    const id = login.trim().toLowerCase();
    const email = id.includes("@") ? id : `${id}@${STUDENT_DOMAIN}`;
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw new Error(friendly(error));
    Cloud.user = data.user;
    await loadProfile();
    if (!Cloud.profile.active) { await Cloud.signOut(); throw new Error("Your account has been deactivated. Please contact your admin."); }
    flushQueue();
  };

  Cloud.signUp = async function ({ email, password, fullName, joinCode }) {
    const { data, error } = await sb.auth.signUp({
      email: email.trim(), password,
      options: { data: { full_name: fullName.trim(), join_code: joinCode.trim(), grade: "Stage 8" } },
    });
    if (error) throw new Error(friendly(error));
    if (!data.session) return { needsConfirm: true };
    Cloud.user = data.user;
    await loadProfile();
    return { needsConfirm: false };
  };

  Cloud.signInWithGoogle = async function () {
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: location.origin + location.pathname, queryParams: { prompt: "select_account" } },
    });
    if (error) throw new Error(friendly(error));
    // the browser now leaves for Google and comes back signed in
  };

  // After a Google sign-in, the student enters the class join code once.
  Cloud.joinClass = async function (code) {
    const { data, error } = await sb.rpc("join_class", { code: code.trim() });
    if (error) throw new Error(friendly(error));
    if (!data) throw new Error("That join code is not correct. Ask your teacher or admin for the class code.");
    await loadProfile();
  };

  Cloud.resetPassword = async function (email) {
    const { error } = await sb.auth.resetPasswordForEmail(email.trim());
    if (error) throw new Error(friendly(error));
  };

  // ---------- admin: student accounts ----------
  const rpc = async (fn, args) => {
    const { data, error } = await sb.rpc(fn, args);
    if (error) throw new Error(friendly(error));
    return data;
  };
  Cloud.adminCreateStudent = (username, password, fullName) =>
    rpc("admin_create_student", { p_username: username, p_password: password, p_full_name: fullName });
  Cloud.adminSetPassword = (userId, password) => rpc("admin_set_password", { p_user: userId, p_password: password });
  Cloud.adminDeleteStudent = (userId) => rpc("admin_delete_student", { p_user: userId });

  Cloud.deleteAccount = async function () {
    const { error } = await sb.rpc("delete_my_account");
    if (error) throw new Error(friendly(error));
    try { localStorage.removeItem(`cp8.progress.v1.${Cloud.user.id}`); } catch (e) {}
    await Cloud.signOut();
  };

  Cloud.signOut = async function () {
    await sb.auth.signOut();
    Cloud.user = null; Cloud.profile = null;
  };

  // Rebuild the app's local progress shape from the server.
  Cloud.loadProgress = async function () {
    const [att, rev] = await Promise.all([
      sb.from("attempts").select("subject_id,test_id,score,max,topics,created_at").eq("user_id", Cloud.user.id).order("created_at"),
      sb.from("revised").select("subject_id,topic").eq("user_id", Cloud.user.id),
    ]);
    if (att.error) throw att.error;
    if (rev.error) throw rev.error;
    const progress = {};
    const subj = (id) => (progress[id] = progress[id] || { tests: {}, topics: {}, read: {} });
    att.data.forEach((a) => {
      const p = subj(a.subject_id);
      const prev = p.tests[a.test_id];
      p.tests[a.test_id] = {
        best: Math.max(a.score, prev ? prev.best : 0), max: a.max, last: a.score,
        attempts: (prev ? prev.attempts : 0) + 1, date: Date.parse(a.created_at),
      };
      Object.entries(a.topics || {}).forEach(([t, v]) => {
        const x = (p.topics[t] = p.topics[t] || { got: 0, max: 0 });
        x.got += v.got; x.max += v.max;
      });
    });
    rev.data.forEach((r) => { subj(r.subject_id).read[r.topic] = true; });
    return progress;
  };

  // ---------- writes, with an offline retry queue ----------
  function readQueue() { try { return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []; } catch (e) { return []; } }
  function writeQueue(q) { try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); } catch (e) {} }

  async function send(op) {
    if (op.type === "attempt") {
      // op.key identifies one sitting of a test so self-marking updates the same row
      const known = Cloud._attemptIds[op.key];
      if (known) {
        const { error } = await sb.from("attempts").update({ score: op.row.score, topics: op.row.topics, answers: op.row.answers }).eq("id", known);
        if (error) throw error;
      } else {
        const { data, error } = await sb.from("attempts").insert({ ...op.row, user_id: Cloud.user.id }).select("id").single();
        if (error) throw error;
        Cloud._attemptIds[op.key] = data.id;
      }
    } else if (op.type === "revised") {
      const q = op.on
        ? sb.from("revised").upsert({ user_id: Cloud.user.id, subject_id: op.subject_id, topic: op.topic })
        : sb.from("revised").delete().match({ user_id: Cloud.user.id, subject_id: op.subject_id, topic: op.topic });
      const { error } = await q;
      if (error) throw error;
    }
  }
  Cloud._attemptIds = {};

  // Re-reads the queue after every send so ops added mid-flush are never overwritten.
  let flushing = false;
  async function flushQueue() {
    if (flushing || !Cloud.user) return;
    flushing = true;
    try {
      for (;;) {
        const op = Cloud.user && readQueue().find((o) => o.uid === Cloud.user.id);
        if (!op) break;
        try { await send(op); } catch (e) { break; }
        writeQueue(readQueue().filter((o) => o.qid !== op.qid));
      }
    } finally { flushing = false; }
  }
  window.addEventListener("online", flushQueue);

  function enqueue(op) {
    if (!Cloud.user) return;
    op.uid = Cloud.user.id;
    op.qid = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const q = readQueue();
    // collapse repeated updates of the same attempt into the latest one
    const i = op.type === "attempt" ? q.findIndex((x) => x.type === "attempt" && x.key === op.key) : -1;
    if (i >= 0) q[i] = op; else q.push(op);
    writeQueue(q);
    flushQueue();
  }

  Cloud.saveAttempt = function (key, row) { enqueue({ type: "attempt", key, row }); };
  Cloud.setRevised = function (subject_id, topic, on) { enqueue({ type: "revised", subject_id, topic, on }); };

  window.Cloud = Cloud;
})();
