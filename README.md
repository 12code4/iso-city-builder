# Isometric City Builder

A browser-based isometric city builder — true 3D on an orthographic camera locked
to isometric angles, built with [Three.js](https://threejs.org/). Place roads and
buildings on a grid, connect them to the highway, and watch a living little city
grow: residents arrive by moving truck, commute to work, run errands, relax in
parks, and grumble when the town is missing something.

Everything lives in a single self-contained `index.html` (no build step).

**Current version: v0.5 "Charm & Critters"** — placement + growth (v0.1), a full
citizen simulation with pathfinding walkers and cars (v0.2), an observability
layer for watching individual citizens live their day (v0.3), a cozy-pastel
visual overhaul with deep zoom and a day/night cycle (v0.4), and an ambient charm
layer — cats, butterflies, little shared moments — plus a scripted-events engine
(v0.5).

## Running it

No build, no install. Because the page loads Three.js from a CDN, it needs an
internet connection the first time.

- **Simplest:** open `index.html` in a modern browser.
- **If your browser blocks ES-module imports over `file://`,** serve the folder:
  ```bash
  python3 -m http.server 8000
  # then visit http://localhost:8000/index.html
  ```

Desktop and mobile touch are both supported.

## Controls

| Action | Desktop | Mobile |
| --- | --- | --- |
| Place / bulldoze | click with a tool selected | tap |
| Inspect a citizen or building | 🔍 tool, then click | 🔍 tool, then tap |
| Pan | WASD / arrows, or drag | one-finger drag |
| Rotate (4 iso angles) | Q / E, or the ⟲ ⟳ buttons | on-screen buttons |
| Zoom | mouse wheel | pinch |

Toolbar: **Road · House · Shop · Park · Clear · Inspect**. Roads must connect to
the pre-placed highway stub; houses only grow and only receive residents when
they have a connected road, so build streets first.

## What's built

- **Placement & growth** — 20×20 grid, ghost preview, bulldoze, pop-in animation;
  houses upgrade to level 2 when served by a connected road.
- **The highway** — a fixed edge stub that anchors the map and is the city's
  import artery: every new resident drives in from it.
- **Citizen simulation** — each resident is an agent with energy/work/errands/fun
  meters and a strict three-state machine (sleep / work / free-time), meter-driven
  with no global clock, so the city never falls into synchronized "rush hours."
  Citizens path over the road network as walkers or cars (mode chosen by distance
  and car availability).
- **Migration** — houses don't spawn residents instantly; a **moving truck** drives
  in from the highway, drops off 1–3 new residents, and leaves. Unreachable houses
  stay empty until you connect them.
- **Inspectors** — tap any walker or building for a live card: a citizen's name,
  what they're doing, their meters, and home/job; a building's residents, workers,
  or current visitors.
- **Follow camera** — track a single citizen through their whole day.
- **Bubbles** — citizens show thought bubbles at decision points, and *complaint*
  bubbles when a need is starved and there's no venue for it — the city telling you
  what to build next.

## Project structure & documentation

Everything is one HTML file; the documentation is split by purpose:

| File | What it is |
| --- | --- |
| [`index.html`](index.html) | The entire game — CONFIG, world state, sim, and renderer in one module. |
| [`CLAUDE.md`](CLAUDE.md) | **Stable architecture reference** — locked decisions, the world model, and the systems (citizens, migration, inspectors, bubbles). Read this first to understand how it works. |
| [`roadmap.md`](roadmap.md) | **Designed-ahead features** — the pillars planned for v0.4+ (economy, traffic, density, new needs) and the rules every feature must pass. |
| [`plan.md`](plan.md) | **Session-by-session dev log** — what was built when, test results, and tuning notes. |

All game tuning lives in a single `CONFIG` object at the top of `index.html` — grid
size, colors, camera, growth timers, and every citizen/migration/bubble rate.

## Roadmap (short version)

- **v0.2 — Citizens** ✅ sim core, walkers & cars, migration, scale-tested.
- **v0.3 — Alive** ✅ names, inspectors, follow camera, thought & complaint bubbles.
- **v0.4 — Look & Life** ✅ cozy-pastel art, deep zoom, day/night cycle, living map.
- **v0.5 — Charm & Critters** ✅ cats, butterflies, citizen quirks, shared 💕
  moments, a shooting star, and the scripted-events engine.
- **v0.6 — Something's Off** (next) — the town is lovely. Mostly.

See [`roadmap.md`](roadmap.md) for the full designs and sequencing.

## Tech notes

- Three.js (ES-module build) with an orthographic camera; depth sorting comes free
  from the z-buffer. Flat-colored geometry, soft shadows, warm palette — no textures.
- Meshes are a **projection** of the world/citizen state, never the source of truth.
- Pointer events (one input path for mouse and touch); no external assets besides
  the Three.js module.
