// Latest Cambridge education headlines from Google News, as JSON for the app's News tab.
// Netlify's CDN caches the response for 30 minutes, so Google News is asked at most twice an hour.
const QUERIES = [
  '"Cambridge International Education" OR "Cambridge International" exams',
  '"Cambridge Checkpoint" OR "Cambridge Lower Secondary" OR "Cambridge Primary"',
  '"Cambridge IGCSE" OR "Cambridge A Level" OR "Cambridge AS Level" results',
];
// Google matches words anywhere in an article, so keep only headlines that are clearly about Cambridge education.
const RELEVANT = /\b(cambridge (international|assessment|university press|exam|board|curriculum|school|checkpoint|lower secondary|primary|igcse|a ?level|as ?level|o ?level|result|paper|syllabus|qualification|english|associate|accredit)|igcse|cambridge.{0,40}\b(exam|result|paper|school|student|board|curriculum|level))/i;
const feedUrl = (q) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q + " when:60d")}&hl=en-IN&gl=IN&ceid=IN:en`;

const decode = (s) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
const tag = (xml, name) => { const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`)); return m ? decode(m[1]) : ""; };

async function fetchFeed(q) {
  const res = await fetch(feedUrl(q), { headers: { "User-Agent": "Mozilla/5.0 (compatible; CheckpointPrep/1.0)" } });
  if (!res.ok) throw new Error(`Google News ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => {
    const source = tag(it, "source");
    let title = tag(it, "title");
    if (source && title.endsWith(" - " + source)) title = title.slice(0, -(source.length + 3));
    return { title, source, link: tag(it, "link"), date: new Date(tag(it, "pubDate")).toISOString() };
  });
}

export default async () => {
  const results = await Promise.allSettled(QUERIES.map(fetchFeed));
  const seen = new Set();
  const items = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .filter((n) => n.title && /^https?:\/\//.test(n.link) && RELEVANT.test(n.title))
    .filter((n) => { const k = n.title.toLowerCase().replace(/\W+/g, " ").trim(); if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 40);
  const ok = items.length > 0;
  return new Response(JSON.stringify({ updated: new Date().toISOString(), items }), {
    status: ok ? 200 : 502,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=600",
      "Netlify-CDN-Cache-Control": ok ? "public, s-maxage=1800, stale-while-revalidate=3600" : "no-store",
    },
  });
};
