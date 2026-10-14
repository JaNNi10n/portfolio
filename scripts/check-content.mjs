// Build guards. Runs before `next build` (sources) and after it with --rendered (built HTML).
// Fails the build on: em/en dashes, phone-like numbers or personal-data words, unsourced metrics,
// any credit-risk metric or SHAP waterfall use, links into gitignored indexes/, hover/press lifts,
// scroll listeners, and banned motion/icon libraries.
// The real phone number is never written here: set PRIVATE_PHONE_DIGITS locally to add it.
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const rendered = process.argv.includes("--rendered");
const errors = [];
const err = (msg) => errors.push(msg);

async function walk(dir, exts) {
  const out = [];
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p, exts)));
    else if (exts.some((x) => e.name.endsWith(x))) out.push(p);
  }
  return out;
}

const rel = (p) => path.relative(root, p).replaceAll("\\", "/");
const read = (p) => readFile(p, "utf8");

const DASH = new RegExp("[\u2014\u2013]");
const PHONE = /(?<![\w.%/-])(?:\+?91[\s-]?)?[6-9]\d{9}(?![\w])/;
const PRIVATE = process.env.PRIVATE_PHONE_DIGITS?.replace(/\D/g, "");
const PERSONAL_WORDS = [/date of birth/i, /\bDOB\b/, /\bpincode\b/i, /\bPIN code\b/i];

function checkPrivacy(text, where) {
  const m = text.match(PHONE);
  if (m) err(`${where}: phone-like number "${m[0]}"`);
  if (PRIVATE && text.replace(/\D/g, "").includes(PRIVATE)) err(`${where}: contains the private phone digits`);
  for (const w of PERSONAL_WORDS) if (w.test(text)) err(`${where}: personal-data word ${w}`);
}

function checkDashes(text, where) {
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    if (DASH.test(line)) err(`${where}:${i + 1}: em or en dash`);
  });
}

// ---------- Content ----------
const contentPath = path.join(root, "content", "content.json");
const contentText = await read(contentPath);
const content = JSON.parse(contentText);
checkDashes(contentText, "content/content.json");
checkPrivacy(contentText, "content/content.json");

const sourced = (item, where) => {
  if (!item || !item.source || !item.sourceUrl) err(`${where}: missing source or sourceUrl`);
  else if (item.sourceUrl.includes("/indexes/")) err(`${where}: sourceUrl points into gitignored indexes/`);
};
for (const p of content.projects) {
  p.metrics.forEach((m, i) => sourced(m, `${p.slug}.metrics[${i}]`));
  (p.facts ?? []).forEach((m, i) => sourced(m, `${p.slug}.facts[${i}]`));
  if (p.slug === "credit-risk" && p.metrics.length !== 0) err("credit-risk must have an empty metrics array");
}
for (const [k, s] of Object.entries(content.signature?.sources ?? {})) sourced(s, `signature.sources.${k}`);
if (!content.signature) err("content.json is missing the signature block");

// ---------- Sources ----------
const srcFiles = [
  ...(await walk(path.join(root, "app"), [".ts", ".tsx", ".css"])),
  ...(await walk(path.join(root, "components"), [".ts", ".tsx"])),
  ...(await walk(path.join(root, "lib"), [".ts", ".tsx"])),
];

const HOVER_UTILS =
  /\b(?:hover:-?translate|hover:scale|hover:shadow|group-hover:-?translate|group-hover:scale|group-hover:shadow|active:scale|active:-?translate|focus:scale)/;
const BANNED_IMPORT = /from\s+["'](?:gsap|motion|motion\/react|framer-motion|lenis|@studio-freight\/lenis|lucide-react)["']/;

for (const f of srcFiles) {
  const text = await read(f);
  const where = rel(f);
  checkDashes(text, where);
  checkPrivacy(text, where);
  if (HOVER_UTILS.test(text)) err(`${where}: hover/press transform or shadow utility`);
  if (/addEventListener\(\s*["']scroll["']/.test(text)) err(`${where}: scroll event listener`);
  if (BANNED_IMPORT.test(text)) err(`${where}: banned library import`);
  if ((where.startsWith("app/") || where.startsWith("components/")) && text.includes("credit-shap-waterfall-synthetic")) {
    err(`${where}: references the synthetic SHAP waterfall`);
  }
  if (f.endsWith(".css")) {
    // Any :hover, :focus or :active rule that moves or lifts something.
    const rules = text.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g);
    for (const [, selector, body] of rules) {
      if (/:(hover|focus|focus-visible|focus-within|active)\b/.test(selector) && /\b(transform|translate|scale|box-shadow)\s*:/.test(body)) {
        err(`${where}: "${selector.trim()}" changes transform or shadow`);
      }
    }
  }
}

// Public text files
for (const f of await walk(path.join(root, "public"), [".txt", ".svg", ".json", ".xml", ".html"])) {
  if (rel(f).startsWith("public/assets/fonts/")) continue; // OFL licence text
  checkPrivacy(await read(f), rel(f));
}

// ---------- Rendered output ----------
if (rendered) {
  const dir = path.join(root, ".next", "server", "app");
  const htmlFiles = await walk(dir, [".html", ".rsc", ".body"]);
  if (!htmlFiles.length) err("no rendered HTML found in .next/server/app");
  for (const f of htmlFiles) {
    if ((await stat(f)).size > 5_000_000) continue;
    const text = await read(f);
    const where = rel(f);
    if (DASH.test(text)) {
      const i = text.search(DASH);
      err(`${where}: em or en dash near "${text.slice(Math.max(0, i - 40), i + 40).replace(/\s+/g, " ")}"`);
    }
    checkPrivacy(text, where);
    if (text.includes("credit-shap-waterfall-synthetic")) err(`${where}: renders the synthetic SHAP waterfall`);
    if (/addEventListener\(\s*["']scroll["']/.test(text)) err(`${where}: scroll event listener`);
  }
  const index = htmlFiles.find((f) => rel(f).endsWith("app/index.html"));
  if (index) {
    const html = await read(index);
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    if (!ld) err("index.html has no JSON-LD");
    else {
      checkPrivacy(ld, "JSON-LD");
      if (/telephone|birthDate|streetAddress|postalCode/.test(ld)) err("JSON-LD carries private fields");
    }
    const h1 = html.match(/<h1\b/g)?.length ?? 0;
    if (h1 !== 1) err(`index.html has ${h1} h1 elements`);
  }
}

if (errors.length) {
  console.error(`check-content: ${errors.length} problem(s)\n - ${errors.join("\n - ")}`);
  process.exit(1);
}
console.log(`check-content: ${rendered ? "sources and rendered output" : "sources"} clean (${srcFiles.length} source files)`);
