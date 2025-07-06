import { useTranslations } from "next-intl";
import { Calendar, MapPin, ExternalLink, TrendingUp, Users, Code2 } from "lucide-react";
import {
  SectionHeader,
  InfoCard,
  TypeBadge,
  AchievementList,
  TechTags,
  StatsGrid,
  AnimatedSection,
  AnimatedGrid,
} from "@/components/common";
import SectionBackground from "@/components/ui/section-background";
import { SECTION_IDS } from "@/lib/constants";

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
    <section id={SECTION_IDS.EXPERIENCE} className="py-32 relative overflow-hidden">
      {/* Sophisticated Background */}
      <SectionBackground variant="experience" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <AnimatedSection animationType="fade" delay={0}>
            <SectionHeader title={t("title")} subtitle={t("subtitle")} />
          </AnimatedSection>

          {/* Experience Timeline */}
          <div className="relative">
            {/* Central Timeline Line */}
            <AnimatedSection animationType="fade" delay={200}>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-slate-400/60 to-transparent h-full" />
            </AnimatedSection>

            {/* Experience Items */}
            <AnimatedGrid animationType="slide-up" staggerDelay={150} className="space-y-16">
              {experiences.map((exp, index) => (
                <div key={exp.id} className={`relative flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-900 rounded-full border-4 border-white z-10" />

                  {/* Content Card */}
                  <div className={`w-5/12 ${index % 2 === 0 ? "pr-8" : "pl-8"}`}>
                    <InfoCard className="p-8 hover:bg-slate-900/10 transition-all duration-300">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-900/10 rounded-sm">
                            <exp.icon className="w-5 h-5 text-slate-700" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-slate-900">{exp.position}</h3>
                            <div className="flex items-center gap-2 text-slate-700">
                              <span className="font-light">{exp.company}</span>
                              {exp.website && (
                                <a
                                  href={exp.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                        <TypeBadge type={exp.type} label={t(`types.${exp.type}`)} variant="colorful" />
                      </div>

                      {/* Duration & Location */}
                      <div className="flex items-center gap-4 mb-6 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                      </div>

                      {/* Achievements */}
                      <AchievementList title={t("achievements")} items={exp.achievements} />

                      {/* Technologies */}
                      <TechTags title={t("technologies")} tags={exp.technologies} variant="default" className="mb-0" />
                    </InfoCard>
                  </div>

                  {/* Spacer */}
                  <div className="w-2/12" />
                </div>
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
