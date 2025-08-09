import { useTranslations } from "next-intl";
import { SectionHeader, InfoCard, StatsGrid, AnimatedSection, AnimatedGrid } from "@/components/common";
import SectionBackground from "@/components/ui/section-background";
import { SECTION_IDS } from "@/lib/constants";

export default function ProfileSummarySection() {
  const t = useTranslations("ProfileSummarySection");

  const stats = [
    { value: "7+", label: t("stats.experience") },
    { value: "5", label: t("stats.countries") },
    { value: "40%", label: t("stats.improvement") },
    { value: "10+", label: t("stats.projects") },
  ];

  const specializations = ["React & Next.js", "TypeScript", "Team Leadership"];

  return (
    <section id={SECTION_IDS.PROFILE} className="py-32 relative overflow-hidden">
      {/* Sophisticated Background */}
      <SectionBackground variant="profile" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <AnimatedSection animationType="fade" delay={0}>
            <SectionHeader title={t("title")} />
          </AnimatedSection>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Summary Text */}
            <AnimatedSection animationType="slide-right" delay={200}>
              <div className="space-y-8">
                <div className="space-y-6">
                  <p className="text-xl text-slate-700 font-light leading-relaxed">{t("summary")}</p>
                  <p className="text-lg text-slate-600 font-light leading-relaxed">{t("details")}</p>
                </div>

                {/* Key Highlights */}
                <div className="space-y-4">
                  <h3 className="text-sm text-slate-600 font-medium tracking-wider uppercase">
                    {t("highlights.title")}
                  </h3>
                  <AnimatedGrid animationType="slide-up" className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-2.5 flex-shrink-0" />
                      <span className="text-slate-700 font-light">{t("highlights.leadership")}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-2.5 flex-shrink-0" />
                      <span className="text-slate-700 font-light">{t("highlights.performance")}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-2.5 flex-shrink-0" />
                      <span className="text-slate-700 font-light">{t("highlights.international")}</span>
                    </div>
                  </AnimatedGrid>
                </div>
              </div>
            </AnimatedSection>

            {/* Right Column - Stats & Specializations */}
            <AnimatedSection animationType="slide-left" delay={400}>
              <div className="space-y-8">
                {/* Stats Grid */}
                <StatsGrid stats={stats} columns={2} />

                {/* Specializations */}
                <div className="space-y-4">
                  <h3 className="text-sm text-slate-600 font-medium tracking-wider uppercase">
                    {t("specializations.title")}
                  </h3>
                  <AnimatedGrid animationType="scale" className="space-y-3">
                    {specializations.map((spec) => (
                      <InfoCard key={spec} className="p-3" hover={false}>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 font-light">{spec}</span>
                          <div className="w-2 h-2 bg-slate-600 rounded-full" />
                        </div>
                      </InfoCard>
                    ))}
                  </AnimatedGrid>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
