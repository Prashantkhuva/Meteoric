"use client";

import { useEffect } from "react";

export default function CalBooking() {
  useEffect(() => {
    import("@calcom/embed-react").then(({ getCalApi }) => {
      getCalApi({ namespace: "let-s-build" }).then((cal) => {
        cal("inline", {
          elementOrSelector: "#cal-embed",
          calLink: "prashantkhuva/let-s-build",
        });
        cal("ui", { theme: "dark", layout: "month_view" });
      });
    });
  }, []);

  return (
    <section className="min-h-screen bg-[#070707] pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Book a Free Strategy Call
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          Pick a time that works for you. No commitment, no sales pitch — just a
          conversation about your project.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <div id="cal-embed" className="min-h-[700px] w-full" />
      </div>
    </section>
  );
}
