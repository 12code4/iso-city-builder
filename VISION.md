# VISION.md — the north star

What this game *is*, who it's for, and where it's going. When a design question
can't be answered by CLAUDE.md (architecture) or roadmap.md (next features), it's
answered here. Keep this short, opinionated, and true.

## The one-liner

**A cozy, living miniature town you love watching as much as building** — where
every little person is real, has a name, and lives a small story you can follow.

Cozy at its core, mischievous at the edges: charm and quirk everywhere, a thread
of gentle, playful "cozy-horror," and easter eggs galore — some silly, some
tender, more warmth hidden in it than it lets on. *(This game is made with heart,
as a gift. The specific secret surprises live in the owner's private notes, not in
the repo, so they stay surprises.)*

## The feeling we're chasing

You place a road, a house, a shop. A moving truck trundles in and a family
moves into the house. Days later you tap one of them — *Ivy Brook* — and follow
her from home, down the street you drew, to the shop you placed, and back. She
grumbles that there's nowhere fun nearby, so you build a park, and the next
afternoon she's there. Nothing forced it. You just made a place, and a life
happened in it.

That's the whole game: **make a place, watch lives happen.** Warm, unhurried,
quietly funny, endlessly watchable. A town in a snow-globe, not a spreadsheet.

## Who it's for

People who loved the *watching* in SimCity/Cities more than the managing — who
zoomed all the way in and made up stories. Fans of cozy, generous, low-stress
building games (Townscaper, Dorfromantik, A Little to the Left energy). Someone
who wants a game that's kind to them.

## What makes it distinct (defend these)

1. **Every citizen is a real simulated individual — never a statistic.** No fake
   "population happiness %" standing in for people. Each person has a name, a
   home, a job, meters, and a day. This is the heart, and it's a deliberate,
   defended cost: we invest in *efficient* per-agent simulation as we scale
   rather than ever faking it. (Player-locked, 2026-07-20.)
2. **Intimacy over scale.** Most city builders zoom out to a management dashboard.
   We zoom *in*. The camera, the art, the inspectors, the follow-cam all pull you
   toward the individual and the street-level moment.
3. **Charm and heart over stress.** Cozy failure only — a struggling city slows
   down, it never punishes or collapses on you. The tone is gentle and earnest,
   and the comedy comes from that earnestness (a whole neighborhood mobbing an
   ice-cream truck, played completely straight). On top of the cozy base:
   **quirk, whimsy, and a thread of playful "cozy-horror"** — the uncanny used for
   delight, never dread — and **easter eggs galore**, hidden triggers that reward
   the curious with special little moments, some silly, some heartfelt.
4. **The town tells its own stories, legibly.** Emergent behavior is worthless if
   no one can read it. Names, thought bubbles, complaint bubbles, inspectors, and
   follow-cam exist to surface the stories the simulation is already generating.
5. **A handmade, alive, unmistakable look.** One art direction, committed to hard,
   so a screenshot is instantly *this game*. Beautiful up close (you can get down
   to street level) and full of small life — light changing over the day, smoke
   from chimneys, a bird, a dog.

## Design commandments (the locked architecture, restated as values)

These live in CLAUDE.md in full; here's *why* they matter to the feeling:

- **One source of truth; meshes are a projection.** Lets the world be saved,
  reloaded, and re-skinned freely — the game is the state, the visuals are a view.
- **Advertisements only.** New buildings/venues/events tempt citizens through data
  ("I offer *fun*"), never new citizen code. This is how the game stays deep
  without becoming a tangle — and how modders/future-us add content cheaply.
- **No shared clocks.** Nothing schedules to a time of day. Lives desync
  naturally, so the town never lurches in robotic unison. (Day/night is *visual
  only* — it must never drive behavior.)
- **Visible consequence.** Every system's failure shows up in the world, not just
  a number — a truck that can't reach a house, a citizen walking home
  disappointed. Legibility is a feature, not a debug tool.

## The arc — from toy to standalone game

Where we are and where this is going. roadmap.md holds the detailed, sequenced
version of the near-term; this is the whole horizon.

**Shipped**
- **v0.1 — Foundations:** grid, placement, growth, the highway.
- **v0.2 — Citizens:** real per-agent sim, walkers & cars, pathfinding, migration
  by moving truck. Scale-tested to hundreds of residents.
- **v0.3 — Alive:** names, inspectors, follow-camera, thought & complaint bubbles.

**Next** *(reshuffled: charm ahead of economy — see roadmap.md)*
- **v0.4 — Look & Life (current):** a committed art direction; detailed models;
  reworked tiles; deep immersive zoom; a visual day/night cycle; a living map
  (per-building variation, ambient props, gentle motion). *Make it beautiful.*
- **v0.5+ — Charm & Secrets:** the heart of this game's identity —
  - an **events & visitors framework** (scripted moments: friendly, quirky, and
    gently uncanny) and an **easter-egg framework** (hidden triggers → special
    scripted scenes: citizen gatherings, sign/heart props, secret messages —
    reusing the bubble & agent systems). Charm-first, some tender.
  - **more venues & needs** (diner, plaza, fountain; needs-loop refactor) —
    reasons to build, decoupled from money.
- **v0.6 — Rush Hour & Roots:** traffic congestion, then land value & density.
- **v0.9 — A Place of Your Own:** gentle goals, unlocks, naming your town — soft
  progression that never becomes pressure.
- **v1.0 — Standalone:** sound & music, save/load, settings & accessibility, a
  diegetic tutorial, a title screen, performance hardened at scale, a larger /
  expandable map, a proper self-hosted build. Ship it as a real game.
- **Tabled:** **Economy "Payday"** (money, costs, income) — designed in roadmap
  Pillar C, deprioritized by the owner; build it someday if it earns its place.
- **Beyond:** seasons & weather, citizen relationships & families, more secrets.

## Standalone-game architecture (what "full-fledged" needs — plan now, build later)

Decisions to make deliberately so we don't paint ourselves in:

- **Per-agent simulation at scale (locked intent).** Keep simulating every
  citizen. Earn the scale with engineering, not shortcuts: spatial partitioning
  for neighbor queries, a tick budget (amortize decisions across frames — already
  started), cached path/flood invalidation on world change (already the pattern),
  InstancedMesh + LOD + culling for rendering crowds, and Web Workers for the sim
  loop if the main thread gets tight. Target: thousands of citizens, smooth.
- **Save/load.** The one-authority model makes this clean: serialize `world`,
  `citizens`, `trucks`, and time; meshes rebuild from state on load. localStorage
  in the self-hosted build (not in a sandboxed artifact). Design the state to be
  versioned from the start.
- **Code structure.** Single `index.html` served us well; a standalone game wants
  modules. Path: **stay single-file through v0.4**, then split into ES modules
  (config / world / sim / render / camera / input / main), then adopt a light
  bundler (Vite/esbuild) when an asset & audio pipeline arrives (~v0.9–v1.0).
- **Content pipeline.** Buildings, venues, events, and needs should increasingly
  be *data* (advert definitions, building specs) so adding content — by us or
  mods — is authoring, not engineering.
- **Onboarding.** Teach diegetically. Complaint bubbles already tell players what
  to build; extend that philosophy instead of modal tutorials.
- **Audio, settings, accessibility, title/menu** — the connective tissue that
  turns a sandbox into a game people can sit down with. Scheduled around v1.0.

## Tone bible (so everything feels like one thing)

- **Cozy-core, mischievous accents.** Earnest, warm, whimsical — with occasional
  quirky or gently uncanny surprises used to *delight*, never to frighten. Cute
  first; spooky is a wink, not a threat. Never cynical, never punishing.
- Citizens are endearing, slightly silly, and taken seriously by the world.
- Text is friendly and human ("heading home to sleep", not "state: SLEEP").
- **Easter eggs are the soul's signature** — hidden, hand-placed moments of
  charm, humor, and (sometimes) tenderness. Reward curiosity. Sweat the payoff.
- Delight lives in small details: a name you recognize, a light at dusk, a dog
  that adopts a commuter, a secret only a few will ever find.
