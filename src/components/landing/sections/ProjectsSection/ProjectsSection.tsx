import { useTranslations } from "next-intl";
import { ExternalLink, Github, TrendingUp, Users, Code, Zap, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection, AnimatedGrid } from "@/components/common";
import { SECTION_IDS } from "@/lib/constants";

const featuredProject = {
  id: "javi-english",
  title: "Javi English",
  category: "AI-Powered EdTech Platform",
  description: "Full-stack EdTech platform built from scratch, serving real users for IELTS exam preparation with AI-powered features.",
  technologies: ["Next.js 16", "React 19", "TypeScript", "Prisma", "PostgreSQL", "NextAuth v5", "AWS S3", "OpenAI API", "Tailwind CSS", "Shadcn/UI", "Jotai", "Framer Motion", "DnD Kit", "Zod", "React Hook Form"],
  achievements: [
    "25+ question types (Listening, Reading, Writing, Speaking)",
    "3 user roles with role-based auth (Admin/Teacher/Student)",
    "OpenAI integration for automated scoring & feedback",
    "AI-generated personalized study plans & chat assistant",
    "Real-time exam system with timer & progress tracking",
    "Drag-drop question builder with audio/video support",
    "Subscription system with payment gateway integration",
    "Push notifications, analytics dashboard, course builder",
  ],
  type: "featured",
  icon: Brain,
  website: "https://app.javienglish.com",
  github: null,
  role: "Solo Developer",
  year: "2025",
  status: "Production",
};

const projects = [
  {
    id: "skedpal-calendar",
    title: "Skedpal Smart Calendar",
    category: "SaaS Platform",
    description: "Architected AI-driven scheduling platform serving 10,000+ users globally with intelligent calendar management.",
    technologies: ["React", "Next.js", "TypeScript", "AI/ML", "NLP"],
    achievements: [
      "30% load time reduction through optimization",
      "40% SEO improvement with Next.js migration",
      "Custom NLP date parser implementation",
    ],
    type: "platform",
    icon: TrendingUp,
    website: "https://skedpal.com",
    github: null,
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
    type: "enterprise",
    icon: Users,
    website: "https://www.markabu.com/",
    github: null,
  },
  {
    id: "dopely-colors",
    title: "Dopely Color Platform",
    category: "Design Tool",
    description: "Developed complex color algorithm system for visual design platform serving 50K+ monthly users.",
    technologies: ["React", "SSR", "Canvas", "Algorithms"],
    achievements: [
      "30% load time improvement",
      "50K+ monthly active users",
      "Complex color algorithm integration",
    ],
    type: "tool",
    icon: Code,
    website: "https://colors.dopely.top/",
    github: null,
  },
];

export default function ProjectsSection() {
  const t = useTranslations("ProjectsSection");

  return (
    <section id={SECTION_IDS.PROJECTS} className="py-24 lg:py-32 bg-secondary-50 relative">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <AnimatedSection animationType="fade" delay={0}>
            <div className="text-center mb-16">
              <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">{t("title")}</p>
              <p className="text-secondary-500 max-w-2xl mx-auto">{t("subtitle")}</p>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-4" />
            </div>
          </AnimatedSection>

          {/* Featured Project - Javi English */}
          <AnimatedSection animationType="slide-up" delay={200}>
            <div className="bg-white rounded-xl p-8 lg:p-10 border-2 border-primary/20 shadow-lg mb-16 relative overflow-hidden">
              {/* Featured Badge */}
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-2 rounded-bl-lg">
                FEATURED PROJECT
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                {/* Left Column */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <featuredProject.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-secondary-800">{featuredProject.title}</h3>
                      <p className="text-primary font-medium">{featuredProject.category}</p>
                    </div>
                  </div>

                  <p className="text-secondary-600 leading-relaxed mb-6">{featuredProject.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-500 mb-6">
                    <span className="px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-full">
                      {featuredProject.status}
                    </span>
                    <span>{featuredProject.role}</span>
                    <span>{featuredProject.year}</span>
                  </div>

                  <Button
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-5 font-medium group"
                    asChild
                  >
                    <a href={featuredProject.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Platform
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>

                {/* Right Column - Achievements */}
                <div>
                  <h4 className="text-xs text-secondary-500 font-semibold tracking-wider uppercase mb-4">
                    Key Features
                  </h4>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {featuredProject.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-secondary-600">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-xs text-secondary-500 font-semibold tracking-wider uppercase mb-4">
                    Tech Stack
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
                        +{featuredProject.technologies.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Other Projects Grid */}
          <AnimatedGrid animationType="slide-up" className="grid md:grid-cols-3 gap-6 mb-16">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg p-6 border border-secondary-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <project.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-800">{project.title}</h3>
                    <p className="text-xs text-primary font-medium">{project.category}</p>
                  </div>
                </div>

                <p className="text-sm text-secondary-600 mb-4 line-clamp-2">{project.description}</p>

                {/* Achievements */}
                <ul className="space-y-1.5 mb-4">
                  {project.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-secondary-500">
                      <span className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>

                {/* Technologies */}
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

                {/* Action */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-secondary-200 hover:border-primary hover:bg-primary/5 text-secondary-700"
                  asChild
                >
                  <a href={project.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t("actions.visit")}
                  </a>
                </Button>
              </div>
            ))}
          </AnimatedGrid>

          {/* Project Statistics */}
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

          {/* Call to Action */}
          <AnimatedSection animationType="scale" delay={600}>
            <div className="text-center">
              <div className="inline-block p-8 bg-primary rounded-xl text-center">
                <h3 className="text-2xl font-semibold text-white mb-4">{t("cta.title")}</h3>
                <p className="text-white/80 mb-6 max-w-md mx-auto">{t("cta.description")}</p>
                <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 font-medium group">
                  {t("cta.button")}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
