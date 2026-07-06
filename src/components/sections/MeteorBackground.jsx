import { useEffect, useRef } from "react";

function MeteorBackground({ showBrand = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = 0;
    let height = 0;
    let stars = [];
    let meteors = [];
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 },
    );
    if (canvas) observer.observe(canvas);

    const starCount = 180;
    const meteorCount = 12;

    const random = (min, max) => Math.random() * (max - min) + min;

    const createStar = () => ({
      x: random(0, width),
      y: random(0, height),
      radius: random(0.4, 1.45),
      alpha: random(0.2, 0.9),
      twinkleSpeed: random(0.0025, 0.008),
      twinkleOffset: random(0, Math.PI * 2),
    });

    const createMeteor = () => {
      const fromTop = Math.random() > 0.45;
      const size = random(1.7, 3.8);
      const speed = random(2.6, 5.2);
      const trailLength = random(120, 270);

      return {
        x: fromTop ? random(-width * 0.2, width * 0.95) : random(-width * 0.35, -40),
        y: fromTop ? random(-height * 0.25, -30) : random(-height * 0.05, height * 0.55),
        size,
        speed,
        trailLength,
        alpha: random(0.55, 1),
      };
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: starCount }, createStar);
      meteors = Array.from({ length: meteorCount }, createMeteor);
    };

    const drawStars = (time) => {
      stars.forEach((star) => {
        const twinkle =
          star.alpha +
          Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.35;
        const opacity = Math.max(0.08, Math.min(1, twinkle));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });
    };

    const drawMeteor = (meteor) => {
      const angle = Math.PI / 4;
      const tailX = meteor.x - Math.cos(angle) * meteor.trailLength;
      const tailY = meteor.y - Math.sin(angle) * meteor.trailLength;

      const trailGradient = ctx.createLinearGradient(
        tailX,
        tailY,
        meteor.x,
        meteor.y
      );
      trailGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      trailGradient.addColorStop(0.35, `rgba(160, 190, 255, ${meteor.alpha * 0.18})`);
      trailGradient.addColorStop(1, `rgba(255, 255, 255, ${meteor.alpha * 0.86})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(meteor.x, meteor.y);
      ctx.lineWidth = meteor.size;
      ctx.lineCap = "round";
      ctx.strokeStyle = trailGradient;
      ctx.stroke();

      const headGradient = ctx.createRadialGradient(
        meteor.x,
        meteor.y,
        0,
        meteor.x,
        meteor.y,
        meteor.size * 5.5
      );
      headGradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.alpha})`);
      headGradient.addColorStop(0.35, `rgba(190, 210, 255, ${meteor.alpha * 0.45})`);
      headGradient.addColorStop(1, "rgba(190, 210, 255, 0)");

      ctx.beginPath();
      ctx.arc(meteor.x, meteor.y, meteor.size * 5.5, 0, Math.PI * 2);
      ctx.fillStyle = headGradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
      ctx.fill();
    };

    const animate = (time) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      drawStars(time);

      meteors.forEach((meteor, index) => {
        meteor.x += meteor.speed;
        meteor.y += meteor.speed;

        if (
          meteor.x - meteor.trailLength > width + 80 ||
          meteor.y - meteor.trailLength > height + 80
        ) {
          meteors[index] = createMeteor();
        } else {
          drawMeteor(meteor);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const paintStatic = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);
      drawStars(0);
    };

    const onResize = () => {
      resizeCanvas();
      if (prefersReduced) {
        paintStatic();
      }
    };

    resizeCanvas();

    if (prefersReduced) {
      paintStatic();
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }

    const startAnimation = () => {
      animationFrameId = requestAnimationFrame(animate);
    };

    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(startAnimation, { timeout: 500 });
    } else {
      setTimeout(startAnimation, 200);
    }

    window.addEventListener("resize", resizeCanvas);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      observer.disconnect();
    };
  }, []);

  return (
    <section style={styles.section} aria-label="Meteoric hero">
      <canvas ref={canvasRef} style={styles.canvas} />
      {showBrand && (
        <div style={styles.brand}>
          <div style={styles.title}>Meteoric</div>
          <p style={styles.tagline}>Software Agency</p>
        </div>
      )}
    </section>
  );
}

const styles = {
  section: {
    position: "relative",
    width: "100%",
    height: "100vh",
    minHeight: "100vh",
    overflow: "hidden",
    background: "#000000",
  },
  canvas: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    display: "block",
    filter: "blur(0.7px)",
  },
  brand: {
    position: "absolute",
    left: "50%",
    bottom: "48px",
    transform: "translateX(-50%)",
    zIndex: 1,
    width: "min(90vw, 640px)",
    textAlign: "center",
    pointerEvents: "none",
  },
  title: {
    margin: 0,
    color: "#fff",
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
    fontSize: "clamp(48px, 9vw, 118px)",
    fontWeight: 700,
    lineHeight: 0.9,
    letterSpacing: 0,
  },
  tagline: {
    margin: "18px 0 0",
    color: "#9A9A9A",
    fontFamily:
      "var(--font-inter), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: 1.4,
    letterSpacing: "0.34em",
    textTransform: "uppercase",
  },
};

export default MeteorBackground;
