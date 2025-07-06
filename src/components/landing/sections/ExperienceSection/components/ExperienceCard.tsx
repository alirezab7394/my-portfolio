import { useTranslations } from "next-intl";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { InfoCard, TypeBadge, AchievementList, TechTags } from "@/components/common";

interface ExperienceCardProps {
  experience: {
    id: string;
    company: string;
    position: string;
    duration: string;
    location: string;
    website: string | null;
    type: string;
    achievements: string[];
    technologies: string[];
    icon: React.ComponentType<{ className?: string }>;
  };
  index: number;
}

export default function ExperienceCard({ experience: exp, index }: ExperienceCardProps) {
  const t = useTranslations("ExperienceSection");

  return (
    <div className={`relative flex flex-col lg:flex-row ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
      {/* Timeline Dot */}
      <div className="absolute left-4.5 lg:left-1/2 transform lg:-translate-x-1/2 w-4 h-4 bg-slate-900 rounded-full border-4 border-white z-10" />

      {/* Timeline Line */}
      <div className="absolute left-6 lg:left-1/2 transform lg:-translate-x-1/2 w-0.5 h-full bg-slate-300 z-0" />

      {/* Content Card */}
      <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? "pl-16 lg:pl-0 lg:pr-8" : "pl-16 lg:pl-8 lg:pr-0"}`}>
        <InfoCard className="p-4 sm:p-6 lg:p-8 hover:bg-slate-900/10 transition-all duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900/10 rounded-sm">
                <exp.icon className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900">{exp.position}</h3>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="font-light">{exp.company}</span>
                  {exp.website && (
                    <a
                      href={exp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <TypeBadge type={exp.type} label={t(`types.${exp.type}`)} variant="colorful" />
          </div>

          {/* Duration & Location */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{exp.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{exp.location}</span>
            </div>
          </div>

          {/* Achievements */}
          <AchievementList title={t("achievements")} items={exp.achievements} />

          {/* Technologies */}
          <TechTags title={t("technologies")} tags={exp.technologies} variant="default" className="mb-0" />
        </InfoCard>
      </div>

      {/* Spacer - Only on desktop */}
      <div className="hidden lg:block lg:w-2/12" />
    </div>
  );
}
