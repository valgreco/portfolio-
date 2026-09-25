import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Valeria Greco, Product Manager";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0a",
          color: "#f5f5f5",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 6, color: "#666", textTransform: "uppercase", marginBottom: 24 }}>
          Product Manager
        </div>
        <div style={{ fontSize: 92, fontStyle: "italic", color: "#ffffff", lineHeight: 1.05 }}>
          I see. I build. I ship.
        </div>
        <div style={{ fontSize: 30, color: "#888", marginTop: 32, maxWidth: 800 }}>
          Building fintech for travellers across Europe. Based in Madrid.
        </div>
      </div>
    ),
    { ...size }
  );
}
