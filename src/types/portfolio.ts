export type ProjectId = "javi" | "azartime" | "skedpal" | "nexttarget" | "cowsel" | "dopely";

export interface Project {
  id: ProjectId;
  url: string;
  domain: string;
  stack: string[];
  /** Poster tint used until a real screenshot is provided. */
  accent: string;
  /** Path under /public, e.g. "/projects/javi.webp" (1600x1000 recommended). */
  image?: string;
  /** Optional muted loop, e.g. "/projects/javi.mp4". Shown in the case study. */
  video?: string;
}

/** Shape of `TimeEngineered.Projects.items.<id>` in messages/*.json */
export interface ProjectCopy {
  title: string;
  category: string;
  year: string;
  role: string;
  description: string;
  metrics: { value: string; label: string }[];
  features: string[];
}

export type ExperienceId = "skedpal" | "techclass" | "dopely" | "cowsel" | "opeqe" | "setorg";

export interface ExperienceEntry {
  id: ExperienceId;
  company: string;
  start: number;
  /** null = current role */
  end: number | null;
  url?: string;
  stack: string[];
}

export type SkillId =
  | "react"
  | "nextjs"
  | "typescript"
  | "tailwind"
  | "framer"
  | "nestjs"
  | "prisma"
  | "postgresql"
  | "redis"
  | "testing";

export interface Skill {
  id: SkillId;
  label: string;
  ring: 0 | 1;
  projects: ProjectId[];
}

export type StatId = "years" | "projects" | "performance" | "countries";

export interface Stat {
  id: StatId;
  value: number;
  suffix: string;
}
