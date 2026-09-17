# Atomik Growth Audit → Meteoric Redesign Plan

## 1. Atomik Growth Design System (Extracted)

### Colors — Pure Monochrome, ZERO Accent Color
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#fcfcfc` | Page background (near-white) |
| `--bg-surface` | `#f2f2f2` | Card surfaces, input backgrounds |
| `--text-primary` | `#000000` | Headings, body text |
| `--text-muted` | `#666666` | Secondary text, labels |
| `--border-color` | `rgba(0,0,0,0.12)` | Very subtle borders |
| `--card-bg` | `#ffffff` | Card backgrounds |
| `--btn-primary-bg` | `#000000` | CTA buttons — BLACK fill |
| `--btn-primary-text` | `#ffffff` | White text on CTA |
| `--btn-primary-hover` | `#333333` | Hover state |
| `--nav-bg` | `rgba(252,252,252,0.9)` | Floating pill nav |

**Key insight: NO gold, NO colored accent anywhere. Pure black & white only.**

### Typography
| Element | Font | Size | Weight | Notes |
|---------|------|------|--------|-------|
| H1 (hero) | Switzer | 38px | 600 | Tight letter-spacing (-0.76px) |
| H2 (section) | Switzer | 36px | 600 | Letter-spacing 0.36px |
| H3 (service) | Switzer | 28px | 600 | |
| Nav links | Inter | 13px | 500 | |
| Body | Inter | 16px | 400 | |
| Labels/tags | Inter | 13px | 500 | |
| CTA button | Inter | 13px | 600 | |
| Hero subtitle | Inter | 18px | 400 | |

### Buttons
- **Primary CTA**: `bg: #000, color: #fff, radius: pill, padding: 8px 16px`
- **Secondary**: `bg: transparent, border: 1px solid rgba(255,255,255,0.2), color: #fff, pill`
- **Text link**: Black text with `>` arrow, no underline
- **Nav CTA "Book a call"**: `bg: #f2f2f2, color: #000, radius: pill, padding: 8px 16px`
- NO filled-accent buttons, NO colored hover states anywhere

### Layout Patterns
- Max-width ~1200px centered
- Generous vertical padding (80-120px per section)
- Cards: 12-16px border-radius, white bg on light gray
- Contact form: white inputs, `border: 1px solid #c9c9c9`, `border-radius: 10px`
- Footer: dark (#06101a), large wordmark, 3-column link grid

### Navigation
- Pill-shaped floating nav, centered
- Background: `rgba(252,252,252,0.9)` with backdrop blur
- Border: `1px solid rgba(0,0,0,0.06)`
- Logo left, links center, CTA right

### Homepage Sections (in order)
1. **Hero**: Dark bg, AI abstract image (light streaks + spacecraft), white text, 2 CTAs
2. **Logo bar**: Client logos in clean grid with dashed borders
3. **Distribution tagline**: Short text section
4. **Services grid**: 3 cards with AI images (spacecraft, astronaut), stats, "Learn more" links
5. **Stats section**: Dark bg, Earth-from-space background, big numbers (9.6%, 2B+, 5.5M+)
6. **Case studies**: 2 large cards with AI-generated scenes, metrics overlays
7. **Testimonials**: Video embeds in white cards
8. **FAQ section**: Accordion on white bg
9. **CTA section**: Dark bg, Earth/spacecraft image, "Book a call" white outline button
10. **Footer**: Dark, massive wordmark, 3-column links, social icons

---

## 2. Current Meteoric Design (Problems)

### Problem 1: Gold accent (#d4b46e) used EVERYWHERE
- Buttons are gold fill
- Selection highlight is gold
- Focus outlines are gold
- Card hover effects reference gold
- Atomik has ZERO accent color — pure B&W

### Problem 2: Zero AI-generated images
- Atomik has 8+ high-quality AI images (spacecraft, astronauts, Earth, abstract light)
- Meteoric has: particle effect, lucide icons, no photography/renders

### Problem 3: Typography/layout differences
- Hero text is centered (Atomik: left-aligned)
- Service cards use lucide icons (Atomik: AI images)
- No stats section (was removed)
- CTA section lacks visual impact

### Current CSS Tokens vs Atomik
| Current Meteoric | Atomik | Issue |
|-----------------|--------|-------|
| `--accent: #d4b46e` | N/A | **REMOVE** — no accent in Atomik |
| `--accent-dim` | N/A | **REMOVE** |
| `--accent-glow` | N/A | **REMOVE** |
| `--accent-text: #050505` | N/A | **REMOVE** |
| `--selection-bg: #d4b46e` | `#000` | Change to black |
| `--bg-primary: #050505` | `#fcfcfc` | Keep dark (our choice) |

---

## 3. Redesign Plan

### Phase 1: Remove Gold (CSS + all components)
**File: `src/index.css`**
- `--accent: #d4b46e` → `--accent: #ffffff`
- Remove `--accent-dim`, `--accent-glow`, `--accent-text`
- `--selection-bg: #d4b46e` → `--selection-bg: #000000`
- `--selection-text: #050505` → `--selection-text: #ffffff`
- `.flip-btn` background: gold → black (#000)
- `.flip-btn` color: dark → white
- `:focus-visible` outline: gold → white

**All components**: Replace `var(--accent)` with `#ffffff` or `var(--text-primary)` where appropriate

### Phase 2: Hero Redesign
**File: `src/components/sections/Hero.jsx`**
- Replace `<MeteorBackground>` particle effect with `<img>` using `hero-bg.webp`
- Left-align text (not centered)
- 2 CTAs: "Book a call" (white outline pill) + "See Our Work" (text + arrow)
- Right side: descriptive paragraph like Atomik's subtitle

### Phase 3: Services Redesign
**File: `src/components/sections/ServicesSection.jsx`**
- Replace lucide icons (Smartphone, Monitor, Code2, Layers) with AI images
- Each card: image on top, text below
- Add metrics/stats per card
- "Learn more >" link pattern instead of tag badges

### Phase 4: Add Stats Section Back
**File: `src/components/sections/StatsBar.jsx`** (already exists, re-enable in Home.jsx)
- Dark bg with Earth-from-space image (`stats-bg.webp`)
- 3 columns: big number + label
- Example: "50+" Projects | "100%" Satisfaction | "24/7" Support

### Phase 5: Case Studies / Projects
**File: `src/components/sections/Projects.jsx`**
- Refactor to case study card pattern
- Large image cards with text overlay
- Metrics displayed below each card

### Phase 6: CTA Section
**File: `src/components/sections/LeadCaptureSection.jsx`**
- Dark bg with spacecraft image (`cta-bg.webp`)
- White outline "Book a call" button
- Clean minimal text

### Phase 7: Navbar CTA
**File: `src/components/layout/Navbar.jsx`**
- Change CTA from gold fill to gray pill (bg: `#f2f2f2`, color: `#000`)
- Keep pill-shaped nav layout (already similar)

### Phase 8: Footer
**File: `src/components/layout/Footer.jsx`**
- Add 3-column link layout (Services / Company / Legal)
- Keep dark bg and large wordmark (already has this)

---

## 4. AI Image Prompts (Ready to Generate)

### Image 1: Hero Background
**Filename:** `public/images/hero-bg.webp`
**Dimensions:** 1920x1080 (16:9)
**Prompt:**
> Dark abstract background with flowing white and light gray light streaks radiating outward from center, resembling fiber optic strands or warp speed effect, deep pure black background, subtle cool white tones, ultra high quality 4K cinematic, no text, no objects, abstract energy flow pattern, dark moody atmosphere, suitable for website hero section background

### Image 2: Service - Web Development
**Filename:** `public/images/service-web.webp`
**Dimensions:** 800x600 (4:3)
**Prompt:**
> 3D rendered dark matte rocket spaceship floating in deep space, minimalist design, black and charcoal color scheme, subtle white rim lighting from left, deep black background with faint distant stars, clean modern product shot aesthetic, no text, octane render quality, suitable for website service card

### Image 3: Service - SaaS Platform
**Filename:** `public/images/service-saas.webp`
**Dimensions:** 800x600 (4:3)
**Prompt:**
> Abstract 3D visualization of interconnected glowing white nodes and flowing data streams on pure black background, representing cloud software architecture, clean minimalist style, white and light gray tones, futuristic tech aesthetic, no text, abstract network constellation pattern, suitable for website service card

### Image 4: Service - Mobile Apps
**Filename:** `public/images/service-mobile.webp`
**Dimensions:** 800x600 (4:3)
**Prompt:**
> Lone astronaut in white spacesuit sitting in modern minimalist black chair, using a glowing tablet device, dark space station interior with large window showing stars, soft ambient lighting, black white and gray color palette, clean composition, cinematic film quality, no text, suitable for website service card

### Image 5: Stats Section Background
**Filename:** `public/images/stats-bg.webp`
**Dimensions:** 2560x1080 (21:9 ultrawide)
**Prompt:**
> Planet Earth seen from low orbit at night side, city lights visible on continents, thin blue-white atmosphere glow on curved horizon, deep black space above with faint stars, photorealistic NASA quality, wide panoramic composition, cinematic, no text, ultra high resolution, suitable for website dark section background

### Image 6: CTA Section Background
**Filename:** `public/images/cta-bg.webp`
**Dimensions:** 2560x1080 (21:9 ultrawide)
**Prompt:**
> Sleek dark spacecraft or space station module orbiting above a planet surface, dramatic underlighting from the planet below, black and white color scheme with subtle warm edge light, cinematic wide composition, deep space background, clean modern aesthetic, no text, suitable for website call-to-action section background

---

## 5. File Change Summary

| File | Change |
|------|--------|
| `src/index.css` | Remove gold tokens, monochrome system |
| `src/components/sections/Hero.jsx` | Hero image, left-align, 2 CTAs |
| `src/components/sections/ServicesSection.jsx` | Replace icons with AI images |
| `src/components/sections/Projects.jsx` | Case study cards with images |
| `src/components/sections/StatsBar.jsx` | Re-enable, add Earth image |
| `src/components/sections/LeadCaptureSection.jsx` | Dark CTA with spacecraft image |
| `src/components/layout/Navbar.jsx` | CTA: gold fill → gray pill |
| `src/components/layout/Footer.jsx` | 3-column link layout |
| `src/components/pages/Home.jsx` | Re-enable StatsBar, reorder sections |
| `public/images/*.webp` | 6 new AI-generated images |
