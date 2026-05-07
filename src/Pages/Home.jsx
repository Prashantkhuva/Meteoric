import React from "react";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import Projects from "../Components/Projects";
import TransitionSection from "../Components/TransitionSection";
import ProcessSection from "../Components/ProcessSection";
import CapabilitiesSection from "../Components/CapabilitySection";
import Footer from "../Components/Footer";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <TransitionSection />
      <Projects />
      <ProcessSection />
      <CapabilitiesSection />
      {/* <CTASection /> */}
      <Footer />
    </div>
  );
}

export default Home;
