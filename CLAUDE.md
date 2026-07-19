# CLAUDE.md — Isometric City Builder (working title)

Stable architecture reference. Session-by-session notes live in plan.md, not here.
Update this file only when an architectural decision changes.

## Project summary

Browser-based isometric city builder. Three.js (ES module build), true 3D with an
orthographic camera locked to isometric angles. Place buildings on a grid, watch the
city grow. Economy and population systems planned for later versions — v0.1 is
placement and growth only.

Targets: desktop browser + mobile touch. Single HTML file until size forces a split.

## Locked decisions

- **Renderer:** Three.js, orthographic camera. No pixel art, no sprite pipeline.
  Depth sorting comes free from the z-buffer.
- **Art style:** flat-colored box/simple geometries, soft shadows, warm palette.
  Townscaper-adjacent. No textures in v0.1.
- **Grid:** fixed 20×20 tile world in v0.1. Tile size 1 world unit. Grid coords are
  integers (x, z); world position = (x + 0.5, 0, z + 0.5) for tile centers.
- **Camera:** orthographic, 4 fixed isometric yaw angles (45°, 135°, 225°, 315°),
  fixed pitch ~35.26° (true isometric). Rotate steps between the 4 angles with a
  short eased tween. Pinch / scroll wheel adjusts zoom (ortho frustum size), clamped.
  No free orbit — keeps input simple and readability consistent.
- **Camera pan:** the look-at target slides on the ground plane, clamped to map
  bounds. Desktop: WASD/arrows (camera-relative) or mouse drag. Mobile: one-finger
  drag. Drag pan is "grab the ground": the world point under the pointer at drag
  start stays under the pointer. Tap vs pan disambiguated by a movement threshold
  (CONFIG.input.tapMaxMove) — under it on release = tap/place, over it = pan.
- **All tuning lives in CONFIG** — one object at the top of the file: grid size,
  colors, camera angles/zoom clamps, animation durations, growth timers, highway
  layout. No magic numbers in logic code.
- **Scope process:** decide before building. New ideas go to the backlog in plan.md,
  not into the current milestone.

## World model

Single source of truth: `world` — a 2D array `world[x][z]` of tile objects:

```js
{ type: 'empty' | 'highway' | 'road' | 'house' | 'shop' | 'park',
  level: 0,          // growth stage (houses upgrade over time)
  mesh: null,        // reference to the Three.js object on this tile
  fixed: false }     // true = cannot be bulldozed (highway)
```

Rules:
- Meshes are a *projection* of the world array, never the other way around.
  All game logic reads/writes `world`; a single `syncTile(x, z)` function creates,
  swaps, or removes the mesh to match. This is the analogue of Solar Swing's
  shared `shapeFn` principle: one authority, renderer follows.
- No per-frame iteration over all tiles for rendering. Meshes persist; only
  changed tiles re-sync.

## The highway (outside connection)

- The map ships with a pre-placed highway stub: 1 tile wide, extending
  `depth` tiles into the map (2) from the center of one map edge
  (CONFIG.highway.edge, default 'south'). It does NOT cross the map.
- Its outer end sits on the map edge — that edge point is the outside connection.
  Player roads attach at the inner end (or sides).
- **Tile anatomy (locked):** all roads and highway are 1 tile wide.
  Highway tile: 2 traffic lanes, NO pedestrians. Road tile: 2 traffic
  lanes + 2 sidewalks (sidewalks at tile edges, lanes center, right-hand
  traffic). Lane/sidewalk positions are render offsets within the tile
  (approx: lanes at ±0.18 of centerline, sidewalks at ±0.40) — the world
  array stays one tile = one cell.
- Highway tiles are `type: 'highway'`, `fixed: true` — cannot be bulldozed or built
  over. Visually distinct from player roads (darker asphalt, dashed center line and
  shoulder strips made from thin box meshes, oriented along the travel axis).
- Purpose now: anchors the map, gives the first roads something to connect to.
  Purpose later: the economy's import/export artery — traffic, migration, and trade
  enter the city through the stub's edge endpoint. Keep the outer end on the map
  edge so this stays true.
- Player roads may connect to the highway from either side. Connection check:
  4-neighbor adjacency (no diagonals).

## Connectivity

- `isConnected(x, z)`: BFS/flood fill over road + highway tiles from the highway,
  computed on demand when the road network changes (not per frame). Result cached
  in a `connected` boolean per road tile.
- v0.1 use: houses only grow (level up) if adjacent (4-neighbor) to a *connected*
  road. This quietly seeds the later economy: everything flows from the highway.
- **Rule change (v0.2+):** buildings require adjacency to a connected *road*;
  highway tiles no longer count as building frontage (no pedestrian access).
  The highway is purely a connector and entry point.

## Growth system (v0.1)

- On placement: mesh scales up from 0 with a short back-ease pop (duration in CONFIG).
- Houses: after `CONFIG.growth.upgradeSeconds` while adjacent to a connected road,
  level 1 → 2 (taller mesh, new roof color). Timer per tile, checked on a slow tick
  (every ~1s), not per frame.
- Shops and parks don't grow in v0.1.

## Citizens (v0.2)

Design lineage, for the record: statistical illusion over deep AI (SimCity),
needs-decay + building advertisements (The Sims), meter-driven cycles to avoid
synchronized cohorts (Cities: Skylines death waves), and commutes over the
player's road network as visible consequence (Skylines).

### Record

Citizens live in a flat `citizens` array, not in tiles:

```js
{ id, home: [x, z], job: [x, z] | null,
  state: 'sleep' | 'work' | 'free_time',
  phase: 'traveling' | 'doing',
  meters: { energy, work, errands, fun },  // 0..100
  rates: { ... },                     // per-citizen ±10% jitter on decay/fill
  mode: 'walk' | 'drive',             // locked per excursion at home departure
  path: [], pathT: 0,                 // current route + progress
  stayUntil, activity }               // minStay commitment while doing
```

### State machine — exactly three states, meter-driven

No global clock. Transitions are meter thresholds only:
- `work` meter empty → state work (travel to job, fill meter while doing)
- work meter full → `free_time`: score nearby building advertisements,
  travel to the winner, satisfy that need
- `energy` low → `sleep` (travel home, doing = energy refills)
- energy full → wake; work has decayed → cycle repeats

Commuting is NOT a fourth state: every state carries an internal
`traveling → doing` phase. Keep it this way.

Desync strategy: citizens spawn when houses are placed/upgrade (natural
stagger), plus per-citizen rate jitter so same-burst cohorts drift apart.
Never add a shared schedule ("everyone works at 8") — that reintroduces
thundering herds.

### Advertisements (extensibility rule)

Buildings advertise `{ need, fillRate, minStay }` — data on building
definitions in CONFIG, e.g. shop → `{ errands, fillRate: 4/s, minStay: 15s }`,
park → `{ fun, fillRate: 3/s, minStay: 8s }`. Adding future building types
must require zero new citizen logic — if a feature idea needs a new citizen
state or special-case branch, redesign it as an advertisement instead.

### Free-time decision procedure (locked)

Runs on the decision tick, only when the citizen is in free_time and past
the current location's `minStay`:

1. **Flood once:** BFS from the citizen's current road tile writes road
   distance to every tile (a Dijkstra map). One flood answers all
   candidates' distances AND provides the path (walk downhill through the
   field). Never pathfind per-candidate.
2. **Score every reachable advertiser:**
   `score = fillAmount × urgency × proximity`
   - `urgency = (100 - meters[need]) / 100` — lowest meters dominate
   - `proximity = 1 / (1 + dist / CONFIG.citizens.distHalf)` — soft
     preference for closer, never a hard cutoff
3. **Top 6** by score become the candidate set (fewer if fewer exist).
4. **Weighted random pick:** weight = score^τ (CONFIG.citizens.pickTemp,
   default 1). τ=0 → uniform among the 6; higher → greedier. Keep it low:
   randomness here is spatial load balancing — pure argmax would dogpile
   everyone onto one best building (the synchronization trap, in space).

Rules that fall out and must stay true:
- The current location is always a candidate (distance 0). Camping is
  self-correcting: as the meter fills, urgency drops and "stay" loses
  naturally. Do not add anti-camping special cases.
- `minStay` is the only commitment. Re-picking the same spot restarts it.
- Interrupts (energy → sleep) are checked only at decision points, never
  mid-stay — citizens finish what they started. Keep minStays short so
  this never looks dumb.

Citizen record additions for this: `stayUntil` (game time) and
`activity: { need, fillRate }` while phase = doing.

### Population, jobs, migration

- Residents per house: L1 = 3, L2 = 5 (CONFIG.citizens.residentsPerLevel).
  Citizens are created on house placement/upgrade, removed on bulldoze.
- Cars per house: L1 = 1, L2 = 2 (carsPerLevel). Scarcity is structural —
  residents always outnumber cars, so walking stays alive.
- Jobs per shop: 4 (≈ one L1 house per shop, with some joblessness left
  over as the future unhappiness hook). Assignment: nearest open job by
  road distance. Jobless citizens skip the work state.
- Migration: new arrivals enter BY VEHICLE down the highway from its edge
  endpoint (no pedestrians on highway) and become walkers at the stub's
  inner end where it meets the road network.

### Cars & mode choice

- A car is a shared household resource: checked out at home departure,
  returned only at home arrival. The whole excursion (work → shop → park →
  home) uses one mode. First-come within the household.
- Mode choice is probabilistic by distance (discrete mode choice, as in
  real transport models): P(drive) ramps linearly from 0 at
  `carMinDist` (3 tiles) to 1 at `carFullDist` (12 tiles), rolled once at
  departure, gated by car availability. No car free → walk, no re-roll.
- Speeds: walk 1.2 tiles/s, drive 4 tiles/s (roads only for both).
- Rendering (M6): walkers = small capsule dots, drivers = small car boxes.

### Config plan (v0.2)

```js
citizens: {
  timeScale: 1, decisionHz: 2,
  residentsPerLevel: [0, 3, 5],
  carsPerLevel: [0, 1, 2],
  jobsPerShop: 4,
  rateJitter: 0.10,
  energy:  { decay: 0.55, sleepFill: 1.8, sleepBelow: 25, wakeAt: 95 },
  work:    { decay: 0.5, fill: 1.7, startBelow: 15 },
  needs:   { errands: { decay: 0.4 }, fun: { decay: 0.5 } },
  adverts: { shop: { need: 'errands', fillRate: 4, minStay: 15 },
             park: { need: 'fun',     fillRate: 3, minStay: 8 } },
  select:  { topK: 6, pickTemp: 1, distHalf: 8 },
  move:    { walkSpeed: 1.2, driveSpeed: 4,
             carMinDist: 3, carFullDist: 12 },
}
```

Budgeted rhythm: one full cycle (sleep → work → free_time → sleep) lands
around 3–4 real minutes at timeScale 1. Thresholds are hysteresis pairs
(sleep below 25 / wake at 95; work below 15 / done at 100) — the gap
prevents state flapping at boundaries. Never narrow a pair to a single
threshold.

### Movement & performance

- Per-mode networks: walkers path over ROAD tiles only (sidewalks);
  drivers path over roads + highway. Buildings are reachable only if
  road-adjacent (consistent with the growth rule).
- Path = building's adjacent road tile → BFS over the mode's network →
  destination's adjacent road tile. The Dijkstra-map flood is therefore
  per-mode when it matters (free_time scoring uses the walk network
  unless the citizen holds a car this excursion).
- Decisions on a slow tick (reuse the growth-tick pattern, ~2 Hz max).
  Per-frame work is only interpolating visible walker positions along
  cached paths. Walkers are tiny shared-geometry meshes.
- Cached paths invalidate when the road network changes. A walker whose
  path is severed re-plans from its current tile; if unreachable, it
  walks back home (never teleport — visible consequence is the point).

## The economy seed (for later)

Citizens doing = value: time spent in `work` at a shop is the future income
event; adverts satisfied in free_time are the future happiness inputs. Build
v0.2 so these are observable counters even before money exists.


## Input

- Raycast from pointer against an invisible ground plane → grid coords.
- Desktop: click places selected tool; hover shows a ghost/highlight tile.
- Mobile: tap places; no hover — show a selection cursor on first tap, confirm on
  second tap *or* place immediately (pick one during playtest, note in plan.md).
- Toolbar: fixed HUD strip (DOM, not in-scene) — building buttons + bulldoze.
  DOM UI, not Three.js UI: cheaper, accessible, styles easily for mobile.
- Camera rotate: two-finger twist or on-screen buttons (mobile), Q/E keys (desktop).
  Zoom: pinch / wheel.
- Reuse Solar Swing's touch lessons: pointer events (not touch events) for a single
  input path; preventDefault on the canvas; big hit targets.

## Rendering notes

- One directional light with shadows + ambient. Shadow camera sized to the grid once
  at startup (static world bounds — no per-frame shadow updates).
- ACES tone mapping (matches Solar Swing pipeline familiarity).
- Building meshes: shared geometries + materials per building type, cloned per tile.
  If tile count grows later, migrate to InstancedMesh — not needed at 20×20.
- Ground: single plane mesh with a grid overlay (thin line segments or a shader
  later; lines are fine for v0.1).

## File / module layout

- v0.1: single `index.html` with one `<script type="module">`. Sections in order:
  CONFIG → world state → mesh factories → syncTile → connectivity → growth tick →
  input → camera → main loop.
- Split into modules only when the file passes ~1,500 lines. Versioning via GitHub
  (repo per project; Drive folder pattern retired).

## Fragile systems / watch list

- Camera tween between iso angles: keep the target always at grid center; don't
  let zoom and rotate tweens overlap without composing them, or the frustum jumps.
- Raycast → grid rounding at tile borders: floor world coords, never round, or
  placement flickers between tiles at edges.
- Mobile pinch vs. tap disambiguation: require 2 active pointers before treating
  any movement as pinch/rotate.

## Milestones

1. **M1 — Static scene:** grid, ground, highway pre-placed, camera rotate/zoom. ✅
2. **M2 — Placement:** toolbar, raycast placement, bulldoze, ghost preview. ✅
3. **M3 — Growth:** connectivity flood fill, house upgrades, pop animation. ✅
4. **M4 — Feel + mobile pass:** touch controls, HUD sizing, playtest tuning.

v0.2 — Citizens:

5. **M5 — Sim core:** citizen records, meters, FSM, spawn from houses, job
   assignment. No rendering — HUD population counter proves it works.
6. **M6 — Walkers:** road BFS pathfinding, visible walkers with interpolated
   movement, traveling/doing phases, severed-path re-planning.
7. **M7 — Free time + migration:** building advertisements, free_time choice,
   arrivals walking in from the highway.
8. **M8 — v0.2 playtest:** meter rate tuning, walker readability at zoom levels.

## Backlog (not current version)

- Economy: money, build costs, income from shop work-visits
- Happiness from free_time needs met; emigration when unhappy/jobless
- Traffic visualization on roads/highway
- Save/load (localStorage in self-hosted build only — not Claude artifacts)
- Procedural building variation (random heights/colors per placement)
- Day/night cycle (visual only — must not drive citizen schedules)
- Larger / expandable map
- Sound
