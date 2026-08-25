import { useTranslations } from "next-intl";
import { GraduationCap, Award, Calendar, MapPin } from "lucide-react";
import { AnimatedSection, AnimatedGrid } from "@/components/common";
import { SECTION_IDS } from "@/lib/constants";

const education = [
  {
    id: "masters",
    degree: "M.Sc. Artificial Intelligence",
    field: "Artificial Intelligence",
    university: "University of Tabriz",
    location: "Tabriz, Iran",
    period: "2017 - 2020",
    type: "masters",
    icon: Award,
    description: "Advanced studies in AI algorithms, machine learning, neural networks, and deep learning systems.",
  },
  {
    id: "bachelors",
    degree: "B.Sc. Software Engineering",
    field: "Software Engineering",
    university: "University of Bonab",
    location: "Bonab, Iran",
    period: "2013 - 2017",
    type: "bachelors",
    icon: GraduationCap,
    description: "Comprehensive foundation in software development, data structures, algorithms, and computer systems.",
  },
];

const academicSkills = [
  "Artificial Intelligence",
  "Machine Learning",
  "Neural Networks",
  "Software Engineering",
  "Algorithm Design",
  "Data Structures",
];

export default function EducationSection() {
  const t = useTranslations("EducationSection");

  return (
    <section
      id={SECTION_IDS.EDUCATION}
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

          {/* Education Cards */}
          <AnimatedGrid animationType="slide-up" className="grid md:grid-cols-2 gap-8 mb-16">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="bg-secondary-50 rounded-lg p-8 border border-secondary-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <edu.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-800 mb-1">{edu.degree}</h3>
                    <p className="text-primary font-medium">{edu.university}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{edu.period}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{edu.location}</span>
                    </div>
                  </div>

                  <p className="text-secondary-600 leading-relaxed">{edu.description}</p>

                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    edu.type === "masters" 
                      ? "bg-purple-100 text-purple-700 border border-purple-200" 
                      : "bg-blue-100 text-blue-700 border border-blue-200"
                  }`}>
                    {t(`types.${edu.type}`)}
                  </span>
                </div>
              </div>
            ))}
          </AnimatedGrid>

          {/* Academic Excellence Stats */}
          <AnimatedSection animationType="slide-up" delay={400}>
            <div className="bg-primary rounded-lg p-8 text-center mb-16">
              <h3 className="text-xl font-semibold text-white mb-8">{t("achievements.title")}</h3>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-4xl font-bold text-white mb-2">AI</p>
                  <p className="text-sm text-white/70">{t("achievements.specialization")}</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-white mb-2">8+</p>
                  <p className="text-sm text-white/70">{t("achievements.experience")}</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-white mb-2">2</p>
                  <p className="text-sm text-white/70">{t("achievements.degrees")}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Academic Foundation Skills */}
          <AnimatedSection animationType="slide-up" delay={600}>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-secondary-700 mb-6">{t("skills.title")}</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {academicSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-secondary-100 text-secondary-700 font-medium rounded-full border border-secondary-200 hover:border-primary/30 hover:bg-primary/5 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
