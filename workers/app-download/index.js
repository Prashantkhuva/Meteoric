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

    const { url: apkUrl, version, notes } = manifest;
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
  <title>Meteoric Admin App</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #070707;
      color: rgba(255,255,255,0.85);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #0a0a0a;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px;
      padding: 48px 40px;
      max-width: 400px;
      width: 100%;
      text-align: center;
    }
    .logo {
      width: 64px;
      height: 64px;
      margin: 0 auto 24px;
      background: linear-gradient(135deg, #EAEFFF 0%, #a8b4ff 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
      color: #070707;
    }
    h1 { font-size: 22px; font-weight: 600; margin-bottom: 8px; }
    .version { color: rgba(255,255,255,0.5); font-size: 14px; margin-bottom: 24px; }
    .download-btn {
      display: inline-block;
      background: #EAEFFF;
      color: #070707;
      font-weight: 600;
      font-size: 16px;
      padding: 14px 32px;
      border-radius: 10px;
      text-decoration: none;
      transition: opacity 0.2s;
      margin-bottom: 24px;
    }
    .download-btn:hover { opacity: 0.9; }
    .note {
      font-size: 13px;
      color: rgba(255,255,255,0.4);
      line-height: 1.6;
    }
    .note strong { color: rgba(255,255,255,0.6); }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">M</div>
    <h1>Meteoric Admin</h1>
    <p class="version">Version ${version || "latest"}${notes ? " — " + notes : ""}</p>
    <a href="/download" class="download-btn">Download APK</a>
    <p class="note">
      <strong>Android only.</strong> Your browser may show a security warning — this is normal for apps installed outside the Play Store. Tap <strong>"Download anyway"</strong> to proceed.
    </p>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  },
};
