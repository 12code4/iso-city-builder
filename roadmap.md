# roadmap.md — Midnight Crush (designed-ahead features)

CLAUDE.md = locked architecture · plan.md = session log · design-doc.md = the
compiled playtest law + release plan · **roadmap.md = what's next and what's
blocking it**. (The city builder's roadmap is preserved on branch
`iso-city-builder`.)

## Where we are

**v0.1 → v0.4 are all shipped and playable** at the Pages launcher. The engine
is well ahead of the feedback: v0.3 and v0.4 have **never been played by a
human**. Every band boundary, choice weight and bounce knob in the game is a
`[PROPOSED]` guess from the design doc.

So the bottleneck isn't build capacity — it's **data**. The list below is
sorted by that, not by version number.

## The through-line

**The puppeteer is still out there.** Every update escalates toward meeting
whoever holds the strings, and the romance ladder climbs exactly one rung per
version — the kiss stays out of reach until the finale. Innocent pacing is a
locked design rule, not a placeholder.

## The filter — every feature must pass all four

1. **CAST is data.** New characters/content ship as CAST entries and CONFIG
   knobs, zero new engine branches.
2. **The meter is the final call.** No feature may decide a body's state from
   anything but the shared meter at an interaction point.
3. **Visible consequence.** Every system change shows up on screen (a wagging
   tail, a fall, a re-strung friend), never only in a number.
4. **Keep it innocent.** Hand-holding is intense; the kiss is the endgame;
   nothing goes further, ever.

---

## A. Buildable NOW — needs no playtest data

All content-agnostic machinery. Building it now means that when the voice
ranking lands, writing is *just writing* — no engine work in the way.

- **Conversation pools** (design §6). Each character owns an ordered pool;
  each body serves the next one you haven't seen. Adding bodies to a level then
  costs zero writing. *The structure is content-free — the pool can ship with
  today's single scene in it and grow later.*
- **Memory callbacks — the data is already there.** `mem.bounces`, `mem.falls`
  and `mem.choices` have been recorded since v0.3 and are read in exactly ONE
  place: the debug menu. Nothing in the game spends them yet. Wiring the
  callback layer (a line may reference a tally or a past choice) is pure
  plumbing; the payoff lines get written in v0.5b.
  → Includes Juan's beat: *"you killed me… but I was already dead."*
- **Caves & gift items** (Juan, 2026-07-26). Hidden caves — openings disguised
  inside otherwise solid-looking geometry — holding ITEMS the player can give
  to specific characters to unlock SECRET SCENES. The *system* (cave carving,
  item pickup, inventory, give-to-character trigger) is buildable now; the
  secret scenes themselves are content.
  Rules that stay: springboard-only secret spots (lure someone close, bounce
  off them), and **progression is never gated on head-bounces**.

## B. Gated on ~30 minutes of your play

See `playtest.md` — deliberately short now.

- **Every `[PROPOSED]` number** — band bounds (19/55), start (25), choice
  weights, bounce knobs. The `N` menu exists exactly for this.
- **Q6 band legibility** → decides whether bands need non-speed tells
  (posture, chatter rate, string state). Cheap to add — but only worth adding
  if it actually fails.
- **Q11–15 voice ranking** → decides who gets content first in v0.5b. Nothing
  else can order that work.
- **Re-test Q16** — does the swoon make the hand-hold land, or is the full
  v0.6 CG/pose system the only real answer?

## C. Gated on your ruling (no play required)

- **§9.2 — what "increased aggression" means beyond speed** (chase
  persistence, chase range, fear radius, damage). *Juan is authoring.* Knobs
  are stubbed in `CONFIG.attitude`, waiting.
- **§5 — the jealousy mechanic:** in or out. (Neglected characters notice and
  gossip; thematically native to a game about being watched.)
- **§9.3 — when bodies re-derive attitude** beyond dialog end / respawn / load.

## D. Then, in order

- **v0.5 "Sweet Nothings"** — splits cleanly:
  - **v0.5a — the machinery** (section A above). No blockers.
  - **v0.5b — the writing.** Conversation pools filled out, branching trees,
    memory-callback payoff lines, multiple polished scenes per character,
    the cave/gift secret scenes. *Ordered by the voice ranking.*
- **v0.6 "Picture Book"** — procedural event-CG system: frame layer first
  (cheap, high yield), then a pose vocabulary in `drawChibi` (`lean`, `reach`,
  `hold-hands`, `face-each-other`), then a CG-scale detail mode, then a
  collectible CG gallery. The hand-holding CG is the acceptance test.
- **v0.7 "Dress Rehearsal"** — costume pass (Pretty-Cure dresses, pastels,
  flowers, pastries), all as `drawChibi` look flags.

## Displaced — re-scope when there's room

Good ideas the feel-first replan pushed out. Don't build without rescheduling.

- **The Witching Hour (horror layer)** — a Shade that RE-STRINGS freed friends
  (heartbroken/hostile bodies easier to recapture); clone-mystery act I; an
  ambience pass. Sits naturally on top of the attitude bands. *Its "gifts" idea
  has been absorbed by caves & gift items above.*
- **Starlight Signal (sci-fi World 2)** — the Aurora station; low-gravity +
  jetpack; new cast (Vega, Prince Altair, boss MOTHER who quotes your past
  conversations back at you — impossible unless she hears through the strings).

## Final version — working title "Cut the Last String"

Confront the puppeteer. The truth about the clones. The kiss — real, earned,
uninterrupted (unless the joke is better). Keep the puppeteer's identity
unspoiled in code and docs until then.

## Parking lot

- Sound toggle + volume; per-character leitmotifs as CONFIG data
- Photo mode (she screenshots things — make it a feature)
- Per-character meter UI, but diegetic (a charm bracelet?) — never a number
- Save slots / multiple stories
- **Organizational pass** (Juan, deferred): push `v0.1-mc`/`v0.2-mc` tags,
  rename the two stray city-builder branches (`v0.4-art-immersion`,
  `v0.5-charm-critters`) so their version numbers stop colliding with this
  project's
- Strip `window._game` + the `N` menu before any public ship
