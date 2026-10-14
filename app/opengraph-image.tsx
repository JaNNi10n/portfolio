import { ImageResponse } from "next/og";
import { archivoExpandedBold, OG_COLORS as C, ogGridDataUrl } from "@/lib/og";
import { metric, person, project } from "@/lib/content";

export const alt = "Shivansh Bhardwaj, AI/ML Engineer, with YOLO26n test-set detections";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [font, grid] = await Promise.all([archivoExpandedBold(), ogGridDataUrl()]);
  const yolo = project("yolo26-detector");
  const map50 = metric(yolo, "mAP50, held-out test split");
  const [first, last] = person.name.toUpperCase().split(" ");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: C.bg, fontFamily: "Archivo" }}>
        <div
          style={{
            width: 540,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 48px 56px 56px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 62, lineHeight: 0.95, letterSpacing: "-0.015em", color: C.ink }}>{first}</div>
            <div style={{ fontSize: 62, lineHeight: 0.95, letterSpacing: "-0.015em", color: C.ink }}>{last}</div>
            <div style={{ marginTop: 28, fontSize: 30, color: C.ink2 }}>{person.role}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", borderTop: `2px solid ${C.line}`, paddingTop: 24 }}>
            <div style={{ display: "flex", fontSize: 56, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1 }}>
              {map50.value}
            </div>
            <div style={{ display: "flex", marginTop: 10, fontSize: 22, color: C.ink }}>{map50.label}</div>
            <div style={{ marginTop: 10, fontSize: 20, color: C.accent }}>{map50.source}</div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 48px 0 0",
          }}
        >
          <div style={{ display: "flex", background: C.plate, border: `2px solid ${C.line}`, padding: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img */}
            <img src={grid} width={608} height={231} alt="" />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Archivo", data: font, style: "normal", weight: 700 }],
    },
  );
}
