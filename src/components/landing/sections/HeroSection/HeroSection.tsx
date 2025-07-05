import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { StatsGrid, ContactInfo } from "@/components/common";
import HeroBackground from "./components/background/HeroBackground";
import { SECTION_IDS } from "@/lib/constants";

export default function HeroSection() {
  const t = useTranslations("HeroSection");

  const stats = [
    { value: t("metrics.experience"), label: t("metrics.experienceLabel") },
    { value: t("metrics.projects"), label: t("metrics.projectsLabel") },
    { value: t("metrics.performance"), label: t("metrics.performanceLabel") },
  ];

  const contactItems = [
    { icon: Mail, label: "Email", value: t("contact.email") },
    { icon: Phone, label: "Phone", value: t("contact.phone") },
    { icon: MapPin, label: "Location", value: t("contact.location") },
  ];

  return (
    <section
      id={SECTION_IDS.HERO}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50 relative overflow-hidden"
    >
      {/* Sophisticated Background */}
      <HeroBackground />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="min-h-screen flex flex-col justify-center">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Greeting & Name */}
              <div className="space-y-2">
                <p className="text-slate-600 text-lg font-light tracking-wide">{t("greeting")}</p>
                <h1 className="text-5xl lg:text-7xl font-light text-slate-900 tracking-tight leading-none">
                  {t("name")}
                </h1>
                <div className="w-24 h-px bg-gradient-to-r from-primary to-transparent mt-4" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-medium text-slate-800 leading-relaxed">{t("title")}</h2>
                <p className="text-lg text-slate-600 font-light">{t("subtitle")}</p>
              </div>

              {/* Summary */}
              <p className="text-xl text-slate-700 font-light leading-relaxed max-w-2xl">{t("summary")}</p>

              {/* Metrics */}
              <div className="pt-8">
                <StatsGrid stats={stats} columns={3} className="gap-8" />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 rounded-none font-medium tracking-wide transition-all duration-300 group"
                >
                  {t("cta.contact")}
                  <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-300 hover:border-slate-900 hover:bg-slate-50 px-8 py-6 rounded-none font-medium tracking-wide transition-all duration-300"
                >
                  {t("cta.resume")}
                </Button>
              </div>
            </div>

            {/* Right Column - Contact Info */}
            <div className="lg:col-span-4 space-y-8">
              {/* Availability Status */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-sm p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-slate-600 font-medium">{t("availability")}</span>
                </div>
                <ContactInfo items={contactItems} />
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-sm text-slate-600 font-medium tracking-wide uppercase">Connect</h3>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/alirezab7394"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-white border border-slate-200 hover:border-slate-400 transition-colors duration-300 group"
                  >
                    <Github className="h-5 w-5 text-slate-600 group-hover:text-slate-900" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/alireza-bagheri-a6aaa681/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-white border border-slate-200 hover:border-slate-400 transition-colors duration-300 group"
                  >
                    <Linkedin className="h-5 w-5 text-slate-600 group-hover:text-slate-900" />
                  </a>
                </div>
              </div>

              {/* Technology Stack */}
              <div className="space-y-4">
                <h3 className="text-sm text-slate-600 font-medium tracking-wide uppercase">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {["React", "Next.js", "TypeScript", "Node.js", "Tailwind"].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium tracking-wide rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
