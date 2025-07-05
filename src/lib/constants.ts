export const SECTION_IDS = {
    HERO: "hero",
    PROFILE: "profile",
    SKILLS: "skills",
    EXPERIENCE: "experience",
    EDUCATION: "education",
    PROJECTS: "projects",
} as const;

export const NAVIGATION_SECTIONS = [
    { id: SECTION_IDS.HERO, translationKey: "sections.hero" },
    { id: SECTION_IDS.PROFILE, translationKey: "sections.profile" },
    { id: SECTION_IDS.SKILLS, translationKey: "sections.skills" },
    { id: SECTION_IDS.EXPERIENCE, translationKey: "sections.experience" },
    { id: SECTION_IDS.EDUCATION, translationKey: "sections.education" },
    { id: SECTION_IDS.PROJECTS, translationKey: "sections.projects" },
] as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS]; 