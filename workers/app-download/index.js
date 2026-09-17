export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const manifestUrl = `${env.SUPABASE_URL}/storage/v1/object/public/app-releases/latest.json`;

    let manifest;
    try {
      const res = await fetch(manifestUrl);
      if (!res.ok) {
        return new Response("Update manifest unavailable", { status: 502 });
      }
      manifest = await res.json();
    } catch {
      return new Response("Failed to fetch update manifest", { status: 502 });
    }

    const { url: apkUrl, version, build } = manifest;
    if (!apkUrl) {
      return new Response("No download available", { status: 404 });
    }

    // /download — proxy the APK with proper headers
    if (url.pathname === "/download") {
      const apkRes = await fetch(apkUrl);
      if (!apkRes.ok) {
        return new Response("Failed to fetch APK", { status: 502 });
      }
      return new Response(apkRes.body, {
        headers: {
          "Content-Type": "application/vnd.android.package-archive",
          "Content-Disposition": `attachment; filename="Meteoric Admin ${version}.apk"`,
          "Content-Length": apkRes.headers.get("Content-Length") || "",
        },
      });
    }

    // / — landing page
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meteoric Admin</title>
  <link rel="icon" type="image/svg+xml" href="https://withmeteoric.com/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #070707;
      color: rgba(255,255,255,0.85);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      overflow: hidden;
    }

    /* Subtle background glow */
    body::before {
      content: '';
      position: fixed;
      top: -40%;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(234,239,255,0.04) 0%, transparent 70%);
      pointer-events: none;
    }

    .card {
      background: #0a0a0a;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 20px;
      padding: 56px 44px 48px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      position: relative;
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .logo-wrap {
      width: 72px;
      height: 72px;
      margin: 0 auto 28px;
      background: #ffffff;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(234,239,255,0.12);
    }

    .logo-wrap svg {
      width: 40px;
      height: 40px;
    }

    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
      letter-spacing: -0.3px;
    }

    .subtitle {
      font-size: 14px;
      color: rgba(255,255,255,0.4);
      margin-bottom: 32px;
      font-weight: 400;
    }

    .version-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(234,239,255,0.06);
      border: 1px solid rgba(234,239,255,0.08);
      border-radius: 8px;
      padding: 6px 14px;
      margin-bottom: 28px;
      font-size: 13px;
      color: rgba(255,255,255,0.5);
      font-weight: 500;
    }

    .version-badge .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22c55e;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .download-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: #EAEFFF;
      color: #070707;
      font-weight: 600;
      font-size: 15px;
      padding: 15px 36px;
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.2s ease;
      width: 100%;
      margin-bottom: 28px;
      letter-spacing: -0.1px;
    }

    .download-btn:hover {
      background: #d5dcff;
      transform: translateY(-1px);
      box-shadow: 0 6px 24px rgba(234,239,255,0.15);
    }

    .download-btn:active {
      transform: translateY(0);
    }

    .download-btn svg {
      width: 18px;
      height: 18px;
    }

    .divider {
      height: 1px;
      background: rgba(255,255,255,0.06);
      margin: 0 -44px 24px;
    }

    .note {
      font-size: 12.5px;
      color: rgba(255,255,255,0.35);
      line-height: 1.7;
      padding: 0 8px;
    }

    .note strong {
      color: rgba(255,255,255,0.55);
      font-weight: 500;
    }

    .footer {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 11px;
      color: rgba(255,255,255,0.2);
      letter-spacing: 0.5px;
    }

    .footer a {
      color: rgba(234,239,255,0.4);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer a:hover {
      color: rgba(234,239,255,0.7);
    }
  </style>
</head>
<body>
  <div>
    <div class="card">
      <div class="logo-wrap">
        <img src="https://withmeteoric.com/m.png" alt="Meteoric" width="40" height="40" style="width:40px;height:40px;object-fit:contain;">
      </div>
      <h1>Meteoric Admin</h1>
      <p class="subtitle">Management dashboard for your team</p>
      <div class="version-badge">
        <span class="dot"></span>
        v${version || "latest"}${build ? " (build " + build + ")" : ""}
      </div>
      <a href="/download" class="download-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download APK
      </a>
      <div class="divider"></div>
      <p class="note">
        <strong>Android only.</strong> Your browser may show a security warning
        for apps installed outside the Play Store — tap
        <strong>"Download anyway"</strong> to proceed.
      </p>
    </div>
    <div class="footer">
      <a href="https://withmeteoric.com" target="_blank">withmeteoric.com</a>
    </div>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  },
};
