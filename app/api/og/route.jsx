import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Meteoric";
  const description = searchParams.get("description") || "";
  const type = searchParams.get("type") || "default";

  const [interRegular, interBold] = await Promise.all([
    fetch(
      "https://fonts.googleapis.com/css2?family=Inter:wght@400&text=METEORIC0123456789.%2F%2C%3A%26%27%3B!%3F-%20"
    ).then((r) => r.arrayBuffer()),
    fetch(
      "https://fonts.googleapis.com/css2?family=Inter:wght@700&text=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.%2F%2C%3A%26%27%3B!%3F-%20"
    ).then((r) => r.arrayBuffer()),
  ]).catch(() => [null, null]);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1635,
          height: 962,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#070707",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gradient glow */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 800,
            height: 800,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(234,239,255,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -300,
            left: -200,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "56px 72px 0",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
            <path d="M50 8L78 30L70 68L30 68L22 30L50 8Z" fill="#EAEFFF" />
            <circle cx="50" cy="50" r="16" fill="#070707" />
          </svg>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 20, letterSpacing: "0.3em" }}>
            METEORIC
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 72px",
            maxWidth: "1200px",
          }}
        >
          <span
            style={{
              color: "rgba(234,239,255,0.5)",
              fontSize: 18,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            {type === "service" ? "Service" : type === "work" ? "Case Study" : type === "about" ? "About" : type === "booking" ? "Free Consultation" : type === "legal" ? "" : "Web Development Agency"}
          </span>
          <h1
            style={{
              color: "rgba(255,255,255,0.95)",
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              margin: 0,
              padding: 0,
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 24,
                lineHeight: 1.5,
                marginTop: 20,
                margin: 0,
                padding: 0,
              }}
            >
              {description.slice(0, 120)}
            </p>
          )}
        </div>

        {/* Footer line */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            padding: "0 72px 48px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "rgba(255,255,255,0.2)",
              fontSize: 16,
              letterSpacing: "0.05em",
            }}
          >
            <span>withmeteoric.com</span>
          </div>
          <div
            style={{
              width: 80,
              height: 2,
              background: "linear-gradient(90deg, rgba(234,239,255,0.3), transparent)",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1635,
      height: 962,
      fonts: interRegular && interBold
        ? [
            { name: "Inter", data: interRegular, weight: 400, style: "normal" },
            { name: "Inter", data: interBold, weight: 700, style: "normal" },
          ]
        : undefined,
    }
  );
}
