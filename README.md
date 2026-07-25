# 🌙 Midnight Crush — a haunted dating platformer

> **This branch is its own project.** The `main` branch of this repo is the
> isometric city builder; `claude/anime-dating-sim-platformer-eji5ot` is
> **Midnight Crush**, a Mario-style platformer crossed with an anime dating sim,
> wrapped in pastel-pink-purple-blue horror. Built as a gift game. 💜

The town of Hollow Hills is cursed: every soul wandering its night is impossibly
attractive. You don't fight the "enemies" — **you jump on their heads to start a
conversation.** Every goomba-slot is a cute anime girl or an uber-confident hot
anime guy with a real dialog tree. Charm three hearts to open the shrine gate,
then survive a conversation with the spirit guarding it.

Everything lives in a single self-contained `index.html` — no build step, no
assets, no dependencies. Every character is a procedurally drawn chibi.

**Current version: v0.1 "First Night"**

## Running it

Open `index.html` in any modern browser. That's it. Desktop and mobile touch
both work (on-screen buttons appear on touch devices).

| Action | Desktop | Mobile |
| --- | --- | --- |
| Move | ← → or A / D | ◀ ▶ buttons |
| Jump | Space / ↑ / W | ⤒ button |
| Talk to someone | jump on their head | jump on their head |
| Answer | click a dialog choice | tap a dialog choice |

## The design (v0.1 build)

**Core loop — Mario × dating sim:**
- Side-scrolling platformer: run, jump, one-way platforms, pits, heart pickups.
- Every "enemy" is a character. **Stomp = start a conversation**, not a kill.
  Touching them from the side still hurts, like Mario — flirting takes precision.
- Each conversation is a 3-question dialog tree. Answers shift affection
  (💗 / 💔). End result: **romanced** (they light up and become an ally),
  **unsure** (come back and try again), or **rejected** — they get *angry* and
  hunt you at double speed for a while. Consequences are visible.
- Charm **3 hearts** to unseal the shrine gate. Behind it waits **Ayame**, the
  boss — a pure dialog battle where wrong answers cost real hearts.

**The cast (all procedurally drawn chibis with moods):**

| | Character | Slot | Personality |
| --- | --- | --- | --- |
| 👻 | **Yuki** — shy ghost girl | goomba | 80 years of haunting, flustered by one compliment |
| 🧟‍♀️ | **Rin** — zombie schoolgirl | goomba | died in 2004, unbothered, snack-driven |
| 🦇 | **Kazuma** — vampire | koopa | insufferably confident, 400 years old, "natural hair volume" |
| 🐺 | **Ren** — werewolf | koopa | smug pretty-boy, tail betrays him |
| ⛩️ | **Ayame** — shrine spirit | boss | 300-year yandere guardian of everyone's hearts |

**The aesthetic (her palette):** pastel pinks, purples, and blues glowing
against a deep-night horror backdrop — pastel-blue moon, drifting fog, ghost
wisps, dead trees, gravestones, random violet lightning, and a heavy vignette.
Cute where the light is, scary where it isn't.

**Architecture rules (inherited from the city builder's discipline):**
- All tuning lives in one `CONFIG` object (physics, palette, timers, thresholds).
- The level is **built in code**, not hand-aligned ASCII — no alignment bugs.
- One `drawChibi()` renders every character at every size (world + portrait):
  single source of truth for how a character looks.
- Dialog is data (`CAST`), not code: adding a character = adding an entry.
  Zero new engine logic per character.
- Tiny WebAudio synth for SFX — still zero assets.

## Roadmap — the two planned updates

### Update 1 — v0.2 "The Witching Hour" *(horror deepens)*

She loves horror, so the horror gets teeth:

- **The Shade** — an *unromanceable* stalker. At intervals the night deepens:
  colors drain, a heartbeat starts, and a shadow with too many eyes hunts you.
  You can't talk to it. You hide behind gravestones or you run. Rejected
  characters join the hunt while they're angry.
- **Memory & persistence** — characters remember previous conversations
  (localStorage save). Romanced characters get a **second scene**: a date at a
  location in the level (graveyard picnic with Rin, moonlit balcony with
  Kazuma…), each with its own dialog tree and story payoff.
- **Gifts** — collectible items hidden in the darkest corners of the map
  (melon bread, a vintage '31 red, a frisbee…). Holding the right gift unlocks
  a special dialog choice that character can't resist.
- **Ambience pass** — low synth drone, proximity heartbeat for the Shade,
  per-character leitmotif stingers.

### Update 2 — v0.3 "Starlight Signal" *(her sci-fi side: World 2)*

- **World 2: the Aurora, a derelict orbital station** — the curse reached
  space. New tileset: pastel neon on void-black, starfields, broken airlocks,
  **low-gravity jump physics** and a jetpack double-jump power-up.
- **New cast:** **Vega** (deadpan android girl who is *learning* what flirting
  is, badly), **Prince Altair** (alien royalty, somehow more confident than
  Kazuma — they must never meet), and boss **MOTHER**, the station AI — a
  horror/sci-fi dialog battle where she quotes your own past conversations
  back at you.
- **Endings gallery** — tracks every romance across both worlds; unlockable
  epilogue cards per character.

## Repo hygiene

Same standing process as `main`: granular commits, tag each finished version
(`v0.1-mc` style tags to avoid colliding with the city builder's tags), docs
updated every release. `window._game` debug hooks stay until a public ship.
