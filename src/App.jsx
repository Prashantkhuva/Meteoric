import "./App.css";
import SmoothScroll from "./Components/ui/SmoothScroll";
import Home from "./Pages/Home";
import About from "./Pages/About";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <SmoothScroll />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/projects"
          element={<Home seoKey="projects" scrollTargetId="work" />}
        />
        <Route
          path="/contact"
          element={<Home seoKey="contact" scrollTargetId="contact" />}
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
