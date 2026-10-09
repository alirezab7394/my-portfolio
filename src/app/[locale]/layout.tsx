import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono, Noto_Naskh_Arabic, Vazirmatn } from "next/font/google";
import {
  generateMetadata as generatePageMetadata,
  personStructuredData,
  websiteStructuredData,
  portfolioStructuredData,
} from "@/lib/metadata";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// Persian faces are only needed on /fa, so they are not preloaded on every page.
const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  display: "swap",
  preload: false,
});

const notoNaskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fa" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(undefined, undefined, undefined, locale);
}

export const viewport: Viewport = {
  themeColor: "#07080A",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const fontVariables = [instrumentSerif, interTight, jetbrainsMono, vazirmatn, notoNaskh]
    .map((font) => font.variable)
    .join(" ");

  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"} className={fontVariables}>
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
        <meta name="google-site-verification" content="wKB8jP0vdQLw8os7GBLy88_JpHldmC-9zrAD9s91rVI" />
        <noscript>
          <style>{`.te-loader{display:none!important}[data-reveal]{transform:none!important;opacity:1!important}.te-static-only{display:block!important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
