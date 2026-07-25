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
conversation instead of a kill. Charm 3 hearts → shrine gate → boss dialog
battle → almost-kiss finale.

Single self-contained `index.html`. Zero assets: characters are procedurally
drawn chibis, SFX is a tiny WebAudio synth. Desktop + mobile touch.

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

## Core state

- `bonds[id]` — ONE record per character (not per body), persisted to
  localStorage (`midnightCrush.v1`): `{ bond, freed, romanced, dated }`.
  `romanced` is a HIGH-WATER mark (gate progress never regresses).
  Ayame is never persisted — the finale replays each session.
- `chars[]` — bodies on the map. Per-body: position/physics, `attitude`
  ('puppet' | 'friendly' | 'neutral' | 'hostile' | 'bumped' | 'boss'),
  `talkCd`, `ambientAt`, `spin/hidden/respawnAt` (bump lifecycle).
- Attitude derives via `deriveAttitude(id)` at interaction points ONLY
  (dialog end, bump respawn, load) — never per frame. Bodies lagging the
  meter is intentional (mystery + per-instance feel).

## Attitude bands (CONFIG.attitude)

- bond ≥ friendlyBond (2) → **friendly**: no damage; 0.8× patrol; ambient
  speech bubbles; heart particles; heals player on walk-up (healCooldown).
  Stomp = Mario-style bump-off: archetype quote (bumpLove at bond ≥ loveBond),
  −bumpBondLoss, body flies off spinning, respawns after bumpRespawn.
- hostileBond (−1) < bond < friendlyBond → **neutral** (free-thinking):
  regular enemy at 0.8× aggression.
- bond ≤ hostileBond → **hostile**: hunts player within chaseRange at 1.25×
  speed; wary `regreetLow` greeting.
- `puppet` = strings never snapped on THIS body (per-body in-session; on load,
  bodies of a freed character load string-free — known simplification).

## Interaction matrix (who does what on contact)

|            | stomp                            | side contact              |
| ---------- | -------------------------------- | ------------------------- |
| puppet     | strings snap + dialog (greet)    | damage                    |
| neutral    | dialog (regreet)                 | damage                    |
| hostile    | dialog (regreetLow)              | damage                    |
| friendly   | BUMP-OFF (quote, −bond, respawn) | date → heal → quip bubble |
| boss       | dialog                           | auto-confront in range    |

## Fragile systems / watch list

- Dialog must never open on a 'bumped' body (guarded in the stomp timeout).
- `talkCd` guards walk-up spam; closeDialog re-arms it and bounces the player.
- Boss uses the old `ch.state === 'angry'` path for the hurl-back; nobody
  else uses ch.state beyond 'talk'/'roam'. Don't reintroduce state-machine
  branches — attitude bands own behavior.
- Sprite scale (1.28 world) is visual only; hitboxes unchanged at w26 h34.
- localStorage save: bump `SAVE_KEY` version if the bonds shape changes.

## Backlog / tabled (see README "Design backlog")

- Dialog-trigger rework (stomp-always-talks blocks springboard tech) — TABLED,
  awaiting Juan's design doc. Do not build ahead of it.
- Angry/neutral/friendly behavior design doc — OWNER: JUAN. Open questions
  listed in README.
- `window._game` debug hooks stay until a public ship.

## Milestones

- v0.1 "First Night" ✅ — core platformer + stomp-to-talk + 5-character cast,
  gate, boss, ending. Headless-verified.
- v0.2 "Broken Strings" ✅ (pending Juan's playtest review before tagging) —
  puppeteer lore + strings, shared persistent bonds + clones, attitude bands,
  bump-offs, walk-up talking, date scenes, ambient bubbles, visual pass.
- v0.3 "The Witching Hour" — see roadmap.md. Blocked on playtest feedback +
  behavior design doc.
- v0.4 "Starlight Signal" — see roadmap.md.
