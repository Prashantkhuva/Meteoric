# Maintenance Mode — Revert Guide

**Created:** 2026-09-17
**Purpose:** Show maintenance page to public visitors while keeping admin/API accessible.

## What was added

### 1. `proxy.js` — lines 59-86 (maintenance redirect block)
```js
// 4. Maintenance mode — redirect all public routes to /maintenance
//    Admin, API, and static assets remain accessible so you can disable it
if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true") {
  const isMaintenancePage = pn === "/maintenance";
  const isApiOrStatic =
    pn.startsWith("/api") ||
    pn.startsWith("/_next") ||
    pn.startsWith("/admin") ||
    pn.startsWith("/login") ||
    pn.startsWith("/editor") ||
    pn.startsWith("/preview") ||
    pn.startsWith("/share") ||
    pn === "/favicon.svg" ||
    pn === "/og.jpg" ||
    pn === "/apple-touch-icon.png" ||
    pn === "/site.webmanifest" ||
    pn === "/robots.txt" ||
    pn === "/sitemap.xml" ||
    pn === "/llms.txt" ||
    pn === "/llms-full.txt" ||
    pn === "/feed.xml";

  if (!isMaintenancePage && !isApiOrStatic) {
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = "/maintenance";
    return NextResponse.redirect(maintenanceUrl);
  }
}
```

### 2. `app/maintenance/page.jsx` — new file
Full maintenance info page with Meteoric branding.

### 3. `.env` — added toggle
```
NEXT_PUBLIC_MAINTENANCE_MODE=true
```

---

## How to disable (quick)

Set the env var to `false` or remove it:
```bash
NEXT_PUBLIC_MAINTENANCE_MODE=false
```
Then redeploy.

## How to fully revert

### Option A: Keep code, just disable
Set `NEXT_PUBLIC_MAINTENANCE_MODE=false` in `.env` and redeploy. The redirect block stays dormant.

### Option B: Remove everything

**1. Delete `app/maintenance/page.jsx`**

**2. Remove lines 59-86 from `proxy.js`** (the entire `// 4. Maintenance mode` block)

**3. Remove from `.env`:**
```
NEXT_PUBLIC_MAINTENANCE_MODE=true
```

**4. Commit and deploy.**

---

## Routes protected during maintenance
| Route | Accessible? |
|-------|------------|
| `/maintenance` | Yes (the page itself) |
| `/admin/*` | Yes (so you can disable) |
| `/login` | Yes |
| `/api/*` | Yes |
| `/_next/*` | Yes (static assets) |
| `/editor` | Yes |
| `/preview/*` | Yes |
| `/share/*` | Yes |
| Everything else | Redirects to `/maintenance` |
