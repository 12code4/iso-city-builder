# 🌙 Midnight Crush — a haunted dating platformer

> **This branch is its own project.** The `main` branch of this repo is the
> isometric city builder; `claude/anime-dating-sim-platformer-eji5ot` is
> **Midnight Crush**, a Mario-style platformer crossed with an anime dating sim,
> wrapped in pastel-pink-purple-blue horror. Built as a gift game. 💜

Something has the night of Hollow Hills on **strings**. An unseen puppeteer —
this game's Bowser — has every soul in town sleepwalking on invisible threads,
and every single one of them is impossibly attractive. You don't fight the
"enemies" — **jumping on their heads snaps the strings**, and what wakes up
wants a word with you. Every goomba-slot is a cute anime girl or an
uber-confident hot anime guy with a real dialog tree. Charm three hearts to
open the shrine gate, then survive a conversation with the spirit guarding it.

Everything lives in a single self-contained `index.html` — no build step, no
assets, no dependencies. Every character is a procedurally drawn chibi.

**Current version: v0.2 "Broken Strings"**

## Running it

Open `index.html` in any modern browser. That's it. Desktop and mobile touch
both work (on-screen buttons appear on touch devices).

| Action | Desktop | Mobile |
| --- | --- | --- |
| Move | ← → or A / D | ◀ ▶ buttons |
| Jump | Space / ↑ / W | ⤒ button |
| Talk to someone | jump on their head | jump on their head |
| Answer | click a dialog choice | tap a dialog choice |

## The design

**Core loop — Mario × dating sim:**
- Side-scrolling platformer: run, jump, one-way platforms, pits, heart pickups.
- Un-freed characters wander with **puppet strings** rising off them and glazed,
  mind-controlled eyes. **Stomp = snap the strings** — the wake-up IS the meet-cute.
  Touching anyone unfriendly from the side still hurts, like Mario — flirting
  takes precision.
- Each first conversation is a 3-question dialog tree. Answers shift affection
  (💗 / 💔), and affection is **cumulative across conversations**: an "unsure"
  chat isn't wasted, it's progress. Rejection makes that body *angry* — it hunts
  you at double speed for a while. Consequences are visible.
- Enough bond → they become a **friendly enemy**: still patrolling their patch
  like the goomba they replaced, but beaming, harmless, trailing hearts — and
  they'll patch you up if you're hurt (long cooldown).
- Charm **3 hearts** to unseal the shrine gate. Behind it waits **Ayame**, the
  boss — a pure dialog battle where wrong answers cost real hearts.

**The clone mystery (deliberately unexplained):** there are several Yukis on
the map. Several Rins. They all share one bond, one memory, one heart. Talk to
one and another remembers it. The characters deflect every question about it
("Fufufu. Town secret."). Unraveling this is the player's long game.

**The romance ladder (kept innocent, like the dating sims she knows):**
intensity comes from restraint. The ladder is: *freed → befriended (ally) →
the date scene, whose climax is **hand-holding** — played as the most intense
moment in the game → and a kiss that only nearly happens at the finale
(interrupted, of course). The full kiss is endgame material for a future
version. Nothing ever goes past that; blushing IS the content.

**The cast (all procedurally drawn chibis with moods, archetypes turned up):**

| | Character | Slot | Personality |
| --- | --- | --- | --- |
| 👻 | **Yuki** — shy ghost girl | goomba | Pretty-Cure-soft; 80 years of haunting, combusts at one compliment |
| 🧟‍♀️ | **Rin** — zombie schoolgirl | goomba | genki girl; died in 2004, unbothered, snack-driven |
| 🦇 | **Kazuma** — vampire | koopa | Rengoku energy: booming, honorable, gentleman-confident, "MAGNIFICENT!" |
| 🐺 | **Ren** — werewolf | koopa | smug gentleman pretty-boy; the tail betrays every feeling |
| ⛩️ | **Ayame** — shrine spirit | boss | 300-year yandere guardian who couldn't cut the strings herself |

**The aesthetic (her palette):** pastel pinks, purples, and blues glowing
against a deep-night horror backdrop — pastel-blue moon, drifting fog, ghost
wisps, dead trees, gravestones, random violet lightning, and a heavy vignette.
Cute where the light is, scary where it isn't.

**Persistence:** bonds, freed strings, and romances save to localStorage —
she can close the tab mid-story and every relationship remembers. The title
screen offers "forget everything (new story)" once a save exists.

**Architecture rules (inherited from the city builder's discipline):**
- All tuning lives in one `CONFIG` object (physics, palette, timers, thresholds).
- The level is **built in code**, not hand-aligned ASCII — no alignment bugs.
- One `drawChibi()` renders every character at every size (world + portrait):
  single source of truth for how a character looks.
- Dialog is data (`CAST`), not code: adding a character = adding an entry.
  Zero new engine logic per character.
- Tiny WebAudio synth for SFX — still zero assets.

## Version history

- **v0.1 "First Night"** — core platformer + stomp-to-talk dating system, five
  characters, shrine gate, boss dialog battle, pastel-horror night.
- **v0.2 "Broken Strings"** — the puppeteer lore (visible strings, glazed
  puppet eyes, string-snap on stomp); friendly-ally state with healing;
  character clones sharing one persistent bond (localStorage saves); date
  scenes climaxing in hand-holding; archetypes turned up (Pretty-Cure girls,
  Rengoku-grade gentlemen); the almost-kiss finale.

## Roadmap — the two planned updates

The through-line: **the puppeteer is still out there.** Every update escalates
toward meeting whoever holds the strings, and the romance ladder climbs one
rung per update — the finale kiss stays just out of reach until the end.

### Update 1 — v0.3 "The Witching Hour" *(horror deepens)*

She loves horror, so the horror gets teeth — and now it has an owner:

- **The Shade** — the puppeteer's collector, *unromanceable*. At intervals the
  night deepens: colors drain, a heartbeat starts, and a shadow with too many
  eyes stalks the roads trying to **re-string the friends you've freed**. You
  can't talk to it. Hide behind gravestones, outrun it, or lure it past allies —
  freed characters fight to stay awake, and protecting them is the horror-date
  content. Rejected (angry) characters are easier for it to re-string:
  heartbreak has consequences.
- **Gifts** — collectible items hidden in the darkest corners of the map
  (melon bread, a frisbee, a moon-viewing teacup…). Holding the right gift
  unlocks a dialog choice that character can't resist — and a third date scene
  per character (next ladder rung: an *almost*-kiss each, always interrupted).
- **Clone mystery, act I** — freed clones occasionally say things only another
  clone experienced; a hidden counter tracks how much the player has noticed.
- **Ambience pass** — low synth drone, proximity heartbeat for the Shade,
  per-character leitmotif stingers.

### Update 2 — v0.4 "Starlight Signal" *(her sci-fi side: World 2)*

- **World 2: the Aurora, a derelict orbital station** — the strings lead UP.
  New tileset: pastel neon on void-black, starfields, broken airlocks,
  **low-gravity jump physics** and a jetpack double-jump power-up.
- **New cast:** **Vega** (deadpan android girl *learning* what flirting is,
  badly), **Prince Altair** (alien royalty, somehow more confident than
  Kazuma — they must never meet), and boss **MOTHER**, the station AI — a
  horror/sci-fi dialog battle where she quotes your own past conversations
  back at you… which should be impossible, unless she's been listening
  through the strings. First hard evidence of who the puppeteer is.
- **Endings gallery** — every romance across both worlds; unlockable epilogue
  cards per character. Sets up the final version: confronting the puppeteer,
  the truth about the clones, and — at long, long last — the kiss.

## Repo hygiene

Same standing process as `main`: granular commits, tag each finished version
(`v0.1-mc` style tags to avoid colliding with the city builder's tags), docs
updated every release. `window._game` debug hooks stay until a public ship.
