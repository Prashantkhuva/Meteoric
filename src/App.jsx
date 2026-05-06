import "./App.css";
import SmoothScroll from "./Components/ui/SmoothScroll";
import Home from "./Pages/Home";
import { useEffect } from "react";
import Lenis from "lenis";

function App() {
  return (
    <>
      <SmoothScroll />
      <Home />
    </>
  );
}

export default App;
