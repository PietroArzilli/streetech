import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// Icona dinamica generata via ImageResponse — sostituire con PNG reali in produzione
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 200,
            fontWeight: 900,
            letterSpacing: "-6px",
            lineHeight: 1,
          }}
        >
          ST
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: "12px",
            marginTop: 8,
            opacity: 0.85,
          }}
        >
          RTECH
        </div>
      </div>
    ),
    { ...size }
  );
}
