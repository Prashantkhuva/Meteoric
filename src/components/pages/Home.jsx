import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";

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

export default function Home() {
  return (
    <div>
      <Hero />
      <StatsBar />
      <ManifestoSection />
      <ServicesSection />
      <Projects />
      <ProcessSection />
      <TestimonialsSection />
    </div>
  );
}
