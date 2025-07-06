export const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alireza Bagheri",
    jobTitle: "Senior Front-End Developer",
    description: "Senior Front-End Developer with 7+ years of experience specializing in React and Next.js ecosystems. Expert in building scalable applications, implementing SSR solutions, and optimizing SEO performance.",
    image: "https://alireza-bagheri.top/avatar.jpg",
    url: "https://alireza-bagheri.top",
    email: "alireza7394@gmail.com",
    telephone: "+989366554441",
    address: {
        "@type": "PostalAddress",
        addressCountry: "IR",
        addressLocality: "Iran"
    },
    alumniOf: [
        {
            "@type": "EducationalOrganization",
            name: "Tabriz University",
            department: "Artificial Intelligence",
            degreeType: "Master of Science"
        },
        {
            "@type": "EducationalOrganization",
            name: "Bonab University",
            department: "Computer Software Engineering",
            degreeType: "Bachelor of Science"
        }
    ],
    worksFor: [
        {
            "@type": "Organization",
            name: "Skedpal",
            url: "https://skedpal.com",
            position: "Frontend Lead",
            startDate: "2021-09",
            description: "Led development team to build and enhance Skedpal's competitive calendar tool"
        }
    ],
    knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "HTML",
        "CSS",
        "SCSS",
        "Material UI",
        "Tailwind CSS",
        "Shadcn",
        "Prisma",
        "Firebase",
        "MongoDB",
        "Redux",
        "Context API",
        "Recoil",
        "Git",
        "Jest",
        "Vitest",
        "Storybook",
        "SSR",
        "SEO Optimization",
        "Performance Optimization",
        "Team Leadership",
        "ERP Systems",
        "Calendar Applications"
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
            educationalLevel: "Master's",
            recognizedBy: {
                "@type": "EducationalOrganization",
                name: "Tabriz University"
            }
        },
        {
            "@type": "EducationalOccupationalCredential",
            name: "Bachelor of Science in Computer Software Engineering",
            credentialCategory: "degree",
            educationalLevel: "Bachelor's",
            recognizedBy: {
                "@type": "EducationalOrganization",
                name: "Bonab University"
            }
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
    name: "Alireza Bagheri Portfolio",
    url: "https://alireza-bagheri.top",
    description: "Personal portfolio website of Alireza Bagheri, Senior Front-End Developer with 7+ years of experience in React and Next.js",
    author: {
        "@type": "Person",
        name: "Alireza Bagheri"
    },
    inLanguage: ["en-US", "fa-IR"],
    potentialAction: {
        "@type": "SearchAction",
        target: "https://alireza-bagheri.top/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
    }
};

export const portfolioStructuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Alireza Bagheri - Portfolio",
    description: "Professional portfolio showcasing projects and experience of Senior Front-End Developer Alireza Bagheri",
    author: {
        "@type": "Person",
        name: "Alireza Bagheri",
        jobTitle: "Senior Front-End Developer"
    },
    dateCreated: "2024",
    dateModified: "2024",
    url: "https://alireza-bagheri.top",
    keywords: "React, Next.js, TypeScript, Frontend Development, Portfolio, Web Development"
}; 