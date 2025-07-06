import { useTranslations } from "next-intl";
import { ExternalLink, Github, TrendingUp, Users, Code, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SectionHeader,
  InfoCard,
  IconHeader,
  TypeBadge,
  AchievementList,
  TechTags,
  StatsGrid,
  AnimatedSection,
  AnimatedGrid,
} from "@/components/common";
import SectionBackground from "@/components/ui/section-background";
import { SECTION_IDS } from "@/lib/constants";

const projects = [
  {
    id: "cowsel-erp",
    title: "Cowsel ERP System",
    category: "Enterprise",
    description: "Led development of comprehensive ERP system improving operational efficiency by 35%",
    technologies: ["Next.js", "React", "TypeScript", "MongoDB", "Team Leadership"],
    achievements: [
      "Led team of 5 developers",
      "Built dynamic form builders",
      "Created reservation calendar system",
      "Improved operational efficiency by 35%",
    ],
    type: "enterprise",
    icon: Users,
    website: "https://www.markabu.com/",
    github: null,
  },
  {
    id: "skedpal-calendar",
    title: "Skedpal Smart Calendar",
    category: "SaaS Platform",
    description: "Architected AI-driven scheduling platform with intelligent calendar management",
    technologies: ["React", "Next.js", "TypeScript", "AI/ML", "SEO"],
    achievements: [
      "40% load time reduction through optimization",
      "30% SEO improvement with Next.js migration",
      "Introduced dark mode and accessibility features",
      "Built NLP package for smart scheduling",
    ],
    type: "platform",
    icon: TrendingUp,
    website: "https://app.skedpal.com",
    github: null,
  },
  {
    id: "dopely-colors",
    title: "Dopely Color Platform",
    category: "Design Tool",
    description: "Developed complex color algorithm system for visual design platform",
    technologies: ["React", "SSR", "Color Algorithms", "Mathematics", "Performance"],
    achievements: [
      "30% load time improvement",
      "Complex mathematical algorithm integration",
      "Enhanced user experience",
      "Optimized SSR performance",
    ],
    type: "tool",
    icon: Code,
    website: "https://colors.dopely.top/",
    github: null,
  },
  {
    id: "client-websites",
    title: "Client Portfolio",
    category: "Web Development",
    description: "High-impact websites with modern design and optimal performance",
    technologies: ["Next.js", "React", "MongoDB", "Prisma", "SEO"],
    achievements: [
      "Full-stack Next.js applications",
      "Modern responsive design",
      "SEO optimized performance",
      "Client satisfaction delivery",
    ],
    type: "portfolio",
    icon: Zap,
    website: "http://atashsetizan.com",
    github: null,
  },
];

export default function ProjectsSection() {
  const t = useTranslations("ProjectsSection");

  const projectStats = [
    { value: "50+", label: t("stats.projects") },
    { value: "35%", label: t("stats.efficiency") },
    { value: "40%", label: t("stats.performance") },
    { value: "100%", label: t("stats.satisfaction") },
  ];

  return (
    <section id={SECTION_IDS.PROJECTS} className="py-32 relative overflow-hidden">
      {/* Sophisticated Background */}
      <SectionBackground variant="projects" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <AnimatedSection animationType="fade" delay={0}>
            <SectionHeader title={t("title")} subtitle={t("subtitle")} />
          </AnimatedSection>

          {/* Projects Grid */}
          <AnimatedGrid animationType="slide-up" className="grid md:grid-cols-2 gap-8 mb-20">
            {projects.map((project) => (
              <InfoCard key={project.id} className="p-8 group">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <IconHeader
                    icon={project.icon}
                    title={project.title}
                    subtitle={project.category}
                    className="mb-0"
                    iconContainerClassName="group-hover:bg-slate-900/20 transition-colors"
                  />
                  <TypeBadge type={project.type} label={t(`types.${project.type}`)} variant="colorful" />
                </div>

                {/* Description */}
                <p className="text-slate-700 font-light leading-relaxed mb-6">{project.description}</p>

                {/* Achievements */}
                <AchievementList title={t("achievements")} items={project.achievements} />

                {/* Technologies */}
                <TechTags title={t("technologies")} tags={project.technologies} variant="default" />

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-300/60 text-slate-900 hover:bg-slate-900/10 flex items-center gap-2"
                    asChild
                  >
                    <a href={project.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      {t("actions.visit")}
                    </a>
                  </Button>
                  {project.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-300/60 text-slate-900 hover:bg-slate-900/10 flex items-center gap-2"
                      asChild
                    >
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                        {t("actions.code")}
                      </a>
                    </Button>
                  )}
                </div>
              </InfoCard>
            ))}
          </AnimatedGrid>

          {/* Project Statistics */}
          <AnimatedSection animationType="slide-up" delay={400}>
            <StatsGrid stats={projectStats} columns={4} className="mb-12" />
          </AnimatedSection>

          {/* Call to Action */}
          <AnimatedSection animationType="scale" delay={600}>
            <div className="text-center">
              <div className="inline-block p-8 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-sm">
                <h3 className="text-2xl font-light text-slate-900 mb-4">{t("cta.title")}</h3>
                <p className="text-slate-700 font-light mb-6">{t("cta.description")}</p>
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-sm font-medium tracking-wide">
                  {t("cta.button")}
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
