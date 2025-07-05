import { useTranslations } from "next-intl";
import SectionBackground from "@/components/ui/section-background";

export default function ProfileSummarySection() {
  const t = useTranslations("ProfileSummarySection");

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Sophisticated Background */}
      <SectionBackground variant="profile" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block">
              <h2 className="text-4xl lg:text-5xl font-light text-slate-900 mb-6 tracking-tight">{t("title")}</h2>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-slate-400/60 to-transparent mx-auto" />
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Summary Text */}
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-xl text-slate-700 font-light leading-relaxed">{t("summary")}</p>
                <p className="text-lg text-slate-600 font-light leading-relaxed">{t("details")}</p>
              </div>

              {/* Key Highlights */}
              <div className="space-y-4">
                <h3 className="text-sm text-slate-600 font-medium tracking-wider uppercase">{t("highlights.title")}</h3>
                <div className="space-y-3">
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
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Specializations */}
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center p-6 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
                  <div className="text-3xl font-light text-slate-900 mb-2">7+</div>
                  <div className="text-sm text-slate-600 font-medium tracking-wide uppercase">
                    {t("stats.experience")}
                  </div>
                </div>
                <div className="text-center p-6 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
                  <div className="text-3xl font-light text-slate-900 mb-2">5</div>
                  <div className="text-sm text-slate-600 font-medium tracking-wide uppercase">
                    {t("stats.countries")}
                  </div>
                </div>
                <div className="text-center p-6 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
                  <div className="text-3xl font-light text-slate-900 mb-2">40%</div>
                  <div className="text-sm text-slate-600 font-medium tracking-wide uppercase">
                    {t("stats.improvement")}
                  </div>
                </div>
                <div className="text-center p-6 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
                  <div className="text-3xl font-light text-slate-900 mb-2">50+</div>
                  <div className="text-sm text-slate-600 font-medium tracking-wide uppercase">
                    {t("stats.projects")}
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="space-y-4">
                <h3 className="text-sm text-slate-600 font-medium tracking-wider uppercase">
                  {t("specializations.title")}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
                    <span className="text-slate-700 font-light">React & Next.js</span>
                    <div className="w-2 h-2 bg-slate-600 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
                    <span className="text-slate-700 font-light">TypeScript</span>
                    <div className="w-2 h-2 bg-slate-600 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
                    <span className="text-slate-700 font-light">Team Leadership</span>
                    <div className="w-2 h-2 bg-slate-600 rounded-full" />
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
