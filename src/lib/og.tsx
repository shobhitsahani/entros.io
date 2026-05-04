import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const ogAlt = "Entros Protocol—Proof of Personhood on Solana";
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

let cachedLogoSrc: string | null = null;
function getLogoSrc(): string {
  if (cachedLogoSrc) return cachedLogoSrc;
  const bytes = readFileSync(
    join(process.cwd(), "public", "logos", "Entros.png"),
  );
  cachedLogoSrc = `data:image/png;base64,${bytes.toString("base64")}`;
  return cachedLogoSrc;
}

export function generateOGImage() {
  const logoSrc = getLogoSrc();
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
          Proof of Personhood on Solana
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
          Behavioral liveness verification. Privacy by architecture.
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
          entros.io
        </div>
      </div>
    ),
    ogSize
  );
}
