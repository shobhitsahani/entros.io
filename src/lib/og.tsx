import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const logoSrc = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public", "logos", "IAM.png")
).toString("base64")}`;

export const ogAlt = "IAM Protocol — Proof of Humanity on Solana";
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function generateOGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#0A0A0F",
          padding: "60px 80px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={140} height={140} alt="" />

        <div
          style={{
            marginTop: 36,
            fontSize: 44,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          Proof of Humanity on Solana
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 22,
            color: "rgba(255, 255, 255, 0.45)",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Behavioral liveness verification. Zero biometric data transmitted.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            fontSize: 16,
            color: "#00F0FF",
            opacity: 0.5,
            letterSpacing: "0.05em",
          }}
        >
          iam-human.io
        </div>
      </div>
    ),
    ogSize
  );
}
