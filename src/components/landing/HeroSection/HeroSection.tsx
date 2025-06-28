import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, Phone, Download, ArrowRight } from "lucide-react";
import HeroBackground from "./components/background/HeroBackground";

export default function HeroSection() {
  const t = useTranslations("HeroSection");

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <HeroBackground />

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Status Badge */}
          <Badge variant="outline" className="mb-6 px-4 py-2 border-orange-200 text-orange-600 bg-orange-50">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            {t("status")}
          </Badge>

          {/* Name & Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 tracking-tight">{t("name")}</h1>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent flex-1 max-w-20" />
            <h2 className="text-xl md:text-2xl text-gray-600 font-medium">{t("title")}</h2>
            <div className="h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent flex-1 max-w-20" />
          </div>

          {/* Experience Badge */}
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-6 py-3 mb-8">
            <span className="text-3xl font-bold text-orange-500">{t("experience.years")}</span>
            <span className="text-gray-700">{t("experience.text")}</span>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">{t("description")}</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {t("cta.contact")}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 hover:border-orange-500 px-8 py-6 text-lg rounded-full transition-all duration-300 group"
            >
              <Download className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              {t("cta.resume")}
            </Button>
          </div>

          {/* Contact Links */}
          <div className="flex justify-center gap-6">
            <a
              href="mailto:alireza7394@gmail.com"
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors duration-300 group"
            >
              <div className="p-3 rounded-full bg-gray-100 group-hover:bg-orange-50 transition-colors duration-300">
                <Mail className="h-5 w-5" />
              </div>
              <span className="hidden sm:inline font-medium">{t("contact.email")}</span>
            </a>

            <a
              href="tel:+989366554441"
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors duration-300 group"
            >
              <div className="p-3 rounded-full bg-gray-100 group-hover:bg-orange-50 transition-colors duration-300">
                <Phone className="h-5 w-5" />
              </div>
              <span className="hidden sm:inline font-medium">{t("contact.phone")}</span>
            </a>

            <a
              href="https://www.linkedin.com/in/alireza-bagheri-a6aaa681/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors duration-300 group"
            >
              <div className="p-3 rounded-full bg-gray-100 group-hover:bg-orange-50 transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </div>
              <span className="hidden sm:inline font-medium">{t("contact.linkedin")}</span>
            </a>

            <a
              href="https://github.com/alirezab7394"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors duration-300 group"
            >
              <div className="p-3 rounded-full bg-gray-100 group-hover:bg-orange-50 transition-colors duration-300">
                <Github className="h-5 w-5" />
              </div>
              <span className="hidden sm:inline font-medium">{t("contact.github")}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
    </section>
  );
}
