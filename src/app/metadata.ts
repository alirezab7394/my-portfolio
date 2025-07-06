import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Alireza Bagheri - Senior Front-End Developer",
    description: "Senior Front-End Developer with 7+ years of experience specializing in React and Next.js ecosystems. Expert in building scalable applications, implementing SSR solutions, and optimizing SEO performance.",
    keywords: "Alireza Bagheri, Senior Front-End Developer, React Developer, Next.js Developer, TypeScript Developer, JavaScript Developer, Frontend Lead, Skedpal, Cowsel, Dopely, TechClass, Full Stack Developer, Web Developer, UI/UX Developer, SSR, SEO Optimization, Performance Optimization, Team Leadership, React Migration, Modern Web Development",
    authors: [{ name: "Alireza Bagheri", url: "https://alireza-bagheri.top" }],
    creator: "Alireza Bagheri",
    publisher: "Alireza Bagheri",
    metadataBase: new URL("https://alireza-bagheri.top"),
    alternates: {
        canonical: "/",
        languages: {
            en: "/en",
            fa: "/fa",
        },
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        alternateLocale: "fa_IR",
        url: "https://alireza-bagheri.top",
        title: "Alireza Bagheri - Senior Front-End Developer",
        description: "Senior Front-End Developer with 7+ years of experience specializing in React and Next.js ecosystems. Expert in building scalable applications, implementing SSR solutions, and optimizing SEO performance.",
        siteName: "Alireza Bagheri - Senior Front-End Developer",
        images: [
            {
                url: "/opengraph-image.png",
                width: 1200,
                height: 630,
                alt: "Alireza Bagheri - Senior Front-End Developer - Portfolio",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Alireza Bagheri - Senior Front-End Developer",
        description: "Senior Front-End Developer with 7+ years of experience specializing in React and Next.js ecosystems. Expert in building scalable applications, implementing SSR solutions, and optimizing SEO performance.",
        creator: "@alirezab7394",
        images: ["/opengraph-image.png"],
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