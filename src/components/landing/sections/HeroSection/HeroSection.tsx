import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { SECTION_IDS } from "@/lib/constants";
import AnimatedBackground from "./components/AnimatedBackground";
import { Link } from "@/navigation";

export default function HeroSection() {
  const t = useTranslations("HeroSection");

  return (
    <section id={SECTION_IDS.HERO} className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent z-10" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="min-h-screen flex flex-col justify-center py-20">
          {/* Main Content */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-7 space-y-10">
              {/* Avatar & Name */}
              <div className="space-y-6">
                <Avatar className="w-20 h-20 lg:w-28 lg:h-28 border-4 border-white shadow-xl ring-2 ring-primary/20">
                  <AvatarImage src="/avatar.jpg" alt="Alireza Bagheri" className="object-cover" />
                  <AvatarFallback className="text-xl font-medium text-primary bg-primary/10">AB</AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <p className="text-primary font-medium tracking-wide text-sm uppercase">{t("greeting")}</p>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-700 tracking-tight">
                    {t("name")}
                  </h1>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-4 border-l-4 border-primary pl-6">
                <h2 className="text-xl lg:text-2xl font-semibold text-secondary-700">{t("title")}</h2>
                <p className="text-lg text-secondary-500">{t("subtitle")}</p>
              </div>

              {/* Summary */}
              <p className="text-lg lg:text-xl text-secondary-600 leading-relaxed max-w-xl">{t("summary")}</p>

              {/* Key Metrics - Minimalist Style */}
              <div className="flex flex-wrap gap-8 py-6 border-y border-secondary-200">
                <div className="space-y-1">
                  <p className="text-3xl lg:text-4xl font-bold text-primary">{t("metrics.experience")}</p>
                  <p className="text-sm text-secondary-500 font-medium">{t("metrics.experienceLabel")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl lg:text-4xl font-bold text-primary">{t("metrics.projects")}</p>
                  <p className="text-sm text-secondary-500 font-medium">{t("metrics.projectsLabel")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl lg:text-4xl font-bold text-primary">{t("metrics.performance")}</p>
                  <p className="text-sm text-secondary-500 font-medium">{t("metrics.performanceLabel")}</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 font-medium tracking-wide transition-all duration-300 group shadow-lg shadow-primary/20"
                  asChild
                >
                  <Link href="/contact">
                    {t("cta.contact")}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-secondary-300 hover:border-primary hover:bg-primary/5 px-8 py-6 font-medium tracking-wide transition-all duration-300"
                  asChild
                >
                  <a href="/resume.html" target="_blank" rel="noopener noreferrer">
                    {t("cta.resume")}
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Column - Contact Card */}
            <div className="lg:col-span-5 space-y-6">
              {/* Availability Card */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                  <span className="text-sm text-secondary-700 font-semibold">{t("availability")}</span>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-secondary-600">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{t("contact.email")}</span>
                  </div>
                  <div className="flex items-center gap-4 text-secondary-600">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{t("contact.phone")}</span>
                  </div>
                  <div className="flex items-center gap-4 text-secondary-600">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{t("contact.location")}</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white border border-secondary-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xs text-secondary-500 font-semibold tracking-wider uppercase mb-4">Connect</h3>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/alirezab7394"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-secondary-50 border border-secondary-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                  >
                    <Github className="h-5 w-5 text-secondary-500 group-hover:text-primary" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/alireza-bagheri-a6aaa681/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-secondary-50 border border-secondary-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                  >
                    <Linkedin className="h-5 w-5 text-secondary-500 group-hover:text-primary" />
                  </a>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-white border border-secondary-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xs text-secondary-500 font-semibold tracking-wider uppercase mb-4">
                  Core Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20"
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
