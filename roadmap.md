# roadmap.md — designed-ahead features (v0.3 and beyond)

Division of labor between docs: **VISION.md = the north star** (soul + full arc),
CLAUDE.md = locked architecture, plan.md = session log, **roadmap.md = features
designed ahead of their build**. When a pillar here gets scheduled, its spec moves
into CLAUDE.md (trimmed to what's locked) and this file keeps only the not-yet-
scheduled ideas.

## Where we are

v0.2 COMPLETE (M1–M8). v0.3 "Alive" BUILT. **v0.4 "Look & Life" is the current
build** (art direction + immersion) — a deliberate reshuffle: the player chose a
look-and-feel release before the economy, so **economy "Payday" moves to v0.5**.
- ~~**M7** — migration~~ ✅ moving trucks deliver residents; reachability-gated.
- ~~**M8** — scale tuning~~ ✅ sim holds at ~435 pop; truck-swarm cap.
- ~~**Pillar A — Charm & observability**~~ ✅ BUILT as v0.3 "Alive": names,
  inspectors, follow camera, thought + complaint bubbles.

## v0.4 — "Look & Life" (current release: make it beautiful and alive)

A look-and-feel release. Four updates, each shipped + verified (verification =
rendered screenshots, since beauty can't be judged headlessly):

1. **Art-direction overhaul** — one committed style applied to every model
   (houses L1/L2, shop, park, walkers, cars, trucks) and every tile (grass, road,
   sidewalk, highway, park). Detailed, characterful geometry + material/lighting
   polish. Direction chosen from rendered prototypes (5 candidates: Cozy Miniature
   Diorama, Storybook Papercraft, Cel-shaded Toytown, Handmade Clay, Cozy Lowpoly).
2. **Deep immersive zoom** — extend the zoom far past the current clamp toward
   street level; retune frustum/clamps so it stays smooth and readable all the way
   in. The payoff for the detailed models.
3. **Day/night cycle (visual only)** — animated sun, sky gradient dawn→day→dusk→
   night, warm golden-hour light, window + lamp glow after dark. NEVER drives
   citizen behavior (no-shared-clock rule holds — it's pure lighting/skybox state).
4. **Living map** — per-building procedural variation (no two identical), ambient
   props (street lamps, hedges, flowers, benches), and gentle ambient motion
   (chimney smoke, birds). Handmade, inhabited feel.

Deferred by player choice: **sound** → a later update; **charm visitors** (dog /
ice-cream truck) → stay tabled for the v0.8 visitor framework.

## The filter — every feature must pass all five

1. **One authority.** New state lives in `world`, `citizens`, or a new flat
   array. Meshes stay projections.
2. **Advertisements only.** Anything that wants a citizen's attention does it
   through an advert. A feature that needs a new citizen state or a special-case
   branch gets redesigned or cut.
3. **No shared clocks.** Nothing schedules to a time of day. Meters, decay, and
   minStay only.
4. **Visible consequence.** Every system failure shows up in the world (a
   walker turning around, a truck that can't arrive), never only in a number.
5. **Observable before economic.** Counters first, money later — same way v0.2
   counts work-visits before income exists.

---

## Pillar A — Charm & observability ("who ARE these people")  ✅ BUILT (v0.3)

Shipped 2026-07-20 as v0.3 "Alive": names, citizen + building inspectors,
follow camera, thought + complaint bubbles. The design below is retained as
the record; everything except "visitors-today for parks" (approximated as
current visitors) landed. Architecture notes now live in CLAUDE.md.

The sim already generates stories; nobody can read them. This pillar is pure
reading surface — zero new sim mechanics, biggest emergent-fun payoff per line.

- **Names.** Deterministic from citizen id (syllable table in CONFIG). Census
  stays aggregate; names appear in the inspector.
- **Citizen inspector.** Tap a walker/car → DOM card (consistent with the
  DOM-not-in-scene UI rule): name, state + phase, meter bars, home/job links.
  Raycast against agent meshes; generous hit radius at far zoom.
- **Follow camera.** Button on the inspector card: camTarget tracks the
  citizen until the player pans away. Turns any commute into a story.
- **Thought bubbles.** Small billboard sprite above the head at *decision
  points only* (already-sparse moments — no per-frame cost): 💼 off to work,
  🛒 errands, 🏠 heading home. And the important one:
- **Complaint bubbles as tutorial.** A need that stays starved with no venue
  for it in town → periodic 💭 with the need's icon. This is the "player
  guidance" item from plan.md's empty-streets postmortem, solved diegetically:
  the city tells you what to build by grumbling about it.
- **Building inspector.** Tap a building: residents (named) for houses,
  workers/jobs for shops, visitors-today for parks.

No config beyond bubble timing + name syllables. No new citizen logic.

## Pillar B — Visitors & events (the fun kind of chaos)

**Status (2026-07-20): descheduled from v0.3 by player decision.** The fun
visitors (truck, dog, musician) wait until more silliness is wanted. The
*framework* still gets built in v0.4 — delivery trucks (Pillar C) are
visitors — so these become cheap data rows whenever they're greenlit.

A **visitor** = an agent that enters by highway, does one thing, and leaves.
Not a citizen: no meters, no FSM — a scripted route plus (usually) an advert.
Visitors interact with citizens ONLY via advertisements (filter rule 2). Flat
`visitors` array, meshes projected like walkers.

- **Ice cream truck** (build this first — it's the proof of the advert rule).
  Enters via highway, parks on a random connected road tile, broadcasts a
  strong short-minStay `fun` advert (data: same shape as shop/park adverts,
  just attached to a vehicle). Citizens converge from blocks around, mob the
  truck, disperse when it leaves ~an hour later. Emergent crowd scene, zero
  new citizen code. 🎵 bubble while parked.
- **Stray dog.** Wanders the sidewalk network; after a while picks a walker
  and follows them home; thereafter occasionally trots alongside that
  citizen's excursions. No advert, no meters — pure charm and completely
  inert to the sim. (Dogs may not use adverts; dogs obey no rules.)
- **Street musician.** Walks to the busiest park, busks: while present, that
  park's advert fillRate gets a multiplier. Crowd forms, then thins when he
  moves on. Demonstrates advert *modification* as an event mechanic.
- **Framework note:** visitors are data — `{ enterVia: 'highway', behavior:
  'parkAndAdvertise' | 'wander' | 'visitVenue', advert?, stayHours }`. New
  events should be new rows, not new code paths.

## Pillar C — Money & the working economy

The v0.2 "economy seed" made value events observable; this converts them.

- **Treasury** (city-level, HUD top-left). Build costs per type in
  CONFIG.economy; bulldoze free, no refunds.
- **Income = the counters that already exist.** Completed shift at a shop →
  +wage-tax. Satisfied errands visit → +sales-tax. No abstract "population ×
  rate" income: money only moves when a citizen physically got somewhere.
  Bad road layout = visibly broke city (filter rule 4).
- **Broke = can't build.** Never a death spiral: existing city keeps running,
  treasury refills from activity. Cozy failure.
- **Supply & delivery trucks.** Shops get a supply meter (decays per day).
  A delivery truck (visitor-framework vehicle) spawns at the highway edge,
  drives to the shop's frontage, refills, leaves. Supply at 0 → the shop stops
  advertising errands and pauses its jobs until resupplied. Consequences:
  - The highway finally IS the import artery CLAUDE.md promises.
  - A shop the drive network can't reach visibly starves — trucks turn back.
  - Player-legible: trucks queuing down your one road = build another road.
- **Floaters.** +$ text popping off buildings on income events. Cheap, and
  makes the economy readable without opening a single menu.

## Pillar D — Traffic & congestion

The classic city-builder emergence engine. Also the riskiest pillar.

- **v1 — spacing only.** Each car checks ahead along its own lane polyline
  (per-tile car registry for cheap lookup) and brakes behind a slower/stopped
  car. Queues emerge at popular destinations. NO intersection logic, no
  right-of-way, no signals — straight-line spacing only, because intersection
  reservation systems are where traffic sims go to deadlock.
- **v2 (later) — feedback.** Citizens remember recent trip duration vs.
  expectation; chronically slow drives lower P(drive) at the next roll.
  Congestion self-limits the way it does in real cities: people give up and
  walk. (Never reroute mid-trip by global knowledge — citizens aren't Waze.)
- Watch list: two cars head-on in opposite lanes must never interact (they
  don't share a lane offset); guard the ahead-check to same-heading only.

## Pillar E — Land value & density

- **Desirability field**, computed on demand when the world changes (same
  cache pattern as connectivity): + parks within radius, + shops within a
  larger radius, − highway adjacency (noise). Stored per tile, shown as an
  overlay toggle later.
- **L3 houses (small apartment)** gated on desirability ≥ threshold at the
  tile, plus the usual connected-frontage time. residentsPerLevel → [0,3,5,8],
  carsPerLevel → [0,1,2,2] — parking does NOT scale with density, so dense
  blocks walk more (scarcity stays structural, per the cars rule).
- Emergent result: leafy low-rise cul-de-sacs vs. dense corridors near the
  action, without ever zoning anything.

## Pillar F — New needs & venues

- **Prerequisite refactor:** tickCitizen hardcodes `errands`/`fun` decay
  lines; generalize to a loop over CONFIG.citizens.needs so a new need is
  pure data. Small, do it before adding any need.
- **food** need (decays fastest of all) + **diner** venue
  `{ need: 'food', visitHours: ~0.75, restore: high }`. Hungry towns without
  a diner grumble 🍔 bubbles (Pillar A synergy).
- **plaza / fountain** — cheap small-fun venue, park alternative for dense
  blocks (pairs with Pillar E).
- Rule stays absolute: a venue is one CONFIG row. Zero new citizen logic.

---

## The 4-patch roadmap (v0.4 → v0.7) — decided 2026-07-20

Identity: a cozy, cute, **anime-flavored town-builder with a slow-burn DDLC-style
psychological-horror layer** and easter eggs galore — made as a gift. Economy is
TABLED. The four patches build one emotional arc:
**make it beautiful → make them love it → unsettle them → the hidden hearts.**

**Patch 1 — v0.4 "Look & Life"** ✅ BUILT *(the beautiful cozy surface)*
Chosen art direction: **cozy pastel**. Shipped: detailed pastel homes (flower
boxes, gardens, lamps), pink-awning shop, flowerbed parks; deep immersive zoom
(viewMin 1.5); visual day/night cycle (cosmetic — citizens never read it); living
map (per-home variation, chimney smoke, birds). Real-game verified + reviewed. The
cuteness is sincere → the horror will land. (Anime characters = a later 2D layer.)

**Patch 2 — v0.5 "Charm & Critters"** *(make them love the town)*
Ambient life (pets, birds, quirky citizen micro-behaviors), more charm props, and
the **events/visitor framework** — the scripted-moment engine everything below
reuses (Pillar B). First friendly **anime character(s)** as 2D portraits/sprites
(a layer distinct from the 3D town). Establish attachment; seed a few gentle
easter eggs.

**Patch 3 — v0.6 "Something's Off"** *(the dread creeps in)*
The **layered horror system** debuts: ships with only 1–2 subtle *seed* scares
active; noticing/interacting with them enough unlocks the rest of Layer 1 for the
game to use (deeper layers later). Every element is **low-probability + fleeting**
— deniable as a glitch. Content rides the events framework: subtle wrong details
(a watcher at night, a resident facing the wall, a name you didn't type),
atmosphere, and the first **cute-but-dangerous character**. DDLC-restrained
(dread > gore); each scare is a data row `{layer, unlockedBy, prob, duration}`, so
it's richness not bloat.

**Patch 4 — v0.7 "Hidden Hearts"** *(the love letter pays off)*
The **easter-egg framework** and the flagship hidden moments: the citizens-gather-
and-raise-hearts scene (red + pastel-pink), secret messages, and the tender
payoffs that tie the warmth and the dread together. *(Personal specifics live in
the owner's private notes, not the repo.)*

**After / tabled:** economy "Payday" (Pillar C, deprioritized); traffic & density
(D/E); then v1.0 standalone polish — **sound (huge for horror)**, save/load, title
screen, diegetic tutorial.

## Direction decisions (player)

1. **Identity (2026-07-20):** cozy, cute, anime-flavored town-builder with a
   slow-burn **DDLC-style psychological horror** layer (dread, cute-but-dangerous
   characters, restraint over gore) + easter eggs galore. A gift; horror/surprise
   specifics stay in private notes, not git.
2. **Economy:** tabled.
3. **v0.4 art direction:** ⏳ PENDING — awaiting the pick from the rendered
   prototypes (blocks the build). Cel (③) is the most anime-native for the 3D
   town; any style pairs with 2D anime character art for the horror layer.
   **Palette locked toward cute pastels — pastel pinks, purples, blues** — with
   flowery, detailed, adorable homes (window boxes, gardens). Whatever style
   wins, it wears this cute pastel skin. The cuter the surface, the harder the
   horror lands.
4. **Map growth:** 20×20 until a playtest feels cramped.
5. **Sound:** deferred to a later patch — flagged high-value for the horror.
