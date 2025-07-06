import type { Metadata } from "next";

// Base metadata configuration based on CV
export const baseMetadata = {
    title: "Alireza Bagheri - Senior Front-End Developer",
    description: "Senior Front-End Developer with 7+ years of experience specializing in React and Next.js ecosystems. Expert in building scalable applications, implementing SSR solutions, and optimizing SEO performance.",
    keywords: [
        "Alireza Bagheri",
        "Senior Front-End Developer",
        "React Developer",
        "Next.js Developer",
        "TypeScript Developer",
        "JavaScript Developer",
        "Frontend Lead",
        "Skedpal",
        "Cowsel",
        "Dopely",
        "TechClass",
        "Full Stack Developer",
        "Web Developer",
        "UI/UX Developer",
        "SSR",
        "SEO Optimization",
        "Performance Optimization",
        "Team Leadership",
        "React Migration",
        "Modern Web Development"
    ],
    author: "Alireza Bagheri",
    creator: "Alireza Bagheri",
    publisher: "Alireza Bagheri",
    category: "Technology",
    classification: "Portfolio",
    url: "https://alireza-bagheri.top",
    email: "alireza7394@gmail.com",
    phone: "+98 936 655 4441",
    linkedin: "https://www.linkedin.com/in/alireza-bagheri-a6aaa681/",
    github: "https://github.com/alirezab7394",
    location: "Iran",
    experience: "7+ years",
    specialization: "React and Next.js ecosystems",
    languages: ["English", "Persian"],
    skills: [
        "React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "SCSS",
        "Context", "Recoil", "Redux", "Material UI", "Tailwind", "Shadcn",
        "Prisma", "Firebase", "Firestore", "MongoDB", "Git", "Jest", "Enzyme", "Vitest", "Storybook"
    ],
    companies: [
        "Skedpal", "TechClass", "Dopely", "Cowsel", "Azar Amin Azerbaijan", "Opeqe", "Setorg Andishe Iranian"
    ],
    education: [
        "M.Sc. in Artificial Intelligence - Tabriz University",
        "B.Sc. in Computer Software Engineering - Bonab University"
    ]
};

// Generate metadata for different pages
export function generateMetadata(
    pageTitle?: string,
    pageDescription?: string,
    pageKeywords?: string[],
    locale: string = "en"
): Metadata {
    const title = pageTitle
        ? `${pageTitle} | ${baseMetadata.title}`
        : baseMetadata.title;

    const description = pageDescription || baseMetadata.description;
    const keywords = pageKeywords
        ? [...baseMetadata.keywords, ...pageKeywords]
        : baseMetadata.keywords;

    return {
        title,
        description,
        keywords: keywords.join(", "),
        authors: [{ name: baseMetadata.author, url: baseMetadata.url }],
        creator: baseMetadata.creator,
        publisher: baseMetadata.publisher,
        category: baseMetadata.category,
        classification: baseMetadata.classification,
        metadataBase: new URL(baseMetadata.url),
        alternates: {
            canonical: "/",
            languages: {
                en: "/en",
                fa: "/fa",
            },
        },
        openGraph: {
            type: "website",
            locale: locale === "fa" ? "fa_IR" : "en_US",
            alternateLocale: locale === "fa" ? "en_US" : "fa_IR",
            url: baseMetadata.url,
            title,
            description,
            siteName: baseMetadata.title,
            images: [
                {
                    url: "/opengraph-image.png",
                    width: 1200,
                    height: 630,
                    alt: `${baseMetadata.title} - Portfolio`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            creator: "@alirezab7394", // Update with actual Twitter handle
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
        verification: {
            google: "your-google-verification-code", // Add actual verification code
            yandex: "your-yandex-verification-code", // Add actual verification code
        },
        other: {
            "contact:email": baseMetadata.email,
            "contact:phone_number": baseMetadata.phone,
            "contact:country_name": baseMetadata.location,
            "profile:first_name": "Alireza",
            "profile:last_name": "Bagheri",
            "profile:username": "alirezab7394",
            "article:author": baseMetadata.author,
            "article:section": "Technology",
            "article:tag": baseMetadata.skills.join(", "),
        },
    };
}

// Page-specific metadata configurations
export const pageMetadata = {
    home: {
        title: "Home",
        description: "Welcome to Alireza Bagheri's portfolio. Senior Front-End Developer with 7+ years of experience in React and Next.js ecosystems.",
        keywords: ["portfolio", "home", "developer", "frontend", "react", "nextjs"]
    },
    about: {
        title: "About",
        description: "Learn more about Alireza Bagheri, Senior Front-End Developer with expertise in React, Next.js, and modern web technologies.",
        keywords: ["about", "biography", "experience", "skills", "education", "career"]
    },
    projects: {
        title: "Projects",
        description: "Explore Alireza Bagheri's portfolio of projects including enterprise solutions, ERP systems, and modern web applications.",
        keywords: ["projects", "portfolio", "enterprise", "ERP", "web applications", "case studies"]
    },
    contact: {
        title: "Contact",
        description: "Get in touch with Alireza Bagheri for collaboration opportunities, consulting, or project inquiries.",
        keywords: ["contact", "hire", "collaboration", "consulting", "inquiries"]
    }
};

// Structured data for rich snippets
export const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alireza Bagheri",
    jobTitle: "Senior Front-End Developer",
    description: baseMetadata.description,
    url: baseMetadata.url,
    email: baseMetadata.email,
    telephone: baseMetadata.phone,
    address: {
        "@type": "PostalAddress",
        addressCountry: "Iran"
    },
    sameAs: [
        baseMetadata.linkedin,
        baseMetadata.github
    ],
    worksFor: {
        "@type": "Organization",
        name: "Skedpal",
        url: "https://app.skedpal.com"
    },
    alumniOf: [
        {
            "@type": "EducationalOrganization",
            name: "Tabriz University",
            description: "M.Sc. in Artificial Intelligence"
        },
        {
            "@type": "EducationalOrganization",
            name: "Bonab University",
            description: "B.Sc. in Computer Software Engineering"
        }
    ],
    knowsAbout: baseMetadata.skills,
    hasCredential: [
        {
            "@type": "EducationalOccupationalCredential",
            name: "Master of Science in Artificial Intelligence",
            credentialCategory: "degree",
            educationalLevel: "Master's"
        },
        {
            "@type": "EducationalOccupationalCredential",
            name: "Bachelor of Science in Computer Software Engineering",
            credentialCategory: "degree",
            educationalLevel: "Bachelor's"
        }
    ]
};

export const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: baseMetadata.title,
    description: baseMetadata.description,
    url: baseMetadata.url,
    author: {
        "@type": "Person",
        name: baseMetadata.author
    },
    inLanguage: ["en", "fa"],
    potentialAction: {
        "@type": "SearchAction",
        target: `${baseMetadata.url}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
    }
};

export const portfolioStructuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${baseMetadata.url}#portfolio`,
    name: `${baseMetadata.title} - Portfolio`,
    description: "Professional portfolio showcasing 7+ years of front-end development experience",
    url: baseMetadata.url,
    author: {
        "@type": "Person",
        name: baseMetadata.author,
        jobTitle: "Senior Front-End Developer"
    },
    dateCreated: "2024",
    dateModified: "2024-12-19T00:00:00.000Z",
    keywords: baseMetadata.keywords.join(", "),
    about: [
        {
            "@type": "Thing",
            name: "Frontend Development"
        },
        {
            "@type": "Thing",
            name: "React Development"
        },
        {
            "@type": "Thing",
            name: "Next.js Development"
        }
    ]
}; 