import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const runtime = "edge";

// Image generation
export default async function Image() {
  try {
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
            fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: "bold",
              marginBottom: "20px",
              textAlign: "center",
              letterSpacing: "-0.02em",
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
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "6px 12px",
                borderRadius: "16px",
              }}
            >
              🚀 React
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "6px 12px",
                borderRadius: "16px",
              }}
            >
              ⚡ Next.js
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "6px 12px",
                borderRadius: "16px",
              }}
            >
              💻 TypeScript
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "6px 12px",
                borderRadius: "16px",
              }}
            >
              👥 Leadership
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error("Error generating Twitter image:", error);
    // Return a simple fallback image
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: "#1E40AF",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            flexDirection: "column",
          }}
        >
          <div>Alireza Bagheri</div>
          <div style={{ fontSize: 32, marginTop: "16px" }}>Senior Front-End Developer</div>
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
