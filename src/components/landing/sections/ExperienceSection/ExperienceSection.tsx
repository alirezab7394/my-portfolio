import { useTranslations } from "next-intl";
import { Calendar, MapPin, ExternalLink, TrendingUp, Users, Code2 } from "lucide-react";
import SectionBackground from "@/components/ui/section-background";

const experiences = [
  {
    id: "skedpal",
    company: "Skedpal",
    position: "Frontend Lead",
    duration: "Sep 2021 - Present",
    location: "Remote",
    website: "https://app.skedpal.com",
    type: "current",
    achievements: [
      "Directed team to build competitive calendar tool",
      "Migrated landing page from WordPress to Next.js - 30% SEO improvement",
      "Led jQuery to React migration - 40% load time reduction",
      "Introduced dark mode and NLP package for accessibility",
    ],
    technologies: ["React", "Next.js", "TypeScript", "WordPress", "SEO"],
    icon: TrendingUp,
  },
  {
    id: "techclass",
    company: "TechClass",
    position: "Developer",
    duration: "Apr 2021 - Jul 2021",
    location: "Finland",
    website: "https://techclass.com",
    type: "contract",
    achievements: ["Converted CSR to SSR for performance enhancement", "Improved SEO and page load performance"],
    technologies: ["Next.js", "SSR", "SEO"],
    icon: Code2,
  },
  {
    id: "dopely",
    company: "Dopely",
    position: "Mid-level Developer",
    duration: "Sep 2020 - May 2021",
    location: "Remote",
    website: "https://colors.dopely.top/",
    type: "fulltime",
    achievements: [
      "Refactored SSR code - 30% load time improvement",
      "Developed complex color algorithm components",
      "Enhanced user experience with mathematical integrations",
    ],
    technologies: ["React", "SSR", "Color Algorithms", "Mathematics"],
    icon: Code2,
  },
  {
    id: "cowsel",
    company: "Cowsel (Azar Amin Azerbaijan)",
    position: "Frontend Team Lead",
    duration: "Oct 2019 - Apr 2021",
    location: "Azerbaijan",
    website: "https://www.markabu.com/",
    type: "leadership",
    achievements: [
      "Led team of 5 developers",
      "Built ERP system and online store",
      "Developed dynamic form builders and reservation calendars",
      "Created international e-commerce platform",
    ],
    technologies: ["Next.js", "Team Leadership", "ERP", "E-commerce"],
    icon: Users,
  },
  {
    id: "opeqe",
    company: "Opeqe",
    position: "Junior React Developer",
    duration: "2019",
    location: "USA",
    website: null,
    type: "junior",
    achievements: [
      "Created reusable components and email templates",
      "Enhanced problem-solving through self-learning",
      "Gained independent working experience",
    ],
    technologies: ["React", "Email Templates", "Components"],
    icon: Code2,
  },
  {
    id: "setorg",
    company: "Setorg Andishe Iranian",
    position: "Developer (React, Java)",
    duration: "Nov 2018 - May 2019",
    location: "Iran",
    website: "https://setorgandishe.ir/",
    type: "fullstack",
    achievements: [
      "Contributed to government projects",
      "Enhanced security and usability features",
      "Gained full-stack development experience",
    ],
    technologies: ["React", "Java", "Government Projects", "Security"],
    icon: Code2,
  },
];

export default function ExperienceSection() {
  const t = useTranslations("ExperienceSection");

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Sophisticated Background */}
      <SectionBackground variant="experience" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block">
              <h2 className="text-4xl lg:text-5xl font-light text-slate-900 mb-6 tracking-tight">{t("title")}</h2>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-slate-400/60 to-transparent mx-auto" />
            </div>
            <p className="text-xl text-slate-700 font-light mt-8 max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>

          {/* Experience Timeline */}
          <div className="relative">
            {/* Central Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-slate-400/60 to-transparent h-full" />

            {/* Experience Items */}
            <div className="space-y-16">
              {experiences.map((exp, index) => (
                <div key={exp.id} className={`relative flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-900 rounded-full border-4 border-white z-10" />

                  {/* Content Card */}
                  <div className={`w-5/12 ${index % 2 === 0 ? "pr-8" : "pl-8"}`}>
                    <div className="bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm p-8 hover:bg-slate-900/10 transition-all duration-300">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
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
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            exp.type === "current"
                              ? "bg-green-500/20 text-green-700"
                              : exp.type === "leadership"
                              ? "bg-blue-500/20 text-blue-700"
                              : exp.type === "contract"
                              ? "bg-purple-500/20 text-purple-700"
                              : "bg-slate-500/20 text-slate-700"
                          }`}
                        >
                          {t(`types.${exp.type}`)}
                        </div>
                      </div>

                      {/* Duration & Location */}
                      <div className="flex items-center gap-4 mb-6 text-sm text-slate-600">
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
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider">
                          {t("achievements")}
                        </h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                              <div className="w-1 h-1 bg-slate-600 rounded-full mt-2 flex-shrink-0" />
                              <span className="font-light">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider">
                          {t("technologies")}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-slate-900/10 text-slate-700 text-xs font-medium rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="w-2/12" />
                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
              <div className="text-3xl font-light text-slate-900 mb-2">7+</div>
              <div className="text-sm text-slate-600 font-medium tracking-wide uppercase">{t("stats.years")}</div>
            </div>
            <div className="text-center p-6 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
              <div className="text-3xl font-light text-slate-900 mb-2">6</div>
              <div className="text-sm text-slate-600 font-medium tracking-wide uppercase">{t("stats.companies")}</div>
            </div>
            <div className="text-center p-6 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
              <div className="text-3xl font-light text-slate-900 mb-2">5</div>
              <div className="text-sm text-slate-600 font-medium tracking-wide uppercase">{t("stats.countries")}</div>
            </div>
            <div className="text-center p-6 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm">
              <div className="text-3xl font-light text-slate-900 mb-2">40%</div>
              <div className="text-sm text-slate-600 font-medium tracking-wide uppercase">{t("stats.improvement")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
