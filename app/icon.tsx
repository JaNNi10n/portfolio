import { ImageResponse } from "next/og";
import { archivoExpandedBold, OG_COLORS as C } from "@/lib/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Typographic mark: "SB" in Archivo Expanded Bold, on-accent on accent, square. */
export default async function Icon() {
  const font = await archivoExpandedBold();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.accent,
          color: C.onAccent,
          fontFamily: "Archivo",
          fontSize: 15,
          letterSpacing: "-0.02em",
        }}
      >
        SB
      </div>
    ),
    { ...size, fonts: [{ name: "Archivo", data: font, style: "normal", weight: 700 }] },
  );
}
