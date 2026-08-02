import { useTranslations } from "next-intl";
import { Code2, Layers, Palette, Database, TestTube, Settings, Users, MessageSquare, TrendingUp, Target } from "lucide-react";
import { AnimatedSection, AnimatedGrid } from "@/components/common";
import { SECTION_IDS } from "@/lib/constants";

const skillCategories = [
  {
    icon: Code2,
    key: "frontend",
    skills: ["React", "Next.js (App Router, Server Actions)", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3"],
  },
  {
    icon: Settings,
    key: "build",
    skills: ["Webpack", "Vite", "Turbopack"],
  },
  {
    icon: Layers,
    key: "state",
    skills: ["Redux", "Zustand", "Jotai", "React Query", "Context API"],
  },
  {
    icon: Palette,
    key: "ui",
    skills: ["Tailwind CSS", "Shadcn/UI", "Material UI", "Framer Motion"],
  },
  {
    icon: Database,
    key: "backend",
    skills: ["NestJS", "Node.js", "Prisma", "PostgreSQL", "Redis", "MongoDB", "REST APIs"],
  },
  {
    icon: TestTube,
    key: "tools",
    skills: ["Jest", "Vitest", "React Testing Library", "Cypress", "Git", "GitHub Actions"],
  },
];

const softSkills = [
  { icon: Target, key: "problemSolving" },
  { icon: MessageSquare, key: "communication" },
  { icon: TrendingUp, key: "adaptability" },
  { icon: Users, key: "leadership" },
];

const methodologies = ["Agile/Scrum", "Code Review", "Pair Programming", "TDD"];

export default function SkillsSection() {
  const t = useTranslations("SkillsSection");

  return (
    <section
      id={SECTION_IDS.SKILLS}
      className="py-24 lg:py-32 bg-white relative"
    >
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary-200 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <AnimatedSection animationType="fade" delay={0}>
            <div className="text-center mb-16">
              <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">{t("title")}</p>
              <p className="text-secondary-500 max-w-2xl mx-auto">{t("subtitle")}</p>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-4" />
            </div>
          </AnimatedSection>

          {/* Technical Skills */}
          <AnimatedSection animationType="slide-up" delay={200}>
            <div className="mb-16">
              <h3 className="text-xs text-secondary-500 font-semibold tracking-wider uppercase mb-8 text-center">
                {t("technical.title")}
              </h3>
              <AnimatedGrid animationType="scale" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillCategories.map((category) => (
                  <div
                    key={category.key}
                    className="bg-secondary-50 rounded-lg p-6 border border-secondary-200 hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <category.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-semibold text-secondary-700">{t(`technical.categories.${category.key}`)}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2.5 py-1 bg-white text-secondary-600 rounded-full border border-secondary-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </AnimatedGrid>
            </div>
          </AnimatedSection>

          {/* Soft Skills & Methodologies */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Soft Skills */}
            <AnimatedSection animationType="slide-up" delay={400}>
              <div className="bg-secondary-50 rounded-lg p-8 border border-secondary-200 h-full">
                <h3 className="text-xs text-secondary-500 font-semibold tracking-wider uppercase mb-6">{t("soft.title")}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {softSkills.map((skill) => (
                    <div
                      key={skill.key}
                      className="bg-white rounded-lg p-4 border border-secondary-200 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <skill.icon className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold text-secondary-700 text-sm">{t(`soft.skills.${skill.key}.title`)}</h4>
                      </div>
                      <p className="text-xs text-secondary-500 leading-relaxed">
                        {t(`soft.skills.${skill.key}.description`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Methodologies & Summary */}
            <AnimatedSection animationType="slide-up" delay={500}>
              <div className="space-y-6 h-full flex flex-col">
                {/* Methodologies */}
                <div className="bg-secondary-50 rounded-lg p-8 border border-secondary-200 flex-1">
                  <h3 className="text-xs text-secondary-500 font-semibold tracking-wider uppercase mb-6">Methodologies</h3>
                  <div className="flex flex-wrap gap-3">
                    {methodologies.map((method) => (
                      <span
                        key={method}
                        className="px-4 py-2 bg-white text-secondary-700 font-medium rounded-lg border border-secondary-200 hover:border-primary/30 transition-colors"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="bg-primary rounded-lg p-8 text-center">
                  <p className="text-white/80 font-medium mb-6">{t("summary.text")}</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-3xl font-bold text-white">7+</p>
                      <p className="text-xs text-white/70 font-medium">{t("summary.years")}</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">20+</p>
                      <p className="text-xs text-white/70 font-medium">{t("summary.technologies")}</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">5</p>
                      <p className="text-xs text-white/70 font-medium">{t("summary.countries")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
