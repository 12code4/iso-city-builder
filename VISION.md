# VISION.md — the north star

What this game *is*, who it's for, and where it's going. When a design question
can't be answered by CLAUDE.md (architecture) or roadmap.md (next features), it's
answered here. Keep this short, opinionated, and true.

## The one-liner

**A cozy, living miniature town you love watching as much as building** — where
every little person is real, has a name, and lives a small story you can follow.

Cozy and cute on the surface — and, like *Doki Doki Literature Club*, something
quietly *wrong* underneath. Charm and anime warmth everywhere, threaded with a
slow-building layer of genuine dread and cute-but-dangerous characters, plus
easter eggs galore — some silly, some tender. It looks like a hug; it remembers
you looked away. *(Made with heart, as a gift. The specific secret surprises live
in the owner's private notes, not the repo, so they stay surprises.)*

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
3. **Charm and heart — with dread underneath.** The *building* is always kind:
   cozy failure only, a struggling city slows down, never punishes or collapses.
   But the *world* has a second layer. Under the cute anime surface runs a
   slow-building psychological horror in the vein of *Doki Doki Literature Club* —
   the sweetness is sincere, and that's exactly what makes the wrongness land.
   Cute-but-dangerous characters, details that shouldn't be, the game noticing
   you. Restraint over gore: dread, unease, the uncanny. And woven through it all,
   **easter eggs** — some silly, some frightening, some tender — that reward the
   curious.
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

## The horror layer (DDLC-adjacent)

She loves horror and anime; the dark side is built for that. The design north:

- **Cute anime surface, psychological horror underneath.** Slow build. Most of the
  time it's a cozy town; the wrongness creeps in — an off detail, a citizen
  behaving wrong, a name you didn't type, the UI flickering, the sense of being
  watched. The night prototypes (red-eyed watchers in a lamp-lit street) are a
  first taste.
- **A layered, unlockable reveal (the core horror mechanic).** Horror is *earned,
  not given*, and never fully peeled back at the start. The game ships with only
  **1–2 subtle "seed" scares** active from Layer 1; the rest of the layer stays
  **locked** until she *notices and interacts with the seeds enough*, which
  unlocks the full pool for the game to draw from. Deeper layers unlock later.
  **Every horror element is low-probability AND fleeting** — blink-and-miss, easy
  to dismiss as a glitch or bug ("...wait, did that just happen?"). *Deniability
  is the horror.* Data-driven: each element is an event row tagged
  `{layer, unlockedBy, prob, duration}` — richness without bloat, no new citizen
  states, no shared clock (probabilistic, not scheduled). Progression saved.
- **Cute-but-dangerous characters.** Anime-style special characters — rendered as
  **2D portraits/sprites for dialogue & events, a layer distinct from the 3D
  town** — who are adorable and *not safe*. Build attachment first, then unease.
- **Meta touches, sparingly.** DDLC's power is breaking the frame. Use rarely and
  deliberately: the game remembering, addressing the player, "editing" itself.
- **Restraint.** Dread > gore. Atmosphere, sound, and the contrast with the cozy
  base do the work — one perfect wrong thing beats ten jump scares.
- **Always in service of the gift.** The scares are a love language here; every
  dark arc bends back toward warmth and the hidden messages for her.

Specific scares, characters, and meta beats live in the owner's PRIVATE notes,
not the repo — spoilers ruin horror.

## Tone bible (so everything feels like one thing)

- **Cute surface, real dread beneath (the DDLC rule).** Genuinely warm, cozy, and
  anime-adorable on top — and genuinely unsettling underneath. The horror works
  *because* the cuteness is sincere; never wink-and-nudge "spooky", never gore.
  Dread, wrongness, the uncanny, and characters who are lovable AND dangerous.
- **Kind to the PLAYER even while unsettling them.** The unease is the gift, not
  cruelty — a horror game she'll love, made with love.
- Citizens are endearing and taken seriously — which is why it lands when one is
  standing in your yard at 3am, facing the wall.
- Text is friendly and human ("heading home to sleep", not "state: SLEEP") —
  until, rarely and deliberately, it isn't.
- **Easter eggs are the soul's signature** — hidden moments of charm, humor,
  fright, and tenderness. Reward curiosity. Sweat every payoff.
