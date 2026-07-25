# roadmap.md — Midnight Crush (designed-ahead features)

CLAUDE.md = locked architecture · plan.md = session log · **roadmap.md =
features designed ahead of their build**. When something here gets scheduled,
its locked spec moves into CLAUDE.md and this file keeps only what's not yet
scheduled. (The city builder's roadmap is preserved on branch
`iso-city-builder`.)

## Where we are

**`design-doc.md` supersedes this file's near-term plan** — it's Juan's v0.2
playtest compiled into law + the v0.3–v0.7 release sequence. This file keeps the
long-horizon ideas and anything not yet folded into the doc.

v0.3 "Close Quarters" is built (camera zoom, swept stomp fix, bounce juggle,
dialog-per-body, 0–100 hidden meter, N debug menu). The two formerly-tabled
README questions (dialog trigger, behavior bands) are ANSWERED in the doc.
Still open per design-doc §9: all `[PROPOSED]` numbers, Juan's aggression spec,
the jealousy mechanic.

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

## Scheduled — see design-doc.md for the authoritative specs

- **v0.4 "Open Road"** — gate removed; multi-level Mario structure; view→20
  tiles; springboard-gated secrets; Ayame as a Lakitu-style recurring hazard;
  highest-meter finale.
- **v0.5 "Sweet Nothings"** — conversation pools; memory & callbacks; branching
  trees; the big dialogue expansion.
- **v0.6 "Picture Book"** — procedural event-CG system (frame layer + pose
  vocabulary in `drawChibi`); collectible CG gallery.
- **v0.7 "Dress Rehearsal"** — costume pass (Pretty-Cure dresses, pastels,
  flowers, pastries), all as `drawChibi` look flags.

## Displaced ideas — re-scope after v0.4 lands

These were the old v0.3/v0.4; the feel-first replan (design-doc §3) displaced
them. Keep for later; do not build without rescheduling.

- **The Witching Hour (horror layer)** — a Shade that RE-STRINGS freed friends
  (heartbroken/hostile bodies easier to recapture); gifts unlocking irresistible
  choices + a further date rung; clone-mystery act I; an ambience pass. Slots
  naturally on top of the v0.3 attitude bands.
- **Starlight Signal (sci-fi World 2)** — the Aurora station; low-gravity +
  jetpack; new cast (Vega, Prince Altair, boss MOTHER who quotes your past
  conversations — impossible unless she hears through the strings). The
  puppeteer's first hard tell.

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
