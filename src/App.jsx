import "./App.css";
import { AnalyticsRouteListener } from "./analytics/AnalyticsRouteListener.jsx";
import SmoothScroll from "./Components/ui/SmoothScroll";
import Home from "./Pages/Home";
import About from "./Pages/About";
import { Navigate, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      {import.meta.env.PROD ? <AnalyticsRouteListener /> : null}
      <SmoothScroll />
      <Analytics />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Navigate to="/#work" replace />} />
        <Route path="/contact" element={<Navigate to="/#contact" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
