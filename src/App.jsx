import { AnalyticsRouteListener } from "./analytics/AnalyticsRouteListener.jsx";
import SmoothScroll from "./Components/ui/SmoothScroll";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

const Home = lazy(() => import("./Pages/Home"));
const About = lazy(() => import("./Pages/About"));
const NotFound = lazy(() => import("./Pages/NotFound"));

function App() {
  return (
    <>
      {import.meta.env.PROD ? <AnalyticsRouteListener /> : null}
      <SmoothScroll />
      <Analytics />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Navigate to="/#work" replace />} />
          <Route path="/contact" element={<Navigate to="/#contact" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
