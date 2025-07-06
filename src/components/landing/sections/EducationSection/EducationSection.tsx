import { useTranslations } from "next-intl";
import { GraduationCap, BookOpen, Award, MapPin } from "lucide-react";
import {
  SectionHeader,
  InfoCard,
  IconHeader,
  TypeBadge,
  TechTags,
  StatsGrid,
  AnimatedSection,
  AnimatedGrid,
} from "@/components/common";
import SectionBackground from "@/components/ui/section-background";
import { SECTION_IDS } from "@/lib/constants";

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

const educationSkills = [
  "Artificial Intelligence",
  "Machine Learning",
  "Neural Networks",
  "Software Engineering",
  "Algorithm Design",
  "Computer Systems",
  "Data Structures",
  "Programming Languages",
];

export default function EducationSection() {
  const t = useTranslations("EducationSection");

  const achievementStats = [
    { value: "AI", label: t("achievements.specialization") },
    { value: "7+", label: t("achievements.experience") },
    { value: "2", label: t("achievements.degrees") },
  ];

  return (
    <section
      id={SECTION_IDS.EDUCATION}
      className="py-32 bg-gradient-to-br from-white via-slate-50 to-stone-50 relative overflow-hidden"
    >
      {/* Sophisticated Background */}
      <SectionBackground variant="education" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <AnimatedSection animationType="fade" delay={0}>
            <SectionHeader title={t("title")} subtitle={t("subtitle")} />
          </AnimatedSection>

          {/* Education Cards */}
          <AnimatedGrid animationType="slide-up" className="grid md:grid-cols-2 gap-8 mb-20">
            {education.map((edu) => (
              <InfoCard key={edu.id} variant="glass" className="p-8 hover:shadow-md transition-all duration-300 group">
                {/* Header */}
                <IconHeader
                  icon={edu.icon}
                  title={edu.degree}
                  subtitle={edu.field}
                  iconContainerClassName="p-3 bg-primary/10 rounded-sm group-hover:bg-primary/20 transition-colors"
                  iconClassName="w-6 h-6 text-primary"
                  titleClassName="text-xl font-medium text-slate-900 mb-1"
                  subtitleClassName="text-lg text-primary font-light mb-2"
                />

                <p className="text-slate-600 font-light mb-4">{edu.university}</p>

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

                  <TypeBadge type={edu.type} label={t(`types.${edu.type}`)} variant="colorful" />
                </div>
              </InfoCard>
            ))}
          </AnimatedGrid>

          {/* Academic Achievements */}
          <AnimatedSection animationType="slide-up" delay={400}>
            <div className="bg-slate-900 rounded-sm p-8 text-center mb-20">
              <h3 className="text-2xl font-light text-white mb-8">{t("achievements.title")}</h3>
              <StatsGrid
                stats={achievementStats}
                columns={3}
                variant="dark"
                valueClassName="text-white"
                labelClassName="text-slate-400"
              />
            </div>
          </AnimatedSection>

          {/* Skills from Education */}
          <AnimatedSection animationType="slide-up" delay={600}>
            <div>
              <h3 className="text-2xl font-light text-slate-800 mb-8 text-center">{t("skills.title")}</h3>
              <TechTags
                tags={educationSkills}
                variant="outlined"
                className="flex justify-center"
                tagClassName="hover:bg-slate-50 transition-colors"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
