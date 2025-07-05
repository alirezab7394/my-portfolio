import HeroSection from "@/components/landing/sections/HeroSection/HeroSection";
import ProfileSummarySection from "@/components/landing/sections/ProfileSummarySection/ProfileSummarySection";
import SkillsSection from "@/components/landing/sections/SkillsSection/SkillsSection";
import ExperienceSection from "@/components/landing/sections/ExperienceSection/ExperienceSection";
import EducationSection from "@/components/landing/sections/EducationSection/EducationSection";
import ProjectsSection from "@/components/landing/sections/ProjectsSection/ProjectsSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <HeroSection />
      <ProfileSummarySection />
      <SkillsSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
    </div>
  );
}
