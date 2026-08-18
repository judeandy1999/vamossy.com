import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Gergely Vámossy — AI/LLM Governance Research";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3efe6",
          color: "#161412",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, textTransform: "uppercase" }}>
          Research
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, maxWidth: 980 }}>
            Gergely Vámossy
          </div>
          <div style={{ fontSize: 32, color: "#3c3832", maxWidth: 860 }}>
            AI/LLM governance, mathematical ontology, and machine-checkable
            non-self-approval.
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#6e2f24" }}>vamossy.com</div>
      </div>
    ),
    size
  );
}
