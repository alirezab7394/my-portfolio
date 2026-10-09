import type { ExperienceEntry, Project, Skill, Stat } from "@/types/portfolio";

export const LINKS = {
  email: "alireza7394@gmail.com",
  github: "https://github.com/alirezab7394",
  linkedin: "https://www.linkedin.com/in/alireza-bagheri-a6aaa681/",
  resume: "/resume.html",
} as const;

export const STATS: Stat[] = [
  { id: "years", value: 8, suffix: "+" },
  { id: "projects", value: 10, suffix: "+" },
  { id: "performance", value: 40, suffix: "%" },
  { id: "countries", value: 5, suffix: "" },
];

export const PROJECTS: Project[] = [
  {
    id: "javi",
    url: "https://javienglish.com",
    domain: "javienglish.com",
    accent: "#22D3C5",
    stack: ["Next.js 16", "React 19", "NestJS", "TypeScript", "Turborepo", "Prisma", "PostgreSQL", "Redis", "OpenAI", "Socket.IO", "next-intl", "Tailwind CSS"],
  },
  {
    id: "azartime",
    url: "https://azartime.com",
    domain: "azartime.com",
    accent: "#C8A15A",
    stack: ["Next.js 16", "React 19", "TypeScript", "Prisma", "PostgreSQL", "ZarinPal", "AWS S3", "Tailwind CSS"],
  },
  {
    id: "skedpal",
    url: "https://skedpal.com",
    domain: "skedpal.com",
    accent: "#8FB8FF",
    stack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "NLP"],
  },
  {
    id: "nexttarget",
    url: "https://next-target.ir",
    domain: "next-target.ir",
    accent: "#E8794A",
    stack: ["Next.js", "NestJS", "Expo", "React Native", "Prisma", "PostgreSQL"],
  },
  {
    id: "cowsel",
    url: "https://www.markabu.com/",
    domain: "markabu.com",
    accent: "#B9C7A6",
    stack: ["React", "Next.js", "TypeScript", "MongoDB", "i18n"],
  },
  {
    id: "dopely",
    url: "https://colors.dopely.top/",
    domain: "colors.dopely.top",
    accent: "#E58FB6",
    stack: ["React", "SSR", "Canvas", "Color algorithms"],
  },
];

export const EXPERIENCE: ExperienceEntry[] = [
  { id: "skedpal", company: "SkedPal", start: 2021, end: null, url: "https://skedpal.com", stack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "NLP"] },
  { id: "techclass", company: "TechClass", start: 2021, end: 2021, url: "https://techclass.com", stack: ["Next.js", "SSR", "SEO"] },
  { id: "dopely", company: "Dopely", start: 2020, end: 2021, url: "https://colors.dopely.top/", stack: ["React", "SSR", "Canvas"] },
  { id: "cowsel", company: "Cowsel", start: 2019, end: 2020, url: "https://markabu.com", stack: ["React", "Next.js", "i18n", "ERP"] },
  { id: "opeqe", company: "Opeqe", start: 2019, end: 2019, stack: ["React", "Atomic design"] },
  { id: "setorg", company: "Setorg Andishe", start: 2018, end: 2018, stack: ["React", "Java Spring"] },
];

/** Career span used by the chronograph sub-dials. */
export const CAREER_START = 2018;
export const CAREER_END = 2026;

export const SKILLS: Skill[] = [
  { id: "react", label: "React", ring: 0, projects: ["javi", "azartime", "skedpal", "dopely", "cowsel"] },
  { id: "nextjs", label: "Next.js", ring: 1, projects: ["javi", "azartime", "nexttarget", "skedpal", "cowsel"] },
  { id: "typescript", label: "TypeScript", ring: 0, projects: ["javi", "azartime", "skedpal", "cowsel"] },
  { id: "tailwind", label: "Tailwind CSS", ring: 1, projects: ["javi", "azartime", "skedpal"] },
  { id: "framer", label: "Framer Motion", ring: 0, projects: [] },
  { id: "nestjs", label: "NestJS", ring: 1, projects: ["javi", "nexttarget"] },
  { id: "prisma", label: "Prisma", ring: 0, projects: ["javi", "azartime", "nexttarget"] },
  { id: "postgresql", label: "PostgreSQL", ring: 1, projects: ["javi", "azartime", "nexttarget"] },
  { id: "redis", label: "Redis", ring: 0, projects: ["javi"] },
  { id: "testing", label: "Jest · Vitest · Cypress", ring: 1, projects: [] },
];
