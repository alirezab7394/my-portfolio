import ContactForm from "@/components/forms/ContactForm";
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
  import { generateMetadata as generateMetadataFn } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  
  return generateMetadataFn(
    t("title"),
    t("description"),
    ["contact", "portfolio", "developer", "hire"],
    locale
  );
}

export default function ContactPage() {
  const t = useTranslations("ContactPage");

  const contactMethods = [
    {
      icon: Mail,
      label: t("contact.email"),
      value: "alireza7394@gmail.com",
      href: "mailto:alireza7394@gmail.com",
    },
    {
      icon: Phone,
      label: t("contact.phone"),
      value: "+98 936 655 4441",
      href: "tel:+989366554441",
    },
    {
      icon: MapPin,
      label: t("contact.location"),
      value: "Tabriz, Iran",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/alirezab7394",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/alireza-bagheri-a6aaa681/",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-secondary-50 to-white relative overflow-hidden">
        {/* Decorative top line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-800 mb-6">
              {t("title")}
            </h1>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Left Column - Contact Form */}
              <div>
                <div className="bg-white border border-secondary-200 rounded-xl p-8 lg:p-10 shadow-sm">
                  <h2 className="text-2xl font-semibold text-secondary-800 mb-2">
                    {t("form.title")}
                  </h2>
                  <p className="text-secondary-500 mb-8">
                    {t("form.subtitle")}
                  </p>
                  <ContactForm />
                </div>
              </div>

              {/* Right Column - Contact Info */}
              <div className="space-y-8">
                {/* Contact Methods */}
                <div className="bg-secondary-50 rounded-xl p-8 border border-secondary-200">
                  <h3 className="text-xl font-semibold text-secondary-800 mb-6">
                    {t("info.title")}
                  </h3>
                  <div className="space-y-4">
                    {contactMethods.map((method, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-white rounded-lg border border-secondary-200 hover:border-primary/30 transition-colors"
                      >
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <method.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-secondary-500 font-medium mb-1">
                            {method.label}
                          </p>
                          {method.href ? (
                            <a
                              href={method.href}
                              className="text-secondary-700 font-medium hover:text-primary transition-colors"
                            >
                              {method.value}
                            </a>
                          ) : (
                            <p className="text-secondary-700 font-medium">{method.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-white border border-secondary-200 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-secondary-800 mb-6">
                    {t("social.title")}
                  </h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-14 h-14 bg-secondary-50 border border-secondary-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                      >
                        <social.icon className="w-6 h-6 text-secondary-500 group-hover:text-primary" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="bg-primary rounded-xl p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                    <span className="font-semibold">{t("availability.title")}</span>
                  </div>
                  <p className="text-white/80">{t("availability.description")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
