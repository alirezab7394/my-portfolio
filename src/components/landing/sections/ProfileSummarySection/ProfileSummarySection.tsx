import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedGrid } from "@/components/common";
import { SECTION_IDS } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";

export default function ProfileSummarySection() {
  const t = useTranslations("ProfileSummarySection");

  const stats = [
    { value: "8+", label: t("stats.experience") },
    { value: "5", label: t("stats.countries") },
    { value: "40%", label: t("stats.improvement") },
    { value: "10+", label: t("stats.projects") },
  ];

  const specializations = ["React & Next.js", "TypeScript", "Team Leadership", "Performance Optimization"];

  return (
    <section id={SECTION_IDS.PROFILE} className="py-24 lg:py-32 bg-secondary-50 relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <AnimatedSection animationType="fade" delay={0}>
            <div className="text-center mb-16">
              <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">{t("title")}</p>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
            </div>
          </AnimatedSection>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Summary */}
            <AnimatedSection animationType="slide-right" delay={200}>
              <div className="space-y-8">
                {/* Summary Box */}
                <div className="bg-white rounded-lg p-8 shadow-sm border-l-4 border-primary">
                  <p className="text-lg text-secondary-700 leading-relaxed mb-4">{t("summary")}</p>
                  <p className="text-secondary-600 leading-relaxed">{t("details")}</p>
                </div>

                {/* Key Highlights */}
                <div className="space-y-4">
                  <h3 className="text-xs text-secondary-500 font-semibold tracking-wider uppercase">
                    {t("highlights.title")}
                  </h3>
                  <AnimatedGrid animationType="slide-up" className="space-y-3">
                    {[t("highlights.leadership"), t("highlights.performance"), t("highlights.international")].map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-secondary-200 hover:border-primary/30 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-secondary-700">{highlight}</span>
                      </div>
                    ))}
                  </AnimatedGrid>
                </div>
              </div>
            </AnimatedSection>

            {/* Right Column - Stats & Specializations */}
            <AnimatedSection animationType="slide-left" delay={400}>
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-6 text-center border border-secondary-200 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                    >
                      <p className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                      <p className="text-sm text-secondary-500 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Specializations */}
                <div className="bg-primary rounded-lg p-8">
                  <h3 className="text-xs text-white/70 font-semibold tracking-wider uppercase mb-6">
                    {t("specializations.title")}
                  </h3>
                  <div className="space-y-3">
                    {specializations.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm"
                      >
                        <span className="text-white font-medium">{spec}</span>
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    ))}
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
