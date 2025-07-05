import { useTranslations } from "next-intl";
import { GraduationCap, BookOpen, Award, MapPin } from "lucide-react";
import SectionBackground from "@/components/ui/section-background";

const education = [
  {
    id: "masters",
    degree: "Master of Science",
    field: "Artificial Intelligence",
    university: "Tabriz University",
    location: "Tabriz, Iran",
    period: "2017-2019",
    type: "masters",
    icon: Award,
    description: "Advanced studies in AI algorithms, machine learning, and neural networks",
  },
  {
    id: "bachelors",
    degree: "Bachelor of Science",
    field: "Computer Software Engineering",
    university: "Bonab University",
    location: "Bonab, Iran",
    period: "2013-2017",
    type: "bachelors",
    icon: GraduationCap,
    description: "Comprehensive foundation in software development, algorithms, and computer systems",
  },
];

export default function EducationSection() {
  const t = useTranslations("EducationSection");

  return (
    <section className="py-32 bg-gradient-to-br from-white via-slate-50 to-stone-50 relative overflow-hidden">
      {/* Sophisticated Background */}
      <SectionBackground variant="education" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block">
              <h2 className="text-4xl lg:text-5xl font-light text-slate-900 mb-6 tracking-tight">{t("title")}</h2>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mx-auto" />
            </div>
            <p className="text-xl text-slate-600 font-light mt-8 max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>

          {/* Education Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-sm p-8 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-sm group-hover:bg-primary/20 transition-colors">
                    <edu.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-slate-900 mb-1">{edu.degree}</h3>
                    <h4 className="text-lg text-primary font-light mb-2">{edu.field}</h4>
                    <p className="text-slate-600 font-light">{edu.university}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{edu.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{edu.location}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 font-light leading-relaxed">{edu.description}</p>

                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      edu.type === "masters" ? "bg-primary/20 text-primary" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {t(`types.${edu.type}`)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Academic Achievements */}
          <div className="bg-slate-900 rounded-sm p-8 text-center">
            <h3 className="text-2xl font-light text-white mb-8">{t("achievements.title")}</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="text-3xl font-light text-white">AI</div>
                <div className="text-sm text-slate-400 font-medium tracking-wide uppercase">
                  {t("achievements.specialization")}
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-light text-white">7+</div>
                <div className="text-sm text-slate-400 font-medium tracking-wide uppercase">
                  {t("achievements.experience")}
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-light text-white">2</div>
                <div className="text-sm text-slate-400 font-medium tracking-wide uppercase">
                  {t("achievements.degrees")}
                </div>
              </div>
            </div>
          </div>

          {/* Skills from Education */}
          <div className="mt-20">
            <h3 className="text-2xl font-light text-slate-800 mb-8 text-center">{t("skills.title")}</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Artificial Intelligence",
                "Machine Learning",
                "Neural Networks",
                "Software Engineering",
                "Algorithm Design",
                "Computer Systems",
                "Data Structures",
                "Programming Languages",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 text-sm font-light rounded-full hover:bg-slate-50 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
