import dynamic from "next/dynamic";
import {
  HeroSection,
  AboutSection,
  SkillsSection,
  ServicesSection,
  ContactSection,
} from "@/components/sections";
import { Header, Footer, WhatsAppButton } from "@/components/layout";
import {
  personalInfo,
  education,
  experiences,
  contactInfo,
} from "@/lib/data/personal-info";
import { skills } from "@/lib/data/skills";
import { services } from "@/lib/data/services";
import { webProjects, graphicProjects } from "@/lib/data/portfolio-items";

// Dynamic imports for heavy components with code splitting
const PortfolioSection = dynamic(
  () => import("@/components/sections/PortfolioSection"),
  {
    loading: () => (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: true,
  }
);

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection
          name={personalInfo.name}
          title={personalInfo.title}
          description={personalInfo.description}
          profileImage={personalInfo.profileImage}
        />

        <AboutSection
          personalInfo={personalInfo}
          education={education}
          experiences={experiences}
          profileImage={personalInfo.profileImage}
        />

        <SkillsSection skills={skills} />

        <ServicesSection services={services} />

        <PortfolioSection
          webProjects={webProjects}
          graphicProjects={graphicProjects}
        />

        <ContactSection contactInfo={contactInfo} />
      </main>
      <Footer />
      <WhatsAppButton
        phoneNumber={contactInfo.whatsapp}
        message="Bonjour, je souhaite discuter d'un projet avec vous."
      />
    </>
  );
}
