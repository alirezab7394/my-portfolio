import HeroSection from "@/components/landing/sections/HeroSection/HeroSection";
import ProfileSummarySection from "@/components/landing/sections/ProfileSummarySection/ProfileSummarySection";
import SkillsSection from "@/components/landing/sections/SkillsSection/SkillsSection";
import ExperienceSection from "@/components/landing/sections/ExperienceSection/ExperienceSection";
import EducationSection from "@/components/landing/sections/EducationSection/EducationSection";
import ProjectsSection from "@/components/landing/sections/ProjectsSection/ProjectsSection";
import { SectionNavigator } from "@/components/common";
import { useTranslations } from "next-intl";
import { NAVIGATION_SECTIONS } from "@/lib/constants";

export default function Home() {
  const t = useTranslations("SectionNavigator");

  const sections = NAVIGATION_SECTIONS.map((section) => ({
    id: section.id,
    label: t(section.translationKey),
  }));

  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProfileSummarySection />
      <SkillsSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <SectionNavigator sections={sections} />
    </div>
  );
}
