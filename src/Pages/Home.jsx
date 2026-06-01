import { useEffect } from "react";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import Projects from "../Components/Projects";
import TransitionSection from "../Components/TransitionSection";
import ProcessSection from "../Components/ProcessSection";
import CapabilitiesSection from "../Components/CapabilitySection";
import TestimonialsSection from "../Components/TestimonialsSection";
import LeadCaptureSection from "../Components/LeadCaptureSection";
import Footer from "../Components/Footer";
import SEO from "../Components/SEO";
import { pageSeo } from "../seo.config";
import { useLocation } from "react-router-dom";

const breadcrumbs = [
  { name: "Home", url: "https://withmeteoric.vercel.app/" },
];

function Home({ seoKey = "home", scrollTargetId }) {
  const location = useLocation();
  const seo = pageSeo[seoKey] ?? pageSeo.home;

  useEffect(() => {
    const targetId = scrollTargetId || location.hash.replace("#", "");

    if (!targetId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [location.hash, scrollTargetId]);

  return (
    <main>
      <SEO {...seo} breadcrumbs={breadcrumbs} />
      <header className="contents">
        <Navbar />
      </header>
      <Hero />
      <TransitionSection />
      <Projects />
      <ProcessSection />
      <CapabilitiesSection />
      <TestimonialsSection />
      <LeadCaptureSection />
      <Footer />
    </main>
  );
}

export default Home;
