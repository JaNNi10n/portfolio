// Typed accessors over content/content.json, with build-time asserts.
// No visible fact or number is typed into components: they all come from here.
import raw from "@/content/content.json";

export type Sourced = { source: string; sourceUrl: string };

export type MetricData = Sourced & {
  label: string;
  value: string;
  context: string;
  headline?: boolean;
};

export type ImageData = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  role?: string;
  synthetic?: boolean;
};

export type Project = {
  slug: string;
  featured: boolean;
  order: number;
  status: string;
  statusLabel?: string;
  title: string;
  repo: string;
  repoUrl: string;
  release: string;
  dateLabel: string;
  tagline: string;
  problem: string;
  approach: string[];
  stack: string[];
  metrics: MetricData[];
  facts?: MetricData[];
  honestNotes: string[];
  images: ImageData[];
};

type Content = typeof raw;

const content = raw as Content & { projects: Project[] };

function fail(message: string): never {
  throw new Error(`[content] ${message}`);
}

function assertSourced(item: Partial<Sourced>, where: string) {
  if (!item.source || !item.sourceUrl) fail(`${where} is missing source or sourceUrl`);
  if (!item.sourceUrl.startsWith("https://github.com/JaNNi10n/")) fail(`${where} sourceUrl is not a JaNNi10n GitHub URL`);
  if (item.sourceUrl.includes("/indexes/")) fail(`${where} sourceUrl points into a gitignored indexes/ folder`);
}

for (const p of content.projects) {
  p.metrics.forEach((m, i) => assertSourced(m, `${p.slug}.metrics[${i}]`));
  p.facts?.forEach((m, i) => assertSourced(m, `${p.slug}.facts[${i}]`));
}
Object.entries(content.signature.sources).forEach(([k, s]) => assertSourced(s, `signature.sources.${k}`));

export const SHAP_BANNED = "credit-shap-waterfall-synthetic";

export function project(slug: string): Project {
  const p = content.projects.find((x) => x.slug === slug);
  if (!p) fail(`unknown project ${slug}`);
  if (slug === "credit-risk" && p.metrics.length !== 0) fail("credit-risk must not carry any metric");
  return p;
}

export function metric(p: Project, label: string): MetricData {
  const m = p.metrics.find((x) => x.label === label);
  if (!m) fail(`${p.slug} has no metric "${label}"`);
  return m;
}

export function image(p: Project, src: string): ImageData {
  if (src.includes(SHAP_BANNED)) fail("the synthetic SHAP waterfall is never shown");
  const img = p.images.find((x) => x.src === src);
  if (!img) fail(`${p.slug} has no image ${src}`);
  return img;
}

/** The headline metric of each project, in content order, for the results ledger. */
export function ledgerRows(): { project: Project; metric: MetricData }[] {
  const picks: [string, string][] = [
    ["yolo26-detector", "mAP50, held-out test split"],
    ["multimodal-rag", "End-to-end answer accuracy"],
    ["rag-retrieval-eval-gate", "Hybrid nDCG@10"],
    ["text2sql-agent", "Red-team prompts that executed a write"],
  ];
  return picks.map(([slug, label]) => {
    const p = project(slug);
    return { project: p, metric: metric(p, label) };
  });
}

/** "repo-name" from a JaNNi10n GitHub URL, for aria labels. */
export function repoOf(url: string): string {
  return url.split("/")[4] ?? "the repository";
}

export const person = content.person;
export const hero = content.hero;
export const links = content.links;
export const education = content.education;
export const experience = content.experience;
export const skills = content.skills;
export const achievements = content.achievements;
export const sharedHardware = content.sharedHardware;
export const seo = content.seo;
export const signature = content.signature;
export const site = content.site;
export const projects = content.projects;
