// Shared assets for the generated Open Graph image and icons (build time only).
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_COLORS = {
  bg: "#FAFAFA",
  ink: "#161914",
  ink2: "#565952",
  accent: "#436803",
  onAccent: "#FAFAFA",
  line: "#D7DAD5",
  plate: "#FFFFFF",
} as const;

export function archivoExpandedBold() {
  return readFile(join(process.cwd(), "public/assets/fonts/Archivo_Expanded-Bold.ttf"));
}

export async function ogGridDataUrl() {
  const buf = await readFile(join(process.cwd(), "public/assets/og-grid.jpg"));
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}
