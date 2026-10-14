// Derives build assets from the real project images. Run once and commit the outputs.
// 1. Two-row crop of the YOLO test-prediction grid (drops the empty bottom-right cell).
// 2. og-grid.jpg for the Open Graph image (Satori cannot read webp).
// 3. A static Archivo Expanded Bold TTF for the OG image and icons (Satori cannot use variable fonts).
import sharp from "sharp";
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const assets = path.join(root, "public", "assets");
const src = path.join(assets, "yolo-test-predictions.webp");
const crop = { left: 0, top: 0, width: 1600, height: 608 };

const meta = await sharp(src).metadata();
if (meta.width !== 1600 || meta.height !== 915) {
  throw new Error(`Unexpected source size ${meta.width}x${meta.height}`);
}

await sharp(src).extract(crop).webp({ quality: 82 }).toFile(path.join(assets, "yolo-test-predictions-2row.webp"));
await sharp(src).extract(crop).resize(660, 251).flatten({ background: "#ffffff" }).jpeg({ quality: 86 }).toFile(path.join(assets, "og-grid.jpg"));
console.log("wrote yolo-test-predictions-2row.webp and og-grid.jpg");

const fontsDir = path.join(assets, "fonts");
await mkdir(fontsDir, { recursive: true });
const ttfPath = path.join(fontsDir, "Archivo_Expanded-Bold.ttf");
const exists = await access(ttfPath).then(() => true, () => false);
if (!exists || process.argv.includes("--fonts")) {
  // A non-browser user agent makes the Google Fonts CSS API return a static TTF instance at the requested axes.
  const css = await fetch("https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,700", {
    headers: { "User-Agent": "curl/8" },
  }).then((r) => r.text());
  const url = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
  if (!url) throw new Error("Could not find font URL in Google Fonts CSS");
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  await writeFile(ttfPath, buf);
  const ofl = await fetch("https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/OFL.txt").then((r) => r.text());
  await writeFile(path.join(fontsDir, "OFL.txt"), ofl);
  console.log(`wrote Archivo_Expanded-Bold.ttf (${buf.length} bytes, from ${url}) and OFL.txt`);
}
