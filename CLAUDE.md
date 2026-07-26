# CLAUDE.md — Midnight Crush (haunted dating platformer)

Stable architecture reference. Session-by-session notes live in plan.md.
Update this file only when an architectural decision changes.

## Repo layout (changed 2026-07-25 — read this first)

**This repo now belongs to Midnight Crush.** The isometric city builder that
originally lived here is SHELVED, preserved with its full history and docs on
the branch **`iso-city-builder`**. Do not delete that branch; do not develop
on it; do not "helpfully" merge it anywhere. `main` and all new branches are
Midnight Crush.

## Repository & release hygiene (STANDING PROCESS)

Inherited from the city builder and still binding:
- `main` is the source of truth — always the latest completed version.
  WIP on feature branches; merge when done + verified + reviewed.
- One clear commit per milestone/feature/fix. Never squash unrelated work.
- Tag every finished version (`git tag -a vX.Y-mc`) — the `-mc` suffix keeps
  the namespace clear of any other project's tags. No versions are tagged yet;
  v0.1/v0.2 tagging is HELD until Juan's playtest review passes (definition
  of done requires review).
- Docs stay in sync every version: README (front page + version history),
  CLAUDE.md (architecture), roadmap.md (future), plan.md (session log).
- Definition of done: verified (headless/browser) → reviewed → docs updated →
  granular commits → pushed → tagged → merged to main.

## Project summary

Browser Mario-style platformer × Japanese-style dating sim × pastel horror.
An unseen puppeteer (the game's "Bowser") has the town of Hollow Hills
mind-controlled on visible strings. Every enemy slot is a cute anime girl or
an uber-confident hot anime guy. Stomping snaps a body's strings and starts a
conversation instead of a kill; each body talks once, then becomes a
springboard. The game is THREE NIGHTS (levels), Mario-shaped — enter left,
exit right at a lantern; no gate. Romance accumulates across nights (bodies
reset per night, the shared meter doesn't); the finale's almost-kiss goes to
whoever has the highest meter. Ayame is a Lakitu-style hazard on Night 2 and
the finale conversation on Night 3. Springboard rule: a bounce lifts you a
full jump height + the NPC's height (derived, CONFIG.stompBounce). Progression
NEVER requires a head-bounce (Juan's rule) — springboards gate only secrets.

Single self-contained runnable file (see below). Zero assets: characters are
procedurally drawn chibis, SFX is a tiny WebAudio synth. Desktop + mobile touch.

**The design doc (`design-doc.md`) is the current source of authority.** It
compiles Juan's v0.2 playtest into law and a release plan (v0.3–v0.7). Read it
before building. `[PROPOSED]` numbers in it are guesses, not decisions.

## Locked decisions

- **All tuning lives in CONFIG** — physics, palette, thresholds, cadences.
  No magic numbers in logic. `CONFIG.attitude` holds every disposition knob.
- **CAST is data, not code.** A character = one CAST entry (look + dialogs +
  quips + ambient + bump lines + context greetings). Adding a character must
  require zero new engine logic — the direct heir of the city builder's
  "advertisements only" rule.
- **One chibi authority.** `drawChibi(g, look, opts)` draws every character at
  every size (world sprite and dialog portrait). Look flags (ghost, tail,
  sailor, cape, orbs, lashes, sharp, glow, scarf…) — never per-character draw
  functions. Collision boxes are independent of sprite scale.
- **The level is built in code** (`put()` calls onto a grid), never
  hand-aligned ASCII.
- **Dialog UI is DOM, not canvas** (#dialog overlay). In-world speech is
  canvas bubbles. Portraits render into a small canvas via drawChibi.
- **The meter is the final call.** After any conversation, a body's attitude
  derives from the character's shared bond — never from the conversation
  result alone (Juan's rule; resolves all result-vs-meter conflicts).
- **Romance pacing stays innocent** (locked after review — do NOT rewrite):
  the ladder is freed → befriended → date scene climaxing in HAND-HOLDING
  (played as the most intense moment in the game) → almost-kiss at the finale,
  interrupted. The true kiss is endgame content for the final version.
  Blushing IS the content. Nothing ever goes past a kiss.
- **Archetype voices locked after review:** girls Pretty-Cure-cute (Yuki shy,
  Rin genki), guys gentleman-confident (Kazuma = Rengoku-grade booming honor,
  Ren = smug with a traitorous tail), Ayame yandere-guardian.
- **The clone mystery is never explained.** Multiple bodies per character all
  share one bond/memory. Characters deflect questions about it. Unraveling it
  is long-game content; no code may "fix" or lampshade it away.

## Runnable files (design-doc §2.7)

The runnable is renamed each release: `midnight-crush-vX.Y-title.html`, opening
with a version-history comment block. Prior versions stay on disk as playable
snapshots. `index.html` is a **launcher page** linking every version (also what
GitHub Pages serves). Update every doc's file references in the same commit.
Current runnable: `midnight-crush-v0.4-open-road.html`. `index.html` embeds
the chosen version in an iframe with an in-page version menu (the Pages entry).

## Core state

- `bonds[id]` — ONE record per character (not per body), persisted to
  localStorage (`midnightCrush.v2`): `{ meter, freed, romanced, dated, mem }`.
  `meter` is **0–100 and hidden** from the player. `mem` = `{ bounces, falls,
  choices }` (lifetime, feeds v0.5 callbacks). `romanced` is a HIGH-WATER mark.
  Ayame is never persisted — the finale replays. v1→v2 migration in place.
- `chars[]` — bodies on the map. Per-body: position/physics, `attitude`
  ('puppet' | 'friendly' | 'neutral' | 'hostile' | 'bumped' | 'boss'),
  `spoken` (this body's one conversation is used), `juggle/counting/rainbow`
  (bounce chain), `talkCd`, `ambientAt`, `spin/hidden/respawnAt` (fall lifecycle).
- Attitude derives via `deriveAttitude(id)` at interaction points ONLY
  (dialog end, fall respawn, load) — never per frame. Bodies lagging the
  meter is intentional (mystery + per-instance feel).

## Attitude bands (CONFIG.meter / CONFIG.attitude)

- meter ≥ friendlyMin (55) → **friendly**: the ONLY safe contact. 0.8× patrol;
  ambient bubbles; heart particles; walk-up → date (once) / heal / quip.
  Stomp a spent friendly = the juggle (see below).
- hostileMax (19) < meter < friendlyMin → **neutral** (free-thinking): regular
  enemy, damages on contact, 0.8× aggression.
- meter ≤ hostileMax (19) → **hostile**: damages; hunts player within
  chaseRange at 1.25×; wary `regreetLow` greeting.
- `puppet` = strings never snapped on THIS body (per-body in-session).

## Dialog-per-body + the bounce juggle (design §2.1/§2.2)

- Each BODY carries ONE conversation (`spoken`). First stomp → strings snap +
  dialog. After that the body is platforming furniture.
- Stomping a spent body starts a **juggle**: consecutive airborne bounces
  counted on the body; touching the ground resets EVERY body's chain. Bounce
  `warn` (6) → annoyance line; `fall` (7) → they leave the screen Mario-style
  (slowed `fallGravity` for comedy), costing `fallCost` meter, parting line
  lingers `lingerS`. `countChance` (5%): they count out loud and flutter off in
  a rainbow at ZERO cost — do NOT balance this joke away (§2.2). Bodies respawn
  after `bumpRespawn`, attitude re-derived.
- Choice weights are varied per question (not uniform ±1); meter is the sum.

## Interaction matrix (who does what on contact)

|            | stomp (unspoken)              | stomp (spent)      | side contact         |
| ---------- | ----------------------------- | ------------------ | -------------------- |
| puppet     | strings snap + dialog         | —                  | damage               |
| neutral    | dialog (regreet)              | juggle             | damage               |
| hostile    | dialog (regreetLow)           | juggle             | damage               |
| friendly   | dialog                        | juggle → fall      | date / heal / quip   |
| boss       | dialog                        | dialog             | auto-confront        |

## Fragile systems / watch list

- Stomp uses a SWEPT check (design §4.2): test the player's vertical travel
  this frame, not a fixed window — a terminal-velocity fall must not tunnel
  past a head. `CONFIG.stompGrace` is the tunable tolerance.
- Rendering runs under `ctx.setTransform(Z,…)`; W/H are WORLD units, not
  pixels. Anything reading W/H (ambient radius, bubble wrap) is world-scaled.
- Dialog must never open on a 'bumped' body (guarded).
- Boss still uses the `ch.state==='angry'` path for the hurl-back; nobody else
  uses ch.state beyond 'talk'/'roam'. Don't reintroduce state-machine branches.
- Sprite scale (1.28 world) is visual only; hitboxes unchanged at w26 h34.
- localStorage: bump `SAVE_KEY` if the bonds shape changes (currently v2).
- Debug menu (`N`) and `window._game` stay until a public ship.

## Open — Juan to rule (design §9)

- Every `[PROPOSED]` number (band boundaries, start=25, weights, bounce knobs)
  is a GUESS — live CONFIG knobs, exposed in the `N` menu, corrected by play.
- "Increased aggression" beyond speed (chase persistence / range / fear radius
  / damage) — JUAN authoring; band structure ships with speed as the only tell,
  extra knobs stubbed.
- Jealousy mechanic (§5) — in/out undecided.
- Versioned-filename scheme confirmed (§2.7); keeping old files on disk = yes.

## Milestones

- v0.1 "First Night" ✅ — core platformer + stomp-to-talk + cast + gate + boss.
- v0.2 "Broken Strings" ✅ — puppeteer lore, shared bonds + clones, attitude
  bands, bump-offs, date scenes, ambient bubbles, visual pass. (playtested)
- v0.3 "Close Quarters" ✅ — camera zoom, swept stomp fix, bounce juggle,
  dialog-per-body, 0–100 hidden meter, all-band chatter, N debug menu.
- v0.4 "Open Road" ✅ — gate removed, three nights, view→20 tiles, Lakitu
  Ayame + warding charms, springboard rule + secrets, highest-meter finale.
- v0.5 "Sweet Nothings" — conversation pools, memory callbacks, dialogue
  expansion. v0.6 "Picture Book" — CG system. v0.7 "Dress Rehearsal" — costumes.
