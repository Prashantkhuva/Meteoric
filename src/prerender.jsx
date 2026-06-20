import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { StaticRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import SmoothScroll from "./Components/ui/SmoothScroll";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Work from "./Pages/Work";
import NotFound from "./Pages/NotFound";

function parseAttrs(str) {
  const props = {};
  const regex = /(\w[\w-]*)="([^"]*)"/g;
  let m;
  while ((m = regex.exec(str)) !== null) {
    props[m[1]] = m[2];
  }
  return props;
}

function parseHelmetElements(str) {
  const elements = [];
  const regex = /<(meta|link|script)\s+([^>]*)\/?>/g;
  let match;
  while ((match = regex.exec(str)) !== null) {
    elements.push({ type: match[1], props: parseAttrs(match[2]) });
  }
  return elements;
}

export function prerender(data) {
  const helmetContext = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={data.url}>
        <SmoothScroll />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route
              path="/projects"
              element={<Navigate to="/work" replace />}
            />
            <Route
              path="/contact"
              element={<Navigate to="/#contact" replace />}
            />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </StaticRouter>
    </HelmetProvider>,
  );

  const { helmet } = helmetContext;
  const elements = new Set();

  if (helmet) {
    for (const el of parseHelmetElements(helmet.meta.toString())) {
      elements.add(el);
    }
    for (const el of parseHelmetElements(helmet.link.toString())) {
      elements.add(el);
    }
    for (const el of parseHelmetElements(helmet.script.toString())) {
      elements.add(el);
    }
  }

  return {
    html,
    head: {
      lang: "en",
      title: helmet
        ? helmet.title.toString().replace(/<\/?title>/g, "")
        : "Meteoric",
      elements,
    },
  };
}
