import { useTranslations } from "next-intl";
import { TrendingUp, Users, Code2 } from "lucide-react";
import { SectionHeader, StatsGrid, AnimatedSection, AnimatedGrid } from "@/components/common";
import SectionBackground from "@/components/ui/section-background";
import { SECTION_IDS } from "@/lib/constants";
import { ExperienceCard } from "./components";

const experiences = [
  {
    id: "skedpal",
    company: "Skedpal",
    position: "Frontend Lead",
    duration: "Sep 2021 - Present",
    location: "Remote",
    website: "https://app.skedpal.com",
    type: "current",
    achievements: [
      "Directed team to build competitive calendar tool",
      "Migrated landing page from WordPress to Next.js - 30% SEO improvement",
      "Led jQuery to React migration - 40% load time reduction",
      "Introduced dark mode and NLP package for accessibility",
    ],
    technologies: ["React", "Next.js", "TypeScript", "WordPress", "SEO"],
    icon: TrendingUp,
  },
  {
    id: "techclass",
    company: "TechClass",
    position: "Developer",
    duration: "Apr 2021 - Jul 2021",
    location: "Finland",
    website: "https://techclass.com",
    type: "contract",
    achievements: ["Converted CSR to SSR for performance enhancement", "Improved SEO and page load performance"],
    technologies: ["Next.js", "SSR", "SEO"],
    icon: Code2,
  },
  {
    id: "dopely",
    company: "Dopely",
    position: "Mid-level Developer",
    duration: "Sep 2020 - May 2021",
    location: "Remote",
    website: "https://colors.dopely.top/",
    type: "fulltime",
    achievements: [
      "Refactored SSR code - 30% load time improvement",
      "Developed complex color algorithm components",
      "Enhanced user experience with mathematical integrations",
    ],
    technologies: ["React", "SSR", "Color Algorithms", "Mathematics"],
    icon: Code2,
  },
  {
    id: "cowsel",
    company: "Cowsel (Azar Amin Azerbaijan)",
    position: "Frontend Team Lead",
    duration: "Oct 2019 - Apr 2021",
    location: "Azerbaijan",
    website: "https://www.markabu.com/",
    type: "leadership",
    achievements: [
      "Led team of 5 developers",
      "Built ERP system and online store",
      "Developed dynamic form builders and reservation calendars",
      "Created international e-commerce platform",
    ],
    technologies: ["Next.js", "Team Leadership", "ERP", "E-commerce"],
    icon: Users,
  },
  {
    id: "opeqe",
    company: "Opeqe",
    position: "Junior React Developer",
    duration: "2019",
    location: "USA",
    website: null,
    type: "junior",
    achievements: [
      "Created reusable components and email templates",
      "Enhanced problem-solving through self-learning",
      "Gained independent working experience",
    ],
    technologies: ["React", "Email Templates", "Components"],
    icon: Code2,
  },
  {
    id: "setorg",
    company: "Setorg Andishe Iranian",
    position: "Developer (React, Java)",
    duration: "Nov 2018 - May 2019",
    location: "Iran",
    website: "https://setorgandishe.ir/",
    type: "fullstack",
    achievements: [
      "Contributed to government projects",
      "Enhanced security and usability features",
      "Gained full-stack development experience",
    ],
    technologies: ["React", "Java", "Government Projects", "Security"],
    icon: Code2,
  },
];

export default function ExperienceSection() {
  const t = useTranslations("ExperienceSection");

  const summaryStats = [
    { value: "7+", label: t("stats.years") },
    { value: "6", label: t("stats.companies") },
    { value: "5", label: t("stats.countries") },
    { value: "40%", label: t("stats.improvement") },
  ];

  return (
    <section id={SECTION_IDS.EXPERIENCE} className="py-16 sm:py-20 lg:py-32 relative overflow-hidden">
      {/* Sophisticated Background */}
      <SectionBackground variant="experience" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <AnimatedSection animationType="fade" delay={0}>
            <SectionHeader title={t("title")} subtitle={t("subtitle")} />
          </AnimatedSection>

          {/* Experience Timeline */}
          <div className="relative">
            {/* Central Timeline Line */}
            <AnimatedSection animationType="fade" delay={200}>
              <div className="absolute left-6 lg:left-1/2 transform lg:-translate-x-1/2 w-px bg-gradient-to-b from-transparent via-slate-400/60 to-transparent h-full" />
            </AnimatedSection>

            {/* Experience Items */}
            <AnimatedGrid animationType="slide-up" staggerDelay={150} className="space-y-8 lg:space-y-16">
              {experiences.map((exp, index) => (
                <ExperienceCard key={exp.id} experience={exp} index={index} />
              ))}
            </AnimatedGrid>
          </div>

          {/* Summary Stats */}
          <AnimatedSection animationType="slide-up" delay={400}>
            <div className="mt-20">
              <StatsGrid stats={summaryStats} columns={4} />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
