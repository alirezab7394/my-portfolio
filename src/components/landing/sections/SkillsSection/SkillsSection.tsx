import { useTranslations } from "next-intl";
import { Code, Layers, Palette, Database, TestTube, Users, MessageSquare, TrendingUp, Target } from "lucide-react";
import SectionBackground from "@/components/ui/section-background";

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

  return (
    <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-stone-50 relative overflow-hidden">
      {/* Sophisticated Background */}
      <SectionBackground variant="skills" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-light text-slate-900 mb-6 tracking-tight">{t("title")}</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />
            <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>

          {/* Skills Grid */}
          <div className="space-y-12">
            {/* Technical Skills */}
            <div>
              <h3 className="text-sm text-slate-600 font-medium tracking-wide uppercase mb-6">
                {t("technical.title")}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {skillCategories.map((category) => (
                  <div
                    key={category.key}
                    className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-sm p-6 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <category.icon className="w-5 h-5 text-slate-600" />
                      <h4 className="text-lg font-medium text-slate-800">
                        {t(`technical.categories.${category.key}`)}
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {category.skills.map((skill) => (
                        <div key={skill} className="text-slate-700 font-light text-sm">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <h3 className="text-sm text-slate-600 font-medium tracking-wide uppercase mb-6">{t("soft.title")}</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {softSkills.map((skill) => (
                  <div
                    key={skill.key}
                    className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-sm p-6 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <skill.icon className="w-5 h-5 text-slate-600" />
                      <h4 className="text-lg font-medium text-slate-800">{t(`soft.skills.${skill.key}.title`)}</h4>
                    </div>
                    <p className="text-slate-600 font-light text-sm leading-relaxed">
                      {t(`soft.skills.${skill.key}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Summary */}
            <div className="bg-slate-900 rounded-sm p-8 text-center">
              <p className="text-white/90 font-light text-lg mb-6">{t("summary.text")}</p>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-light text-white mb-2">7+</div>
                  <div className="text-sm text-white/70 font-medium tracking-wide uppercase">{t("summary.years")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-white mb-2">15+</div>
                  <div className="text-sm text-white/70 font-medium tracking-wide uppercase">
                    {t("summary.technologies")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-white mb-2">5</div>
                  <div className="text-sm text-white/70 font-medium tracking-wide uppercase">
                    {t("summary.countries")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
