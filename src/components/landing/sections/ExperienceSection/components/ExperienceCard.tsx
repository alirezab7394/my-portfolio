import { useTranslations } from "next-intl";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

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

const typeColors: Record<string, string> = {
  current: "bg-green-100 text-green-700 border-green-200",
  leadership: "bg-purple-100 text-purple-700 border-purple-200",
  contract: "bg-amber-100 text-amber-700 border-amber-200",
  fulltime: "bg-blue-100 text-blue-700 border-blue-200",
  fullstack: "bg-teal-100 text-teal-700 border-teal-200",
};

export default function ExperienceCard({ experience: exp, index }: ExperienceCardProps) {
  const t = useTranslations("ExperienceSection");
  const isEven = index % 2 === 0;

  return (
    <div className={`relative flex flex-col lg:flex-row ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
      {/* Timeline Dot - Desktop */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-md z-10 hidden lg:block" />

      {/* Content Card */}
      <div className={`w-full lg:w-[calc(50%-2rem)] ${isEven ? "lg:pr-0 lg:mr-auto" : "lg:pl-0 lg:ml-auto"}`}>
        <div className="bg-white rounded-lg p-6 lg:p-8 border border-secondary-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                <exp.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-800">{exp.position}</h3>
                <div className="flex items-center gap-2 text-secondary-600">
                  <span className="font-medium">{exp.company}</span>
                  {exp.website && (
                    <a
                      href={exp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${typeColors[exp.type] || "bg-secondary-100 text-secondary-600 border-secondary-200"}`}>
              {t(`types.${exp.type}`)}
            </span>
          </div>

          {/* Duration & Location */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-secondary-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{exp.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{exp.location}</span>
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-6">
            <h4 className="text-xs text-secondary-500 font-semibold tracking-wider uppercase mb-3">
              {t("achievements")}
            </h4>
            <ul className="space-y-2">
              {exp.achievements.map((achievement, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-secondary-600">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h4 className="text-xs text-secondary-500 font-semibold tracking-wider uppercase mb-3">
              {t("technologies")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {exp.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
