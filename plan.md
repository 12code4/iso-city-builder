# plan.md — Isometric City Builder (living session log)

## Current milestone: M4 — Feel tuning & playtest (v0.1 built)

v0.1 now includes M1 + M2 + M3:
- M1: grid, ground, highway (fixed, z=8..9), iso camera (4 yaw steps,
  eased tween), Q/E + buttons, wheel + pinch zoom
- M2: toolbar (road/house/shop/tree/bulldoze), raycast placement via
  floor(), desktop hover ghost (green = valid, red = blocked), fixed
  tiles un-bulldozable, pop animation on placement
- M3: connectivity BFS from highway (runs on road changes only),
  houses adjacent to a connected road upgrade to level 2 after 12s
  (taller build, darker roof, pop on upgrade)

## Decisions made this session
- Mobile placement: tap-places-immediately for v0.1. Revisit only if
  playtest shows misplacement frustration. A pinch gesture poisons the
  tap (no accidental placement when zooming).
- Highway counts as "connected" for house adjacency (it IS the artery).

## Playtest checklist (M4)
- [ ] Tap accuracy on phone — tapMaxMove threshold (10px) too tight/loose?
- [ ] Toolbar reachable with thumb? Buttons big enough?
- [ ] 12s upgrade timer — feel rewarding or too slow/fast?
- [ ] Bulldozing a road correctly stops downstream growth?
- [ ] Rotation during placement — any tap-through on rotate buttons?
- [ ] Level 2 house silhouette readable at max zoom-out?

## Tuning knobs (all in CONFIG)
growth.upgradeSeconds, anim.popDur, camera.rotateDur, camera.viewMin/Max,
input.tapMaxMove, all colors

## Backlog
(see CLAUDE.md) + new: connected-road visual cue (subtle tint?),
drag-to-paint roads

## Session log
- 2026-07-18 — Kickoff. Renderer decision, CLAUDE.md, M1 static scene.
- 2026-07-18 — v0.1: placement + growth systems complete. Entering M4.

## v0.2 planning session (2026-07-18)
Decisions locked:
- Work/sleep cycle is meter-driven, no global clock. Desync via natural
  spawn staggering + per-citizen ±10% rate jitter.
- Citizens are visible walkers on the road network from the start (v0.2).
- Commute is a phase inside each state, never a fourth state.
- Extensibility rule: new building types interact with citizens ONLY via
  advertisements. No new citizen states, no special cases.
Next build: M5 (sim core, HUD population counter, no rendering).

## Free-time selection spec locked (2026-07-18)
- Adverts carry { need, fillRate, minStay }
- Decision: Dijkstra-map flood -> score = fill x urgency x proximity ->
  top 6 -> weighted random (score^pickTemp)
- Current location always a candidate; camping self-corrects via urgency
- minStay is the only commitment; interrupts only at decision points
- v0.2 needs: errands (shop), fun (tree). More needs = more adverts, no
  new logic.

## 2026-07-18 (cont.)
- Building change: tree replaced by park (fun advert). Visual: green
  patch tile, two small trees, bench. Code swap lands with M5 build.
- M5 approach agreed: simTime clock, lifecycle spawn/despawn, one-flood
  job assignment, full FSM + real free-time scoring, flat 3s travel
  placeholder (M6 swaps in real walking), debug census HUD as proof.

## Cars + numbers locked (2026-07-18)
- Residents L1=3, L2=5; cars L1=1, L2=2 (scarcity structural)
- jobsPerShop 2 -> 4 (one shop ~ one L1 house)
- Mode choice: P(drive) linear ramp 0 at 3 tiles -> 1 at 12, rolled once
  at home departure, gated by car availability; car returns only at home
- Full CONFIG.citizens block drafted in CLAUDE.md; hysteresis pairs on
  energy and work thresholds

## Road anatomy locked (2026-07-19)
- Highway now 1 tile wide (code change pending: CONFIG.highway.width 2->1,
  visuals rework: 2 lanes, no sidewalks, shoulders/barrier look)
- All roads 1 tile: 2 lanes + 2 sidewalks (render offsets, lanes +/-0.18,
  sidewalks +/-0.40, right-hand traffic)
- Derived rule changes: buildings need ROAD frontage (highway no longer
  counts - update growth check in code); migration arrives by vehicle,
  becomes pedestrian at stub inner end
- Walkers path on roads only; drivers on roads + highway

## M5 built + verified (2026-07-19)
Landed: park (replaces tree), highway 1-wide, road-only frontage rule,
road tiles render sidewalk ring, full sim core (citizens, meters, FSM,
Dijkstra floods, jobs, cars, mode roll, census HUD top-right).
Deviation from plan: travel uses real road-distance timers + mode choice
now (not the flat 3s placeholder) - floods existed anyway, higher fidelity.
Headless test results (10-20 sim minutes):
- 2 houses + shop + park: pop 6->10 after L2 upgrades, cars 1->2 each
- 4/4 jobs filled nearest-first; bulldoze teardown clean (no ghost workers)
- Both walk AND drive modes observed; ~2 wake cycles/10min (~on budget)
- Highway-frontage-only house correctly never grows
- No NaN meters over 20 sim minutes
Census legend: pop N, sleeping, working, free_time, no-job, cars out/total
Watch for M8 tuning: errands/fun saturate near 100 in a tiny city -
venue fill rates may be hot relative to decay. Judge at real scale.
Next: M6 walkers.

## M6 built + verified (2026-07-19)
Walkers and cars are visible. Real paths replace travel timers:
- beginTravel descends the Dijkstra map from dest frontage -> source,
  then offsets the polyline (walk +/-0.40 sidewalk, drive +/-0.18 lane,
  right-hand traffic by heading)
- updateTravel advances positions per frame on game time; decisions
  stay on the slow tick
- Meshes are a pure projection: created while traveling, swept when
  indoors/gone; material cache avoids churn
- Road changes call replanTravelers: same trip re-routed, else walk
  home, else idle-and-retry
Headless test: 88,597 traveler position samples, 0 off-network; path
segments clean; mid-travel road sever leaves 0 stuck; no NaN.
M7 next: migration arrivals by car via highway. Then M8 tuning.

## Day-anchored time system + 5x travel slowdown (2026-07-19)
- CONFIG now designer units (hours/per-day), derived to RT at boot;
  dayLength 240s anchors everything. Census shows day counter.
- Work shift: 6h (60s) MINIMUM enforced at arrival; meter-full alone
  does not release a worker.
- Speeds: walk 0.24, drive 0.8 tiles/s (5x slower). Crossing the map
  on foot ~ a full workday; cars now matter.
- Tuning fix from test: recoverHours 18 -> 14 (drivers were arriving
  home with work=~17 > startBelow 15 and skipping alternate days).
  Verified: 4 shifts per worker over 4 days, exactly daily.

## Empty-streets fix (2026-07-19)
Diagnosis (headless repro): not a render bug.
- Houses-only city = nowhere to go: agents visible 3s/180s. WAI but
  reads broken; venues/jobs create trips (with shop: 92s/180).
- House without road frontage = shut-ins (self-heals when road added).
- Agents were ~3px at default zoom; wake latency up to ~1min.
Fixes: agents ~60% bigger; half of residents spawn awake and decide
within one tick. Result: first agent on street in 0.5s; 110s/180 with
a shop+park present.
Player guidance to keep in mind for UI later: buildings need road
frontage; citizens need destinations. Backlog idea: idle "stroll"
behavior so even venue-less towns show some foot traffic.

## Feature planning session (2026-07-20)

New doc: **roadmap.md** — six designed-ahead pillars for v0.3+, each vetted
against a five-rule filter (one authority / adverts-only / no shared clocks /
visible consequence / observable before economic):
- A: Charm & observability — names, citizen+building inspectors, follow-cam,
  thought bubbles; complaint bubbles double as diegetic tutorial (closes the
  "player guidance" note above).
- B: Visitors & events — data-driven visitor framework (enter via highway,
  do a thing, leave). Ice cream truck = proof-of-the-advert-rule feature;
  stray dog; street musician (advert modification as event mechanic).
- C: Money — treasury, build costs, income only on physical arrivals
  (shift/errand completions), shop supply meters + delivery trucks making
  the highway the real import artery. Broke = can't build, never a spiral.
- D: Traffic — v1 same-lane spacing only (no intersection logic, ever, until
  it proves stable); v2 trip-time memory nudging mode choice.
- E: Land value — desirability field (parks +, highway noise −) gating L3
  apartments; residents [0,3,5,8], cars capped at 2 (walking stays alive).
- F: New needs — generalize tickCitizen's hardcoded errands/fun loop first,
  then food need + diner as pure data.

Proposed order: finish M7+M8, then v0.3 "Alive" (A + truck/dog), v0.4
"Payday" (C + F), v0.5 "Rush Hour" (D then E). Four direction questions for
the player are OPEN in roadmap.md (headline pillar, failure stakes, humor
register, map growth) — sequencing runs on flagged working assumptions until
answered; interactive ask failed twice this session (tool stream closed).

## Direction decisions from the player (2026-07-20)

- v0.3 = "Alive", Pillar A in full, but NO ice cream truck / stray dog.
  Fun visitors shelved (designed, unscheduled) until more silliness is
  wanted; the visitor framework still arrives via v0.4 delivery trucks.
- Failure stakes: deferred to v0.4 planning — an economic decision. Pillar
  C design must not assume failure exists until then.
- Humor: grounded with rare absurdity for now; silliness may layer in later.
- Map: 20×20 until a playtest feels cramped.
roadmap.md sequencing + decisions sections updated to match.

## M7 migration built + verified (2026-07-20)
Player override of the old locked spec: no drive→walk hand-off. A MOVING
TRUCK enters at the highway edge, drives (road+highway net) to a house's curb,
drops off 1..maxLoad residents (house resident count += load), then drives
back out and despawns. One truck bought a random 1–3 people, IRL-style.
Design vetted first via a multi-agent design pass (3 approaches + adversarial
critique) before the player simplified it to the truck model.
Implementation (index.html, ~+130 lines, now ~1200):
- Houses hold t.pending / t.nextDispatch / t.truckInFlight; onHousePlaced +
  onHouseUpgraded queue arrivals instead of spawning instantly.
- Flat `trucks` array; a truck is NOT a citizen (no meters/FSM — 3-state rule
  intact). Reuses beginTravel + a new shared advanceAlong() mover; drive-net
  floods. Rendered as a bigger van box via updateTruckMeshes (projection).
- dispatchTruck / migrationTick (slow tick) / truckArrive (deliver + turn
  around) / despawnTruck / replanTrucks / cancelArrivalsFor / nudgeMigration.
- BEHAVIOR CHANGE: reachability now gates arrival. An unconnected house stays
  empty (residents wait in pending) until a road links it to the highway —
  replaces the old instant shut-in spawn. Trucks turn back on bulldoze/sever.
- Census gained a 🚚 count of in-transit arrivals. window._sim.apply() added
  as a debug/test hook. Title → v0.2 M7.
Verification: real-browser Playwright harness (THREE served from npm — cdnjs
is blocked by the egress proxy, app file untouched). Results: trucks drive in
AND back out, always on-network (0 off-network samples); pop climbs as trucks
deliver, incl. L2-upgrade re-deliveries; isolated house stayed pending 3 /
residents 0 while unreachable, then filled to 3 within seconds of a road
connecting; bulldoze of a 5-resident house → pop drop, 0 ghosts; road sever →
0 stuck trucks; 0 NaN. Adversarial code-review pass run over the diff.
Next: M8 (v0.2 playtest / meter tuning). dispatchHours=1.5, maxLoad=3,
truckSpeed=0.7 are the migration knobs to tune there.

## M8 scale test + tuning (2026-07-20)
Built a headless scale harness (scratchpad/scale-test.mjs): road grid off the
highway, auto-filled adjacent tiles → 87 houses / 14 shops / 14 parks, ran
~4.5 in-game days at timeScale 30, pop reached 375–435 (all houses hit L2).
Findings at real scale:
- LIVELINESS is strong: ~25–43% of citizens on the street on average. The
  "alive" feel is there; walker density is high, not sparse.
- MIGRATION keeps up: all residents delivered, pending drains to 0; jobs fill
  fully (56/56). No NaN over 4 days.
- BUG FOUND + FIXED — startup truck SWARM: peakTrucks was 87 (every house
  dispatches on the same frame after a bulk placement). Added
  CONFIG.citizens.migration.maxConcurrent (8): migrationTick stops dispatching
  once the map is at the cap; remaining houses wait a tick. Re-test: peak 87→8,
  city still populates, all M7 behaviors still pass. Real incremental play
  rarely hits the cap; it's insurance for bulk placement + the larger-map
  backlog.
- The old M5 worry ("errands/fun saturate near 100 at scale") did NOT
  materialize — errands mean 69 (19% ≥90), not pinned.
TASTE CALLS left for the human playtest (with exact knobs), NOT auto-tuned so
the validated day-anchored system stays intact:
- fun runs lower than errands (mean 33 vs 69; 38% of citizens fun-starved).
  Structural: park restore=25 vs shop restore=60, and fun decays faster
  (80/day vs 60). If citizens read as joyless, bump CONFIG.citizens.adverts
  .park.restore (25→~40) or visitHours, or lower needs.fun.decayPerDay.
- energy sits low (mean 45, 25% deeply tired) — long walk commutes drain it
  in transit. Levers: move.walkSpeed/driveSpeed up, or energy.sleepHours, or
  accept it as the intended slow-travel tax (it drives cars mattering).
- joblessness ~85% here is an artifact of the test's house-heavy mix
  (1 shop per ~6 houses); jobsPerShop=4 is fine — real cities choose their mix.
- Walker readability at zoom is a VISUAL check only a human can make; density
  is high, so the question is legibility-when-crowded, not emptiness.
M8 verdict: one real fix (truck cap) shipped; meter feel is a play-and-judge
pass with the knobs above. v0.2 sim is solid at scale.

## v0.3 "Alive" — Pillar A built (2026-07-20)
Long autonomous session: both M8 and v0.3 in one go. v0.3 = the whole of
roadmap Pillar A minus the ice cream truck / stray dog (player-shelved).
Three committed, browser-verified stages:
- v0.3a — Names + inspectors (fccb37f): deterministic nameFor(id); 🔍 Inspect
  tool; live DOM cards for citizens (name, friendly state line, 4 meter bars,
  home/job) and buildings (house residents / shop workers / park visitors,
  clickable names → citizen card). Citizen pick = screen-space nearest within
  CONFIG.input.pickRadius; building pick = raycast. Cards live-update; building
  cards rebuild only on a signature change; self-close on bulldoze.
- v0.3b — Follow camera (d74cacd): Follow button chases a citizen (both phases);
  manual pan cancels; clears on close/bulldoze. Only camTarget moves.
- v0.3c — Bubbles (cf9febd): thought bubbles at decision points (💼/😴/🛒/🎈);
  complaint bubbles (🛒❓/🎈❓) when a need is starved AND no venue exists —
  the city grumbling what to build. servedNeeds recomputed each simTick; per-
  citizen cooldown; no shared clock. Sprites are pure projection; textures
  cached, materials disposed. Closes the empty-streets "player guidance" gap.
Verification: dedicated Playwright harnesses per stage (verify-v03a/b/c.mjs),
all green. Test hook lesson: Object.assign copies a getter's VALUE not the
getter — exposed live state via plain functions (getInspected/getFollow/…).
Debug surface on window._sim grew (inspect*, screenOf, getters, showBubble) —
intentional, flagged for stripping before a public ship.
Adversarial review of the full v0.3 diff run before final push (like M7).

### v0.3 review + fixes (2026-07-20)
14-agent adversarial review (3 lenses × find→verify) over the v0.3 diff found
NO correctness/lifecycle bugs — inspector/follow/bubbles logic is sound. 11
findings deduped to efficiency + 1 design-gap + 1 housekeeping, all low/med.
Fixed:
- computeServedNeeds was per-FRAME (in simTick, outside the slow-tick loop).
  Made it event-driven: recompute only in applyTool (build/bulldoze/road) +
  once at boot, matching the connectivity cache pattern. AND made it
  reachability-aware (hasConnectedRoadNeighbor) so a shop placed-but-not-
  connected still lets citizens complain — closes the review's design-gap.
- updateBubbles rebuilt a whole-population Map every frame → added a
  persistent citizenById index (maintained at the single push/splice sites),
  used in bubbles, both card updaters, follow camera, worker/resident lookups.
- Citizen card re-queried ~11 elements/frame → cache refs at open.
- Housekeeping: roadmap "SHIPPED"→"BUILT" (debug hooks intentionally remain on
  the dev branch; strip before any public ship).
Left as documented-low: building-card signature filter runs per frame while a
card is open (bounded to one open card on a 20×20 map).
Re-verified: all v0.3 a/b/c suites + M7 teardown/sever + reachability gate green.

### Repo hygiene convention adopted (2026-07-20)
Player wants a well-organized GitHub going forward: clean version history +
current docs. Added a STANDING PROCESS block to the top of CLAUDE.md (checked
every session): main always reflects the latest completed version (merge via
PR, don't strand work on branches); tag every version vX.Y annotated + push
tags; granular commits (never squash unrelated work); keep README/CLAUDE/
roadmap/plan in sync each version; a per-version definition-of-done checklist.
Applying it retroactively now: tag v0.2 (a18e2c4 = M8) and v0.3 (86bcdd0), and
bring main current (it was stuck at 4bc83e0, ~mid-v0.2, missing M7/M8/v0.3).
Next: v0.4 "Payday" (economy + needs-loop refactor + diner) per roadmap.

## v0.4 "Look & Life" built + verified (2026-07-20)
MAX-EFFORT visual batch — four updates to the RENDER layer only (sim/inspector/
bubble logic untouched; meshes are a projection, so it was safe). Art direction
chosen: COZY PASTEL. Built directly into index.html and verified in the real
game (Playwright, pop 27, day+night, zero console errors):
1. Cozy-pastel art overhaul — MeshStandard materials; pastel CONFIG.colors;
   per-house pastel sets (cuteMats, hash(x,z)); detailed homes (window flower
   boxes, door gardens, chimney, door), pink-awning shop w/ sign+windows, parks
   w/ flowerbeds, cream sidewalks, softened grid, pastel ground.
2. Deep immersive zoom — camera.viewMin 5 -> 1.5 (street level).
3. Day/night cycle (visual only) — independent dayT clock (CONFIG.daynight),
   updateWorldFX(dt): sun sweep+color, sky/ambient/fog gradients, emissive
   window/lamp/sign glow after dark. Citizens NEVER read dayT (no-shared-clock
   intact). Tuned night moonlight up (0.35 sun / 0.6 ambient) so pastels stay
   readable + cozy while still moody (good horror groundwork).
4. Living map — per-home variation, street lamps on ~1/4 road tiles, chimney
   smoke (10-puff pool, chimneys list rebuilt on world change), 4 drifting birds.
Shared materials/geos (never disposed on bulldoze -> no leak). Debug hooks:
_sim.setDayT/getDayT/camView/camTarget/refreshChimneys. File now ~1650 lines
(past the 1500 split point — kept single-file through v0.4 as decided; ES-module
split is the next structural step). Title -> v0.4. Adversarial review of the diff
run before final push. Next: v0.5 "Charm & Critters" per the 4-patch roadmap.
