# 🌙 Midnight Crush — a haunted dating platformer

> ## ⚠️ This project has MOVED
> **Development continues at [`12code4/datinghorrorsim`](https://github.com/12code4/datinghorrorsim)**
> (migrated 2026-07-26 at v0.4 "Open Road"). This repo is now the read-only
> archive: the full pre-migration commit history and the shelved isometric
> city builder (branch [`iso-city-builder`](../../tree/iso-city-builder))
> live here. Don't develop here.

> **Midnight Crush owns this repo.** A Mario-style platformer crossed with an
> anime dating sim, wrapped in pastel-pink-purple-blue horror. Built as a gift
> game. 💜 The isometric city builder that originally lived here is shelved —
> preserved with full history and docs on the branch
> [`iso-city-builder`](../../tree/iso-city-builder).

Something has the night of Hollow Hills on **strings**. An unseen puppeteer —
this game's Bowser — has every soul in town sleepwalking on invisible threads,
and every single one of them is impossibly attractive. You don't fight the
"enemies" — **jumping on their heads snaps the strings**, and what wakes up
wants a word with you. Every goomba-slot is a cute anime girl or an
uber-confident hot anime guy with a real dialog tree. Cross three nights of
the open road — every soul you wake remembers you — and at dawn, the
almost-kiss goes to whoever holds your heart highest.

Every version is a single self-contained HTML file — no build step, no assets,
no dependencies. Every character is a procedurally drawn chibi.

**Current version: v0.4 "Open Road"**

## ▶ Play

**[Play Midnight Crush →](https://12code4.github.io/iso-city-builder/)**

One page, every version: it opens the latest build (v0.4) and has an in-page
menu to switch to any older version (deep-linkable, e.g. `…/#v=v0.2`). Desktop and
mobile touch both work.

Prefer local? Open `index.html` (the same launcher) or a versioned file
directly, e.g. `midnight-crush-v0.4-open-road.html`, in any browser.

| Action | Desktop | Mobile |
| --- | --- | --- |
| Move | ← → or A / D | ◀ ▶ buttons |
| Jump | Space / ↑ / W | ⤒ button |
| Talk to someone | jump on their head (first time frees them) | same |
| Bounce off a freed body | jump on their head again (7 in a row = they leave!) | same |
| Answer | click a dialog choice | tap a dialog choice |
| **Debug menu** (playtest) | press **N** — shows hidden meters + live knobs | — |

## The design

**Core loop — Mario × dating sim:**
- Side-scrolling platformer: run, jump, one-way platforms, pits, heart pickups.
- Un-freed characters wander with **puppet strings** rising off them and glazed,
  mind-controlled eyes. **Stomp = snap the strings** — the wake-up IS the meet-cute.
  Touching anyone unfriendly from the side still hurts, like Mario — flirting
  takes precision.
- Each first conversation is a 3-question dialog tree. Answers shift affection
  (💗 / 💔), and affection is **cumulative across conversations**: an "unsure"
  chat isn't wasted, it's progress.
- **The meter is the final call.** After any conversation, that *body's*
  attitude re-derives from the character's shared meter:
  - **meter high → friendly enemy** — won't attack; patrols with hearts, makes
    occasional small talk in speech bubbles, heals you when hurt. Walk up to a
    friend to talk (date scene, then rotating chatter). But jump on their head
    and they get **bumped off the screen Mario-style** — a random archetype
    reaction quote as they fly (sad, furious, "I PASSED THAT TEST", and past
    love-level: *"why did you do this, my love"*) — it costs affection, and
    they come back later. They remember.
  - **meter normal → free-thinking** — same enemy behavior as under mind
    control, but only 0.8× as aggressive. Freedom mellows people.
  - **meter very low → hostile** — hunts you on sight at 1.25× speed. Greetings
    turn wary until you win them back.
  - Greetings are context-dependent: first meeting (strings snap), warm return,
    or a cold "I made a list of grievances. You're the ENTIRE list."
- Cross **three nights** to the shrine, where **Ayame** — who spent Night 2
  hovering overhead dropping warding charms at you — waits with the finale:
  a pure dialog battle where wrong answers cost real hearts.

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

## Project docs — read in this order

| File | What it is |
| --- | --- |
| [`VISION.md`](VISION.md) | **Start here.** North star, the player profile (what she likes — the design compass), what 1.0 means, handoff orientation. |
| [`CLAUDE.md`](CLAUDE.md) | Architecture law: locked decisions, core state, attitude bands, watch list. |
| [`design-doc.md`](design-doc.md) | The compiled v0.2 playtest → law + release plan (v0.3/v0.4 built; v0.5–v0.7 ahead). |
| [`roadmap.md`](roadmap.md) | What's next, organized by blocker. |
| [`playtest.md`](playtest.md) | The open questions — deliberately short. |
| [`plan.md`](plan.md) | Session-by-session dev log. |

## Version history

- **v0.1 "First Night"** — core platformer + stomp-to-talk dating system, five
  characters, shrine gate, boss dialog battle, pastel-horror night.
- **v0.2 "Broken Strings"** — the puppeteer lore (visible strings, glazed
  puppet eyes, string-snap on stomp); character clones sharing one persistent
  bond (localStorage saves); the per-body **attitude system** (friendly /
  free-thinking 0.8× / hostile 1.25× + chase, meter is the final call);
  Mario-style bump-offs with archetype reaction quotes; walk-up talking,
  ambient speech bubbles, ally healing; date scenes climaxing in hand-holding;
  archetypes turned up (Pretty-Cure girls, Rengoku-grade gentlemen); the
  almost-kiss finale.
- **v0.3 "Close Quarters"** — the feel patch. Camera zoom (view defined in
  tiles, identical on every monitor); a real fix for fast-fall stomps tunneling
  into side-hits; **dialog is now once per body** — a freed body becomes a
  springboard, and bouncing one **seven times in a row** sends them off the
  screen Mario-style (5% of the time they count out loud and flutter away in a
  rainbow, free). Hidden **0–100 meter** with weighted choices; all four
  behavior bands get ambient chatter; an **N debug menu** exposes the hidden
  values and live-tunes every knob for playtesting.
- **v0.4 "Open Road"** — the shrine gate is gone. **Three nights** crossed
  Mario-style (enter left, exit at a glowing lantern): the Long Road, the
  Graveyard Hill — where **Ayame hovers overhead Lakitu-style dropping warding
  charms** — and the Shrine Path. View tightened to 20 tiles; springboard
  bounces now lift you a full jump-height plus the friend you bounced off
  (secrets tucked accordingly, never required for progress); and the finale
  plays by Tokimeki rules: **the almost-kiss goes to whoever holds your
  heart highest** — interrupted, of course, by everyone at once.

## Roadmap

The whole roadmap and its reasoning now live in [`design-doc.md`](design-doc.md)
(Juan's v0.2 playtest, compiled into law + the v0.3–v0.7 release plan) and in
[`roadmap.md`](roadmap.md). The short version:

- ~~**v0.4 "Open Road"**~~ ✅ shipped — see version history above.
- **v0.5 "Sweet Nothings"** — conversation pools (many convos per character),
  memory & callbacks ("you bounced on me 12 times", "you killed me — but I was
  already dead"), branching trees, much more dialogue.
- **v0.6 "Picture Book"** — the otome **event-CG** system (procedural: frame
  layer + a pose vocabulary in `drawChibi` so hand-holding actually reads),
  collectible CG gallery.
- **v0.7 "Dress Rehearsal"** — the costume pass: Pretty-Cure dresses, pastels,
  flowers, pastries — all as `drawChibi` look flags.

The through-line survives: **the puppeteer is still out there**, every release
climbs one rung of the romance ladder, and the true kiss waits for the finale.
(The old "Witching Hour" horror ideas and the sci-fi "Starlight Signal" world
are parked for re-scoping after v0.4 — see roadmap.md.)

## Design backlog (tabled — do not build yet)

Ideas parked here on purpose. Do **not** fold them into a version on a whim.

- **Dialog-trigger rework (IMPORTANT).** ✅ **ANSWERED — see `design-doc.md` §2.1.**
  Dialogue is now once per *body*, not once per character; a spent body becomes a
  springboard. None of the four options originally parked here was chosen.
- **Behavior doc for angry / neutral / friendly.** ✅ **ANSWERED — see
  `design-doc.md` §2.3.** Walking into a neutral body still damages you; friendly
  is the only safe state. Two of the three open questions here remain open and are
  tracked in `design-doc.md` §9: what "aggression" means beyond speed, and when
  bodies re-derive attitude.
- **Locked, per review:** the date scenes, the hand-holding-as-climax pacing,
  the interrupted-kiss finale, and the archetype voices (Pretty-Cure girls,
  Rengoku-grade Kazuma) are approved as-is. Don't rewrite them.

## Repo hygiene

Same standing process as `main`: granular commits, tag each finished version
(`v0.1-mc` style tags to avoid colliding with the city builder's tags), docs
updated every release. `window._game` debug hooks stay until a public ship.
