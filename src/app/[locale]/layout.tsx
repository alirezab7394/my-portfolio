import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import { personStructuredData, websiteStructuredData, portfolioStructuredData } from "@/lib/structured-data";
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

  const baseUrl = "https://alireza-bagheri.top";
  const ogImageUrl = `${baseUrl}/opengraph-image.png`;

  return {
    title: "Alireza Bagheri - Senior Front-End Developer | React & Next.js Expert",
    description:
      "Senior Front-End Developer with 7+ years of experience specializing in React and Next.js ecosystems. Demonstrated success in leading development teams at Skedpal and Cowsel, driving significant performance improvements including 40% faster load times through modernization initiatives. Expert in building scalable applications, implementing SSR solutions, and optimizing SEO performance.",
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
      "Team Lead",
      "Skedpal",
      "Cowsel",
      "Material UI",
      "Tailwind CSS",
      "Shadcn",
      "Prisma",
      "Firebase",
      "MongoDB",
      "SSR",
      "SEO Optimization",
      "Performance Optimization",
      "ERP Systems",
      "Calendar Applications",
      "Enterprise Solutions",
      "HTML",
      "CSS",
      "SCSS",
      "Context API",
      "Recoil",
      "Redux",
      "Git",
      "Jest",
      "Vitest",
      "Storybook",
      "Artificial Intelligence",
      "Masters Degree",
      "Computer Software Engineering",
      "Tabriz University",
      "International Experience",
      "Finland",
      "Azerbaijan",
      "UAE",
      "USA",
    ],
    authors: [{ name: "Alireza Bagheri", url: "https://alireza-bagheri.top" }],
    creator: "Alireza Bagheri",
    publisher: "Alireza Bagheri",
    category: "Technology",
    classification: "Portfolio",
    openGraph: {
      title: "Alireza Bagheri - Senior Front-End Developer | React & Next.js Expert",
      description:
        "Senior Front-End Developer with 7+ years of experience in React and Next.js. Led development teams at Skedpal and Cowsel, achieved 40% performance improvements, expert in building scalable applications and SSR solutions.",
      url: "https://alireza-bagheri.top",
      siteName: "Alireza Bagheri Portfolio",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type: "profile",
      emails: ["alireza7394@gmail.com"],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Alireza Bagheri - Senior Front-End Developer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Alireza Bagheri - Senior Front-End Developer",
      description:
        "Senior Front-End Developer with 7+ years of experience in React and Next.js. Led development teams at Skedpal and Cowsel, achieved 40% performance improvements.",
      creator: "@alirezab7394",
      site: "@alirezab7394",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Alireza Bagheri - Senior Front-End Developer",
        },
      ],
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
    alternates: {
      canonical: "https://alireza-bagheri.top",
      languages: {
        "en-US": "https://alireza-bagheri.top/en",
        "fa-IR": "https://alireza-bagheri.top/fa",
      },
    },
    other: {
      "linkedin:profile": "https://www.linkedin.com/in/alireza-bagheri-a6aaa681/",
      "github:profile": "https://github.com/alirezab7394",
      "contact:email": "alireza7394@gmail.com",
      "contact:phone": "+989366554441",
      "experience:years": "7+",
      specialization: "React, Next.js, TypeScript",
      location: "Iran",
      "education:masters": "M.Sc. in Artificial Intelligence - Tabriz University",
      "education:bachelors": "B.Sc. in Computer Software Engineering - Bonab University",
      "current:position": "Frontend Lead at Skedpal",
      "notable:projects": "Skedpal, Cowsel ERP, Markabu, Dopely, TechClass",
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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
