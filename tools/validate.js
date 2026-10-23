// Validates subject data files. Usage: node tools/validate.js [data/maths.js ...]
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dataDir = path.join(__dirname, "..", "data");
const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(dataDir).filter((f) => f.endsWith(".js")).map((f) => path.join(dataDir, f));

let errors = 0;
const err = (f, msg) => { errors++; console.error(`✗ ${path.basename(f)}: ${msg}`); };

function checkQuestion(f, where, q, mcqOnly) {
  if (!q || typeof q.q !== "string" || !q.q.trim()) return err(f, `${where}: missing q`);
  if (!["mcq", "short", "long"].includes(q.type)) return err(f, `${where}: bad type ${q.type}`);
  if (mcqOnly && q.type !== "mcq") err(f, `${where}: quick tests must be mcq`);
  if (!Number.isInteger(q.marks) || q.marks < 1) err(f, `${where}: marks must be positive integer`);
  if (typeof q.solution !== "string" || q.solution.length < 10) err(f, `${where}: solution too short`);
  if (typeof q.topic !== "string" || !q.topic) err(f, `${where}: missing topic`);
  if (q.type === "mcq") {
    if (!Array.isArray(q.options) || q.options.length < 3) err(f, `${where}: mcq needs >=3 options`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options || []).length) err(f, `${where}: mcq answer index invalid`);
  } else if (q.type === "short") {
    if (typeof q.answer !== "string" || !q.answer) err(f, `${where}: short needs answer string`);
    if (!Array.isArray(q.accept) || !q.accept.length) err(f, `${where}: short needs accept[]`);
  } else {
    if (typeof q.answer !== "string" || !q.answer) err(f, `${where}: long needs model answer string`);
  }
}

for (const f of files) {
  const sandbox = { window: {} };
  try {
    vm.runInNewContext(fs.readFileSync(f, "utf8"), sandbox, { filename: f });
  } catch (e) { err(f, `syntax/runtime error: ${e.message}`); continue; }
  const list = sandbox.window.SUBJECTS;
  if (!Array.isArray(list) || list.length !== 1) { err(f, "must push exactly one subject to window.SUBJECTS"); continue; }
  const s = list[0];
  for (const k of ["id", "name", "icon", "color", "overview"]) if (typeof s[k] !== "string" || !s[k]) err(f, `missing ${k}`);
  if (!Array.isArray(s.examFormat) || !s.examFormat.length) err(f, "examFormat[] required");
  if (!Array.isArray(s.tips) || s.tips.length < 8) err(f, "tips[] needs >= 8");
  if (!Array.isArray(s.topics) || s.topics.length < 10) err(f, "topics[] needs >= 10");
  (s.topics || []).forEach((t, i) => {
    if (!t.strand || !t.title) err(f, `topics[${i}] needs strand,title`);
    if (!Array.isArray(t.notes) || t.notes.length < 3) err(f, `topics[${i}] needs >=3 notes`);
    if (t.example && (!t.example.q || !t.example.a)) err(f, `topics[${i}].example needs q,a`);
  });
  if (!Array.isArray(s.papers) || s.papers.length !== 5) err(f, "papers[] must have exactly 5");
  (s.papers || []).forEach((p, i) => {
    if (!p.id || !p.title || !Number.isInteger(p.duration)) err(f, `papers[${i}] needs id,title,duration`);
    if (!Array.isArray(p.questions) || p.questions.length < 10) err(f, `papers[${i}] needs >=10 questions`);
    (p.questions || []).forEach((q, j) => checkQuestion(f, `papers[${i}].q[${j}]`, q, false));
  });
  if (!Array.isArray(s.quickTests) || s.quickTests.length < 3) err(f, "quickTests[] needs >= 3");
  (s.quickTests || []).forEach((t, i) => {
    if (!t.id || !t.title) err(f, `quickTests[${i}] needs id,title`);
    if (!Array.isArray(t.questions) || t.questions.length < 10) err(f, `quickTests[${i}] needs >=10 questions`);
    (t.questions || []).forEach((q, j) => checkQuestion(f, `quickTests[${i}].q[${j}]`, q, true));
  });
  if (!errors) {
    const nq = s.papers.reduce((a, p) => a + p.questions.length, 0) + s.quickTests.reduce((a, t) => a + t.questions.length, 0);
    console.log(`✓ ${path.basename(f)}: ${s.name} — ${s.topics.length} topics, ${nq} questions`);
  }
}
process.exit(errors ? 1 : 0);
