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
