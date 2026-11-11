import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Room Fifteen — Saving 100% of your time for 1% of your money";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const anton = await readFile(join(process.cwd(), "assets/anton-latin-400-normal.woff"));
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
          background: "#0B0710",
          fontFamily: "Anton",
        }}
      >
        <div style={{ fontSize: 40, letterSpacing: 6, color: "#FF2E93" }}>ROOM FIFTEEN</div>
        <div style={{ fontSize: 92, lineHeight: 1, color: "#F4EEFF", marginTop: 36 }}>
          SAVING 100% OF YOUR TIME
        </div>
        <div style={{ fontSize: 92, lineHeight: 1, color: "#FFD23F" }}>FOR 1% OF YOUR MONEY</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Anton", data: anton, style: "normal", weight: 400 }] },
  );
}
