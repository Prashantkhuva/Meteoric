import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";

const ClientLogoMarquee = dynamic(
  () => import("@/components/sections/ClientLogoMarquee"),
);
const StatsBar = dynamic(() => import("../sections/StatsBar"));
const ManifestoSection = dynamic(() => import("../sections/ManifestoSection"));
const ServicesSection = dynamic(() => import("../sections/ServicesSection"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const ProcessSection = dynamic(
  () => import("@/components/sections/ProcessSection"),
);
const TestimonialsSection = dynamic(
  () => import("@/components/sections/TestimonialsSection"),
);
const LeadCaptureSection = dynamic(
  () => import("@/components/sections/LeadCaptureSection"),
);

export default function Home() {
  return (
    <div>
      <Hero />
      <ClientLogoMarquee />
      <StatsBar />
      <ManifestoSection />
      <ServicesSection />
      <Projects />
      <ProcessSection />
      <TestimonialsSection />
      <LeadCaptureSection />
    </div>
  );
}
