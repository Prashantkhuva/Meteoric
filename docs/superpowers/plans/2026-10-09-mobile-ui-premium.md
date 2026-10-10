# Mobile UI Premium Upgrade — Implementation Plan

**Date:** 2026-10-09
**Status:** Approved (design A — evolve existing brand)
**Ship:** Shorebird patches per phase (Dart-only, no native changes)

## Goal

Upgrade Flutter admin app aesthetics to Linear/Raycast-tier polish while keeping the Meteoric brand (`#070707` canvas, `#EAEFFF` accent, Inter). Snappy 100–200ms motion, luminance-stacked elevation, typographic craft, unified components.

## Design pillars

1. **Typography** — bundle Inter Variable TTFs (local assets, no runtime fetch); `ss03`/`cv01` font features; tabular figures on KPI/money/date values; weight-510 emphasis style.
2. **Motion** — page transitions 180ms fade+slide via `animations` package (already dep); tab content opacity fade; staggered list entrance via `flutter_animate` (30ms stagger, cap 8); press scale 0.98 + surface lift; sheets/dialogs 200ms scale-in; nothing bouncy.
3. **Elevation** — luminance stacking: kill black shadows; inset highlight borders (top white@6%, bottom black@30%); surface ladder bg `#070707` → card `#0A0A0A` → raised `#121212` → overlay `#1A1A1A`.
4. **Components** — unified StatusPill, exact-height skeletons, polished empty states (accent-10% icon circle), blurred bottom nav + active dot indicator, glow FAB, toast polish.

## Files (core)

| File | Change |
|---|---|
| `mobile/assets/fonts/InterVariable.ttf` | new asset |
| `mobile/pubspec.yaml` | font asset registration |
| `mobile/lib/core/theme.dart` | motion constants, AppMotion page transitions, surface ladder, elevation helpers, tabular text style, Inter font features |
| `mobile/lib/shared/widgets/common.dart` | Pressable wrapper, StatusPill, EmptyState polish, FAB helper |
| `mobile/lib/shared/widgets/skeleton.dart` | exact-height shimmer polish |
| `mobile/lib/features/home/home_shell.dart` | nav blur/hairline, tab fade, active indicator |
| List screens (leads/proposals/invoices/clients/projects/bookings) | stagger entrance on first load |
| Detail/form screens | scale-in dialogs/sheets (theme-level), press polish |

## Phases

1. **Foundation** — fonts + theme + transitions + elevation (global lift).
2. **Lists + shell** — stagger, pills, nav, press states, skeletons, FABs.
3. **Details + forms** — dialogs/sheets scale-in, empty states, finishing pass.

Ship patch after each phase. Verify with `flutter analyze` + visual check on emulator.

## Out of scope

- Web admin restyle (separate task).
- Light mode.
- New packages (none beyond existing `flutter_animate` + `animations`).
