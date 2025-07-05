import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Noto Sans Arabic - Beautiful and minimalist Persian/Arabic font from Google Fonts
const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fa" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Alireza Bagheri - Senior Front-End Developer | React & Next.js Expert",
    description:
      "Senior Front-End Developer with 7+ years of experience specializing in React and Next.js ecosystems. Expert in building scalable applications, implementing SSR solutions, and optimizing SEO performance.",
    keywords: [
      "Alireza Bagheri",
      "Senior Front-End Developer",
      "React Developer",
      "Next.js Expert",
      "TypeScript",
      "JavaScript",
      "Frontend Development",
      "Web Development",
      "React Native",
      "UI/UX",
      "Portfolio",
    ],
    authors: [{ name: "Alireza Bagheri" }],
    openGraph: {
      title: "Alireza Bagheri - Senior Front-End Developer",
      description:
        "Senior Front-End Developer with 7+ years of experience in React and Next.js. Building scalable applications and leading development teams.",
      url: "https://alirezabagheri.dev",
      siteName: "Alireza Bagheri Portfolio",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Alireza Bagheri - Senior Front-End Developer Portfolio",
        },
      ],
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Alireza Bagheri - Senior Front-End Developer",
      description:
        "Senior Front-End Developer with 7+ years of experience in React and Next.js. Building scalable applications and leading development teams.",
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
