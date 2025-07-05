import { useTranslations } from "next-intl";
import { ExternalLink, Github, TrendingUp, Users, Code, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionBackground from "@/components/ui/section-background";

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

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Sophisticated Background */}
      <SectionBackground variant="projects" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block">
              <h2 className="text-4xl lg:text-5xl font-light text-slate-900 mb-6 tracking-tight">{t("title")} </h2>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-slate-400/60 to-transparent mx-auto" />
            </div>
            <p className="text-xl text-slate-700 font-light mt-8 max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>
          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm p-8 hover:bg-slate-900/10 transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900/10 rounded-sm group-hover:bg-slate-900/20 transition-colors">
                      <project.icon className="w-6 h-6 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-slate-900 mb-1">{project.title}</h3>
                      <p className="text-slate-700 font-light">{project.category}</p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.type === "enterprise"
                        ? "bg-blue-500/20 text-blue-700"
                        : project.type === "platform"
                        ? "bg-green-500/20 text-green-700"
                        : project.type === "tool"
                        ? "bg-purple-500/20 text-purple-700"
                        : "bg-yellow-500/20 text-yellow-700"
                    }`}
                  >
                    {t(`types.${project.type}`)}
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-700 font-light leading-relaxed mb-6">{project.description}</p>

                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider">
                    {t("achievements")}
                  </h4>
                  <ul className="space-y-2">
                    {project.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                        <div className="w-1 h-1 bg-slate-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="font-light">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider">
                    {t("technologies")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-slate-900/10 text-slate-700 text-xs font-medium rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

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
              </div>
            ))}
          </div>
          {/* Project Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
              <div className="text-3xl font-light text-slate-900 mb-2">50+</div>
              <div className="text-sm text-slate-600 font-medium tracking-wide uppercase">{t("stats.projects")}</div>
            </div>
            <div className="text-center p-6 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
              <div className="text-3xl font-light text-slate-900 mb-2">35%</div>
              <div className="text-sm text-slate-600 font-medium tracking-wide uppercase">{t("stats.efficiency")}</div>
            </div>
            <div className="text-center p-6 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
              <div className="text-3xl font-light text-slate-900 mb-2">40%</div>
              <div className="text-sm text-slate-600 font-medium tracking-wide uppercase">{t("stats.performance")}</div>
            </div>
            <div className="text-center p-6 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
              <div className="text-3xl font-light text-slate-900 mb-2">100%</div>
              <div className="text-sm text-slate-600 font-medium tracking-wide uppercase">
                {t("stats.satisfaction")}
              </div>
            </div>
          </div>
          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-block p-8 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-sm">
              <h3 className="text-2xl font-light text-slate-900 mb-4">{t("cta.title")}</h3>
              <p className="text-slate-700 font-light mb-6">{t("cta.description")}</p>
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-sm font-medium tracking-wide">
                {t("cta.button")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
