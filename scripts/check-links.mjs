// Requests every sourceUrl, repoUrl and README anchor base URL in content.json and expects HTTP 200.
// Run manually before deploy (`npm run check:links`), never inside the Vercel build.
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const content = JSON.parse(await readFile(path.join(root, "content", "content.json"), "utf8"));

const urls = new Set();
const add = (u) => u && urls.add(u.split("#")[0]);
for (const p of content.projects) {
  add(p.repoUrl);
  [...p.metrics, ...(p.facts ?? [])].forEach((m) => add(m.sourceUrl));
}
Object.values(content.signature.sources).forEach((s) => add(s.sourceUrl));
add(content.links.github);
add(content.site?.repoUrl);

let failed = 0;
const results = await Promise.all(
  [...urls].map(async (u) => {
    try {
      const res = await fetch(u, { method: "GET", redirect: "follow", headers: { "User-Agent": "check-links" } });
      return [u, res.status];
    } catch (e) {
      return [u, `error ${e.message}`];
    }
  }),
);
for (const [u, status] of results) {
  const ok = status === 200;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${status} ${u}`);
}
console.log(`\n${results.length} unique URLs checked, ${failed} failed`);
process.exit(failed ? 1 : 0);
