import { useTranslations } from "next-intl";
import { ExternalLink, TrendingUp, Users, Code, Brain, Watch, Dumbbell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection, AnimatedGrid } from "@/components/common";
import { SECTION_IDS } from "@/lib/constants";
import { Link } from "@/navigation";

const featuredProject = {
  id: "javi" as const,
  icon: Brain,
  website: "https://javienglish.com",
  technologies: [
    "Next.js 16",
    "NestJS",
    "React 19",
    "TypeScript",
    "Turborepo",
    "Prisma",
    "PostgreSQL",
    "Redis",
    "NextAuth v5",
    "OpenAI",
    "AWS S3",
    "Socket.IO",
    "next-intl",
    "Tailwind CSS",
    "Shadcn/UI",
  ],
};

const projects: {
  id: string;
  icon: typeof Watch;
  website: string;
  technologies: string[];
  fromTranslations?: boolean;
  title?: string;
  category?: string;
  description?: string;
  achievements?: string[];
}[] = [
  {
    id: "nexttarget",
    icon: Dumbbell,
    website: "https://next-target.ir",
    technologies: ["Next.js", "NestJS", "Expo", "Prisma", "PostgreSQL"],
    fromTranslations: true,
  },
  {
    id: "azartime",
    icon: Watch,
    website: "https://azartime.com",
    technologies: ["Next.js 16", "React 19", "Prisma", "PostgreSQL", "ZarinPal"],
    fromTranslations: true,
  },
  {
    id: "skedpal-calendar",
    title: "Skedpal Smart Calendar",
    category: "SaaS Platform",
    description:
      "Architected AI-driven scheduling platform serving 10,000+ users globally with intelligent calendar management.",
    technologies: ["React", "Next.js", "TypeScript", "AI/ML", "NLP"],
    achievements: [
      "30% load time reduction through optimization",
      "40% SEO improvement with Next.js migration",
      "Custom NLP date parser implementation",
    ],
    icon: TrendingUp,
    website: "https://skedpal.com",
  },
  {
    id: "cowsel-erp",
    title: "Cowsel ERP System",
    category: "Enterprise Solution",
    description: "Led development of comprehensive ERP system improving operational efficiency by 35%.",
    technologies: ["Next.js", "React", "TypeScript", "MongoDB"],
    achievements: [
      "Led team of 5 developers",
      "Built dynamic form builders & calendar",
      "35% operational efficiency improvement",
    ],
    icon: Users,
    website: "https://www.markabu.com/",
  },
  {
    id: "dopely-colors",
    title: "Dopely Color Platform",
    category: "Design Tool",
    description:
      "Developed complex color algorithm system for visual design platform serving 50K+ monthly users.",
    technologies: ["React", "SSR", "Canvas", "Algorithms"],
    achievements: [
      "30% load time improvement",
      "50K+ monthly active users",
      "Complex color algorithm integration",
    ],
    icon: Code,
    website: "https://colors.dopely.top/",
  },
];

export default function ProjectsSection() {
  const t = useTranslations("ProjectsSection");
  const FeaturedIcon = featuredProject.icon;
  const featuredAchievements = t.raw(`featured.${featuredProject.id}.achievements`) as string[];

  return (
    <section id={SECTION_IDS.PROJECTS} className="py-24 lg:py-32 bg-secondary-50 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animationType="fade" delay={0}>
            <div className="text-center mb-16">
              <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">{t("title")}</p>
              <p className="text-secondary-500 max-w-2xl mx-auto">{t("subtitle")}</p>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-4" />
            </div>
          </AnimatedSection>

          <AnimatedSection animationType="slide-up" delay={200}>
            <div className="bg-white rounded-xl p-8 lg:p-10 border-2 border-primary/20 shadow-lg mb-16 relative overflow-hidden">
              <div className="absolute top-0 end-0 bg-primary text-white text-xs font-bold px-4 py-2 rounded-es-lg">
                {t("featuredBadge")}
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <FeaturedIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-secondary-800">
                        {t(`featured.${featuredProject.id}.title`)}
                      </h3>
                      <p className="text-primary font-medium">
                        {t(`featured.${featuredProject.id}.category`)}
                      </p>
                    </div>
                  </div>

                  <p className="text-secondary-600 leading-relaxed mb-6">
                    {t(`featured.${featuredProject.id}.description`)}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-500 mb-6">
                    <span className="px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-full">
                      {t(`featured.${featuredProject.id}.status`)}
                    </span>
                    <span>{t(`featured.${featuredProject.id}.role`)}</span>
                    <span>{t(`featured.${featuredProject.id}.year`)}</span>
                  </div>

                  <Button
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-5 font-medium group"
                    asChild
                  >
                    <a href={featuredProject.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 me-2" />
                      {t("visitPlatform")}
                      <ArrowRight className="w-4 h-4 ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>

                <div>
                  <h4 className="text-xs text-secondary-500 font-semibold tracking-wider uppercase mb-4">
                    {t("keyFeatures")}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {featuredAchievements.map((achievement, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-secondary-600">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-xs text-secondary-500 font-semibold tracking-wider uppercase mb-4">
                    {t("techStack")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {featuredProject.technologies.slice(0, 10).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {featuredProject.technologies.length > 10 && (
                      <span className="px-2.5 py-1 bg-secondary-100 text-secondary-500 text-xs font-medium rounded-full">
                        {t("moreTech", { count: featuredProject.technologies.length - 10 })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedGrid animationType="slide-up" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {projects.map((project) => {
              const title = project.fromTranslations
                ? t(`featured.${project.id}.title`)
                : (project.title ?? "");
              const category = project.fromTranslations
                ? t(`featured.${project.id}.category`)
                : (project.category ?? "");
              const description = project.fromTranslations
                ? t(`featured.${project.id}.description`)
                : (project.description ?? "");
              const achievements = project.fromTranslations
                ? (t.raw(`featured.${project.id}.achievements`) as string[]).slice(0, 3)
                : (project.achievements ?? []);

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-lg p-6 border border-secondary-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <project.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-800">{title}</h3>
                      <p className="text-xs text-primary font-medium">{category}</p>
                    </div>
                  </div>

                  <p className="text-sm text-secondary-600 mb-4 line-clamp-2">{description}</p>

                  <ul className="space-y-1.5 mb-4">
                    {achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-secondary-500">
                        <span className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-secondary-100 text-secondary-600 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-secondary-200 hover:border-primary hover:bg-primary/5 text-secondary-700"
                    asChild
                  >
                    <a href={project.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 me-2" />
                      {t("actions.visit")}
                    </a>
                  </Button>
                </div>
              );
            })}
          </AnimatedGrid>

          <AnimatedSection animationType="slide-up" delay={400}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {[
                { value: "10+", label: t("stats.projects") },
                { value: "35%", label: t("stats.efficiency") },
                { value: "40%", label: t("stats.performance") },
                { value: "100%", label: t("stats.satisfaction") },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 text-center border border-secondary-200 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                >
                  <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-sm text-secondary-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection animationType="scale" delay={600}>
            <div className="text-center">
              <div className="inline-block p-8 bg-primary rounded-xl text-center">
                <h3 className="text-2xl font-semibold text-white mb-4">{t("cta.title")}</h3>
                <p className="text-white/80 mb-6 max-w-md mx-auto">{t("cta.description")}</p>
                <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 font-medium group" asChild>
                  <Link href="/contact">
                    {t("cta.button")}
                    <ArrowRight className="w-4 h-4 ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
