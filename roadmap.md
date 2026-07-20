# roadmap.md — designed-ahead features (v0.3 and beyond)

Division of labor between docs: CLAUDE.md = locked architecture, plan.md =
session log, **roadmap.md = features designed ahead of their build**. When a
pillar here gets scheduled, its spec moves into CLAUDE.md (trimmed to what's
locked) and this file keeps only the not-yet-scheduled ideas.

## Where we are

v0.2 is built through M6. Remaining before anything below starts:
- **M7** — migration: arrivals enter by vehicle via the highway edge.
- **M8** — playtest tuning: meter rates at real city scale, walker readability.

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

## Pillar A — Charm & observability ("who ARE these people")

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

## Sequencing (proposal)

Finish v0.2 (M7 → M8) first, then:

- **v0.3 — "Alive":** Pillar A + ice cream truck & stray dog from B.
  Rationale: cheapest, funniest, and the inspector/bubbles become the debug
  UI every later pillar needs anyway. The truck stress-tests the advert rule
  before the economy leans on it.
- **v0.4 — "Payday":** Pillar C (+ delivery trucks reuse B's visitor
  framework). F's needs-loop refactor lands here too (diner = first paid
  venue addition).
- **v0.5 — "Rush Hour":** D v1 spacing, then E — density creates the traffic
  that makes D worth watching.
- Backlog unchanged (day/night visual, save/load, sound, bigger map) —
  day/night pairs naturally with v0.5 headlights if it ever gets pulled in.

## Open questions for the player-designer

Still OPEN as of 2026-07-20 — the sequencing above runs on these working
assumptions until overruled. Overriding any answer only reshuffles the
version ordering; the pillar designs themselves don't change.

1. **v0.3 headline pillar?** Working assumption: A + B-lite ("Alive").
   Alternatives: economy first ("Payday"), traffic first ("Rush Hour"),
   density first.
2. **Can the city fail?** Working assumption: cozy — broke pauses building,
   activity refills the treasury, the city never collapses. Alternatives:
   soft failure (unhappy citizens visibly emigrate down the highway, city can
   shrink) or real failure (debt, abandonment cascades).
3. **Humor register?** Working assumption: grounded world, rare absurd
   visitors — comedy comes from the sim being earnest about an ice cream
   truck. Alternatives: openly silly, or fully grounded (cut truck/dog).
4. **Map growth beyond 20×20?** Working assumption: stays backlog until a
   playtest actually feels cramped. Alternatives: bump soon, or make land
   purchase an economy money-sink mechanic (ties into Pillar C).
