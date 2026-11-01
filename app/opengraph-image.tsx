import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Valeria Greco — Product Manager who builds with AI";

// The share card: what someone sees before they click, when the link gets
// forwarded on LinkedIn, in a DM, or over email. Leads with her name and the
// one line that positions her.
export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#141414",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 5,
            color: "#8aa0ff",
            textTransform: "uppercase",
          }}
        >
          Product Manager · Builds with AI
        </div>

        {/* Name + tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 108, fontStyle: "italic", color: "#ffffff", lineHeight: 1 }}>
            Valeria Greco.
          </div>
          <div
            style={{
              display: "flex",
              width: 128,
              height: 4,
              background: "#7f9cff",
              borderRadius: 2,
              marginTop: 30,
              marginBottom: 30,
            }}
          />
          <div style={{ display: "flex", fontSize: 40, color: "#c6c6c6", maxWidth: 980, lineHeight: 1.3 }}>
            I find the real problem. I build the solution.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#9a9a9a",
          }}
        >
          <div style={{ display: "flex" }}>leragreco.com</div>
          <div style={{ display: "flex" }}>Based in Madrid · open to SF / NY</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
