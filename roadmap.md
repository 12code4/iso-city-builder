# roadmap.md — Midnight Crush (designed-ahead features)

CLAUDE.md = locked architecture · plan.md = session log · **roadmap.md =
features designed ahead of their build**. When something here gets scheduled,
its locked spec moves into CLAUDE.md and this file keeps only what's not yet
scheduled. (The city builder's roadmap is preserved on branch
`iso-city-builder`.)

## Where we are

v0.2 "Broken Strings" is built, pending Juan's playtest review. Next builds
are gated on: (1) playtest feedback, (2) Juan's angry/neutral/friendly
behavior design doc, (3) the dialog-trigger decision (see README backlog).

## The through-line

**The puppeteer is still out there.** Every update escalates toward meeting
whoever holds the strings, and the romance ladder climbs exactly one rung per
version — the kiss stays just out of reach until the finale. Innocent pacing
is a locked design rule, not a placeholder.

## The filter — every feature must pass all four

1. **CAST is data.** New characters/content ship as CAST entries and CONFIG
   knobs, zero new engine branches.
2. **The meter is the final call.** No feature may decide a body's state from
   anything but the shared bond at an interaction point.
3. **Visible consequence.** Every system change shows up on screen (a wagging
   tail, a bump-off, a re-strung friend), never only in a number.
4. **Keep it innocent.** Hand-holding is intense; the kiss is the endgame;
   nothing goes further, ever.

## v0.3 — "The Witching Hour" (horror deepens)

- **The Shade** — the puppeteer's collector, unromanceable. At intervals the
  night deepens: colors drain, a heartbeat starts, a shadow with too many
  eyes stalks the roads trying to RE-STRING freed friends. Can't be talked
  to; hide behind gravestones, outrun it, or protect allies (freed bodies
  fight to stay awake). Hostile (heartbroken) bodies are easier to re-string:
  heartbreak has consequences.
- **Gifts** — collectibles hidden in the darkest corners (melon bread, a
  frisbee, a moon-viewing teacup…). The right gift unlocks an irresistible
  dialog choice + a third date scene per character (next ladder rung: an
  almost-kiss each, always interrupted).
- **Clone mystery, act I** — freed bodies occasionally reference things only
  another body experienced; a hidden counter tracks how much the player has
  noticed.
- **Ambience pass** — low drone, proximity heartbeat for the Shade,
  per-character leitmotif stingers.

## v0.4 — "Starlight Signal" (sci-fi World 2)

- **The Aurora, a derelict orbital station** — the strings lead UP. Pastel
  neon on void-black, starfields, broken airlocks, low-gravity jumps, jetpack
  double-jump power-up.
- **New cast:** Vega (deadpan android girl learning to flirt, badly), Prince
  Altair (alien royalty, somehow more confident than Kazuma — they must never
  meet), boss MOTHER (station AI) — quotes your past conversations back at
  you, which should be impossible unless she's been listening through the
  strings. First hard evidence of who the puppeteer is.
- **Endings gallery** — every romance across both worlds; epilogue cards.

## Final version — working title "Cut the Last String"

- Confront the puppeteer. The truth about the clones. The kiss — real,
  earned, uninterrupted (unless the joke is better).
- Design open until v0.3/v0.4 land; keep the identity of the puppeteer
  unspoiled in code and docs until then.

## Unscheduled ideas (parking lot)

- Sound toggle + volume; leitmotifs as CONFIG data
- Photo mode (she screenshots things — make it a feature)
- Per-character bond meter UI (diegetic: a charm bracelet?)
- Save slots / multiple stories
- Strip `window._game` before any public ship
