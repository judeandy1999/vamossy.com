import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3efe6",
          color: "#161412",
          border: "8px solid #161412",
          fontSize: 110,
          fontFamily: "Georgia, serif",
          fontWeight: 600,
          letterSpacing: "-0.06em",
        }}
      >
        V
      </div>
    ),
    size
  );
}
