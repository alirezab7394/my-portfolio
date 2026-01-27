import { useTranslations } from "next-intl";
import { TrendingUp, Users, Code2, Briefcase } from "lucide-react";
import { AnimatedSection, AnimatedGrid } from "@/components/common";
import { SECTION_IDS } from "@/lib/constants";
import { ExperienceCard } from "./components";

const experiences = [
  {
    id: "skedpal",
    company: "Skedpal",
    position: "Frontend Lead",
    duration: "2021 - Present",
    location: "UAE (Remote)",
    website: "https://skedpal.com",
    type: "current",
    achievements: [
      "Lead team of 3 building AI-powered calendar app serving 10,000+ users globally",
      "Migrated WordPress to Next.js — 30% faster load, improved Core Web Vitals",
      "Spearheaded jQuery → React migration — 40% smaller bundle",
      "Implemented WCAG-compliant dark mode; built custom NLP date parser",
      "Conduct code reviews, mentor juniors, lead Agile sprints",
    ],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "NLP"],
    icon: TrendingUp,
  },
  {
    id: "techclass",
    company: "TechClass",
    position: "Frontend Developer",
    duration: "Apr - Jul 2021",
    location: "Finland (Remote)",
    website: "https://techclass.com",
    type: "contract",
    achievements: [
      "Converted CSR to SSR with Next.js — 50% improvement in FCP/LCP",
      "Implemented SEO optimizations improving search rankings",
    ],
    technologies: ["Next.js", "SSR", "SEO", "Performance"],
    icon: Code2,
  },
  {
    id: "dopely",
    company: "Dopely",
    position: "React Developer",
    duration: "Sep 2020 - Mar 2021",
    location: "Canada (Remote)",
    website: "https://colors.dopely.top/",
    type: "fulltime",
    achievements: [
      "Optimized SSR + code splitting — 30% faster page loads",
      "Built Canvas-based color tools serving 50K+ monthly users",
    ],
    technologies: ["React", "SSR", "Canvas", "Color Algorithms"],
    icon: Code2,
  },
  {
    id: "cowsel",
    company: "Cowsel",
    position: "Frontend Lead",
    duration: "Oct 2019 - Aug 2020",
    location: "Azerbaijan",
    website: "https://markabu.com",
    type: "leadership",
    achievements: [
      "Led team of 5 building ERP + e-commerce platform with React",
      "Architected reusable form builder and calendar components",
      "Launched international store with Next.js SSR + i18n support",
      "Improved client operational efficiency by 35%",
    ],
    technologies: ["React", "Next.js", "Team Leadership", "ERP", "i18n"],
    icon: Users,
  },
  {
    id: "opeqe",
    company: "Opeqe",
    position: "React Developer",
    duration: "Jan - Sep 2019",
    location: "USA (Remote)",
    website: null,
    type: "fulltime",
    achievements: [
      "Built 20+ reusable components following atomic design principles",
      "Created responsive email templates with cross-client testing",
    ],
    technologies: ["React", "Atomic Design", "Email Templates"],
    icon: Code2,
  },
  {
    id: "setorg",
    company: "Setorg Andishe",
    position: "Full-Stack Developer",
    duration: "Nov - Dec 2018",
    location: "Iran",
    website: null,
    type: "contract",
    achievements: [
      "Delivered government project: React frontend + Java Spring backend",
    ],
    technologies: ["React", "Java Spring", "Full-Stack"],
    icon: Briefcase,
  },
];

export default function ExperienceSection() {
  const t = useTranslations("ExperienceSection");

  const summaryStats = [
    { value: "7+", label: t("stats.years") },
    { value: "6", label: t("stats.companies") },
    { value: "5", label: t("stats.countries") },
    { value: "40%", label: t("stats.improvement") },
  ];

  return (
    <section id={SECTION_IDS.EXPERIENCE} className="py-24 lg:py-32 bg-secondary-50 relative">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

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

          {/* Experience Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <AnimatedSection animationType="fade" delay={200}>
              <div className="absolute left-6 lg:left-1/2 transform lg:-translate-x-px w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent h-full hidden lg:block" />
            </AnimatedSection>

            {/* Experience Items */}
            <AnimatedGrid animationType="slide-up" staggerDelay={150} className="space-y-8 lg:space-y-12">
              {experiences.map((exp, index) => (
                <ExperienceCard key={exp.id} experience={exp} index={index} />
              ))}
            </AnimatedGrid>
          </div>

          {/* Summary Stats */}
          <AnimatedSection animationType="slide-up" delay={400}>
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
              {summaryStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 text-center border border-secondary-200 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                >
                  <p className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-sm text-secondary-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
