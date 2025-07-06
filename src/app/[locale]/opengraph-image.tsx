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
              fontSize: 72,
              fontWeight: "bold",
              marginBottom: "24px",
              textAlign: "center",
              letterSpacing: "-0.02em",
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
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "8px 16px",
                borderRadius: "20px",
              }}
            >
              React
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "8px 16px",
                borderRadius: "20px",
              }}
            >
              Next.js
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "8px 16px",
                borderRadius: "20px",
              }}
            >
              TypeScript
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "8px 16px",
                borderRadius: "20px",
              }}
            >
              Team Leadership
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error("Error generating OpenGraph image:", error);
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
