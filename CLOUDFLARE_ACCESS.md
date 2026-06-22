# Cloudflare Access — Admin Panel Protection

Protects `/admin/*` routes by requiring identity verification (Google, GitHub, email OTP, etc.) before requests reach your server. Unauthenticated requests never touch your app. Works from any device, any network, with MFA.

## Setup

### 1. Route your domain through Cloudflare

- Sign up at https://dash.cloudflare.com
- Add your domain (`withmeteoric.vercel.app` or your custom domain)
- Change your domain's nameservers to Cloudflare's (provided during setup)
- Wait for DNS to propagate (minutes to hours)

### 2. Create a Zero Trust organization

- Go to **Cloudflare Dashboard → Zero Trust**
- Set up your team name (e.g., `meteoric`)
- Choose a free plan (up to 50 users)

### 3. Create an Access policy for admin routes

- In Zero Trust, go to **Access → Applications → Add an application**
- Select **Self-hosted**
- **Application domain**: `withmeteoric.vercel.app`
- **Path**: `/admin*`
- **Session duration**: 24h (or your preference)

**Policies tab:**
- **Policy name**: `Admin access`
- **Action**: `Allow`
- **Include**: Select your identity provider (Google, GitHub, email OTP — any combination)
  - Email OTP is simplest — just enter your email
  - Or use Google/GitHub login
- **Optional — Require**: Add MFA if your IdP supports it

### 4. (Optional but recommended) Verify JWT in middleware

Requests that pass Cloudflare Access include a `Cf-Access-Jwt-Assertion` header. You can verify this JWT in `proxy.js` for defense-in-depth.

**Generate your JWKS URL:**
- In Zero Trust → **Settings → Authentication → JSON Web Token (JWT)**
- Copy your **JWKS URL**: `https://<team>.cloudflareaccess.com/cdn-cgi/access/certs`

**Set env vars in Vercel:**
```
CF_ACCESS_TEAM=meteoric
CF_ACCESS_AUD=<your-audience-tag>  # found in Zero Trust → Access → Applications → your app → Audience Tag
```

### 5. Deploy

Push changes to Vercel. Cloudflare handles the rest.

## How it works

```
Browser → Cloudflare → [is user authenticated?] → yes → Vercel (Next.js)
                            ↓ no
                     Cloudflare login page
```

- After login, Cloudflare sets a session cookie at the edge
- Subsequent requests include `Cf-Access-Jwt-Assertion` header
- Your `proxy.js` can verify the JWT for extra security
- Combined with Supabase Auth, you get 2-layer security

## Testing

Visit `https://withmeteoric.vercel.app/admin` from an incognito window — you should see Cloudflare's login prompt instead of your app.
