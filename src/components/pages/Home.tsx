import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import { mapReviewRow } from "@/data/testimonials";

const StatsBar = dynamic(() => import("../sections/StatsBar"));
// const ManifestoSection = dynamic(() => import("../sections/ManifestoSection"));
const ServicesSection = dynamic(() => import("../sections/ServicesSection"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const ProcessSection = dynamic(
  () => import("../sections/ProcessSection"),
);
const TestimonialsSection = dynamic(
  () => import("../sections/TestimonialsSection"),
);

async function getInitialReviews() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return [];
    const res = await fetch(
      `${url}/rest/v1/reviews?select=*&status=eq.approved&order=created_at.desc`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: 300 },
      },
    );
    if (!res.ok) return [];
    return (await res.json()).map(mapReviewRow);
  } catch {
    return [];
  }
}

export default async function Home() {
  const initialReviews = await getInitialReviews();
  return (
    <div>
      <Hero />
      <div className="hidden md:block">
        <StatsBar />
      </div>
      {/* <ManifestoSection /> */}
      <ServicesSection />
      <Projects />
      <ProcessSection />
      <TestimonialsSection initialReviews={initialReviews} />
    </div>
  );
}
