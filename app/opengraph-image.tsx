import { ImageResponse } from "next/og";

export const alt = "BurnedInbox — free cold email placement tester";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: "72px 80px", background: "#ffffff",
          borderTop: "12px solid #c8102e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: "#c8102e", display: "flex" }} />
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#0c0c0c" }}>
            burned<span style={{ color: "#c8102e" }}>inbox</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, color: "#0c0c0c", lineHeight: 1.05, letterSpacing: "-2px" }}>
            Is your cold email landing in spam?
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#555555" }}>
            Free placement test · SPF · DKIM · DMARC · 16 blacklists
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#888888" }}>burnedinbox.com</div>
      </div>
    ),
    size,
  );
}
