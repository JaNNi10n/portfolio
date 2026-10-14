import { ImageResponse } from "next/og";
import { archivoExpandedBold, OG_COLORS as C } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
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
          fontSize: 80,
          letterSpacing: "-0.02em",
        }}
      >
        SB
      </div>
    ),
    { ...size, fonts: [{ name: "Archivo", data: font, style: "normal", weight: 700 }] },
  );
}
