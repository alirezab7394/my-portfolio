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
            fontSize: 64,
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Alireza Bagheri
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: "normal",
            marginBottom: "24px",
            textAlign: "center",
            opacity: 0.9,
          }}
        >
          Senior Front-End Developer
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: "normal",
            textAlign: "center",
            opacity: 0.8,
            maxWidth: "800px",
            lineHeight: 1.3,
          }}
        >
          React & Next.js Expert • 7+ Years Experience • Team Leader
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "32px",
            gap: "24px",
            fontSize: 18,
            opacity: 0.8,
          }}
        >
          <div>🚀 React</div>
          <div>⚡ Next.js</div>
          <div>💻 TypeScript</div>
          <div>👥 Leadership</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
