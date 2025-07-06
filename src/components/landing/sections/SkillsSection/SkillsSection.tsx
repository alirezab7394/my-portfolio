import { useTranslations } from "next-intl";
import { Code, Layers, Palette, Database, TestTube, Users, MessageSquare, TrendingUp, Target } from "lucide-react";
import { SectionHeader, InfoCard, IconHeader, StatsGrid, AnimatedSection, AnimatedGrid } from "@/components/common";
import SectionBackground from "@/components/ui/section-background";
import { SECTION_IDS } from "@/lib/constants";

const skillCategories = [
  {
    icon: Code,
    key: "frontend",
    skills: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "SCSS"],
  },
  {
    icon: Layers,
    key: "state",
    skills: ["Context", "Recoil", "Redux"],
  },
  {
    icon: Palette,
    key: "ui",
    skills: ["Material UI (MUI)", "Tailwind", "Shadcn"],
  },
  {
    icon: Database,
    key: "backend",
    skills: ["Prisma", "Firebase", "Firestore", "MongoDB"],
  },
  {
    icon: TestTube,
    key: "tools",
    skills: ["Git", "Jest", "Enzyme", "Vitest", "Storybook"],
  },
];

const softSkills = [
  { icon: Target, key: "problemSolving" },
  { icon: MessageSquare, key: "communication" },
  { icon: TrendingUp, key: "adaptability" },
  { icon: Users, key: "leadership" },
];

export default function SkillsSection() {
  const t = useTranslations("SkillsSection");

  const summaryStats = [
    { value: "7+", label: t("summary.years") },
    { value: "15+", label: t("summary.technologies") },
    { value: "5", label: t("summary.countries") },
  ];

  return (
    <section
      id={SECTION_IDS.SKILLS}
      className="py-32 bg-gradient-to-br from-slate-50 via-white to-stone-50 relative overflow-hidden"
    >
      {/* Sophisticated Background */}
      <SectionBackground variant="skills" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <AnimatedSection animationType="fade" delay={0}>
            <SectionHeader title={t("title")} subtitle={t("subtitle")} className="mb-16" />
          </AnimatedSection>

          {/* Skills Grid */}
          <div className="space-y-12">
            {/* Technical Skills */}
            <AnimatedSection animationType="slide-up" delay={200}>
              <div>
                <h3 className="text-sm text-slate-600 font-medium tracking-wide uppercase mb-6">
                  {t("technical.title")}
                </h3>
                <AnimatedGrid animationType="scale" className="grid md:grid-cols-2 gap-6">
                  {skillCategories.map((category) => (
                    <InfoCard
                      key={category.key}
                      variant="glass"
                      className="hover:shadow-md transition-all duration-300"
                    >
                      <IconHeader
                        icon={category.icon}
                        title={t(`technical.categories.${category.key}`)}
                        iconClassName="w-5 h-5 text-slate-600"
                        iconContainerClassName="p-0 bg-transparent"
                        titleClassName="text-lg font-medium text-slate-800"
                      />
                      <div className="space-y-2">
                        {category.skills.map((skill) => (
                          <div key={skill} className="text-slate-700 font-light text-sm">
                            {skill}
                          </div>
                        ))}
                      </div>
                    </InfoCard>
                  ))}
                </AnimatedGrid>
              </div>
            </AnimatedSection>

            {/* Soft Skills */}
            <AnimatedSection animationType="slide-up" delay={400}>
              <div>
                <h3 className="text-sm text-slate-600 font-medium tracking-wide uppercase mb-6">{t("soft.title")}</h3>
                <AnimatedGrid animationType="slide-up" className="grid md:grid-cols-2 gap-6">
                  {softSkills.map((skill) => (
                    <InfoCard key={skill.key} variant="glass" className="hover:shadow-md transition-all duration-300">
                      <IconHeader
                        icon={skill.icon}
                        title={t(`soft.skills.${skill.key}.title`)}
                        iconClassName="w-5 h-5 text-slate-600"
                        iconContainerClassName="p-0 bg-transparent"
                        titleClassName="text-lg font-medium text-slate-800"
                        className="mb-3"
                      />
                      <p className="text-slate-600 font-light text-sm leading-relaxed">
                        {t(`soft.skills.${skill.key}.description`)}
                      </p>
                    </InfoCard>
                  ))}
                </AnimatedGrid>
              </div>
            </AnimatedSection>

            {/* Skills Summary */}
            <AnimatedSection animationType="slide-up" delay={600}>
              <div className="bg-slate-900 rounded-sm p-8 text-center">
                <p className="text-white/90 font-light text-lg mb-6">{t("summary.text")}</p>
                <StatsGrid
                  stats={summaryStats}
                  columns={3}
                  variant="dark"
                  valueClassName="text-white"
                  labelClassName="text-white/70"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
