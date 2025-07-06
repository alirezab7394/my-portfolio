import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(135deg, #1E40AF 0%, #8B5CF6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          flexDirection: "column",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Alireza Bagheri
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: "normal",
            marginBottom: "32px",
            textAlign: "center",
            opacity: 0.9,
          }}
        >
          Senior Front-End Developer
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: "normal",
            textAlign: "center",
            opacity: 0.8,
            maxWidth: "900px",
            lineHeight: 1.4,
          }}
        >
          7+ years of experience in React & Next.js • Led teams at Skedpal & Cowsel • 40% performance improvements
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "40px",
            gap: "32px",
            fontSize: 20,
            opacity: 0.8,
          }}
        >
          <div>React</div>
          <div>Next.js</div>
          <div>TypeScript</div>
          <div>Team Leadership</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
