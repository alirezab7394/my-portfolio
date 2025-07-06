import { personStructuredData, websiteStructuredData, portfolioStructuredData } from "@/lib/structured-data";

export default function RootPage() {
  // This page will be served briefly before redirect, allowing metadata to be crawled
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(portfolioStructuredData),
          }}
        />
        <meta httpEquiv="refresh" content="0; url=/en" />
      </head>
      <body>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1>Alireza Bagheri - Senior Front-End Developer</h1>
          <p>Redirecting to portfolio...</p>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.location.href = '/en';`,
            }}
          />
        </div>
      </body>
    </html>
  );
}
