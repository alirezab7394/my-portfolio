import HeroSection from "@/components/landing/HeroSection/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <HeroSection />
    </div>
  );
}
