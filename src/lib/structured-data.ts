export const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alireza Bagheri",
    jobTitle: "Senior Front-End Developer",
    description: "Senior Front-End Developer with 7+ years of experience specializing in React and Next.js ecosystems. Expert in building scalable applications, implementing SSR solutions, and optimizing SEO performance.",
    image: "https://alireza-bagheri.top/avatar.jpg",
    url: "https://alireza-bagheri.top",
    email: "alireza7394@gmail.com",
    telephone: "+98 936 655 4441",
    address: {
        "@type": "PostalAddress",
        addressCountry: "Iran"
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
    worksFor: {
        "@type": "Organization",
        name: "Skedpal",
        url: "https://app.skedpal.com"
    },
    knowsAbout: [
        "React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "SCSS",
        "Context", "Recoil", "Redux", "Material UI", "Tailwind", "Shadcn",
        "Prisma", "Firebase", "Firestore", "MongoDB", "Git", "Jest", "Enzyme", "Vitest", "Storybook"
    ],
    sameAs: [
        "https://www.linkedin.com/in/alireza-bagheri-a6aaa681/",
        "https://github.com/alirezab7394"
    ],
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
    ],
    workExample: [
        {
            "@type": "CreativeWork",
            name: "Skedpal Calendar Application",
            description: "Led development team to build and enhance competitive calendar tool with AI-driven scheduling",
            url: "https://app.skedpal.com"
        },
        {
            "@type": "CreativeWork",
            name: "Cowsel ERP System",
            description: "Managed development of ERP system and online store, leading team of 5 developers"
        },
        {
            "@type": "CreativeWork",
            name: "Dopely Color Tools",
            description: "Developed complex color algorithm system for visual design platform",
            url: "https://colors.dopely.top/"
        }
    ],
    award: [
        "Led migration from jQuery to React achieving 40% performance improvement",
        "Converted CSR to SSR improving performance by 30%",
        "Built international e-commerce platform with Next.js",
        "Developed AI-driven scheduling capabilities for calendar applications"
    ]
};

export const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Alireza Bagheri - Senior Front-End Developer",
    description: "Senior Front-End Developer with 7+ years of experience specializing in React and Next.js ecosystems. Expert in building scalable applications, implementing SSR solutions, and optimizing SEO performance.",
    url: "https://alireza-bagheri.top",
    author: {
        "@type": "Person",
        name: "Alireza Bagheri"
    },
    inLanguage: ["en", "fa"],
    potentialAction: {
        "@type": "SearchAction",
        target: "https://alireza-bagheri.top/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
    }
};

export const portfolioStructuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": "https://alireza-bagheri.top#portfolio",
    name: "Alireza Bagheri - Senior Front-End Developer - Portfolio",
    description: "Professional portfolio showcasing 7+ years of front-end development experience",
    url: "https://alireza-bagheri.top",
    author: {
        "@type": "Person",
        name: "Alireza Bagheri",
        jobTitle: "Senior Front-End Developer"
    },
    dateCreated: "2024",
    dateModified: "2024-12-19T00:00:00.000Z",
    keywords: "Alireza Bagheri, Senior Front-End Developer, React Developer, Next.js Developer, TypeScript Developer, JavaScript Developer, Frontend Lead, Skedpal, Cowsel, Dopely, TechClass, Full Stack Developer, Web Developer, UI/UX Developer, SSR, SEO Optimization, Performance Optimization, Team Leadership, React Migration, Modern Web Development",
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