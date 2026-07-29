# VISION.md — the north star & handoff brief

Read this FIRST. Everything else in the repo is architecture, law, or log —
this is *why the game exists and who it's for*. When a design question can't
be answered by CLAUDE.md (architecture), design-doc.md (compiled playtest
law), or roadmap.md (next steps), it's answered here.

## The one-liner

**A Mario-style platformer crossed with an innocent Japanese dating sim,
wrapped in pastel horror — built by Juan as a gift for his partner.** Every
"enemy" is someone worth talking to. The game's whole thesis: you can't use
people as stepping stones without it becoming a conversation.

## Who it's for — the player profile

This section is the project's compass. It was assembled from Juan's own
words during development; **CONFIRMED** items are his direct statements,
**[ASSUMED]** items are working inferences that he or a playtest should
confirm. When in doubt, build for her, not for an imaginary general audience.

### Confirmed (Juan's words, do not drift from these)

- **Palette: pastel pinks, purples, and blues.** This is why the horror is
  pastel-on-darkness rather than grimdark. Locked into `CONFIG.palette`.
- **Loves horror.** Genre #1. The game should be spooky-cozy, with room to
  deepen (the displaced "Witching Hour" layer exists for exactly this).
- **Likes sci-fi.** Genre #2 — the parked "Starlight Signal" World 2 is the
  payoff vehicle when its time comes.
- **Cute anime girls** — Pretty-Cure-grade cute. Yuki (shy) and Rin (genki)
  are calibrated to this. "Girls so cute and pretty cure."
- **Uber-confident hot anime guys** — "gentlemen but confident AF…
  think Rengoku from Demon Slayer." Kazuma is Rengoku-grade booming honor;
  Ren is the smug counterpoint whose tail betrays him. Hot, never sleazy.
- **She knows Japanese** and plays Japanese dating games. Genre-native
  touches land with her (the 封 warding charms, hitodama flames, torii
  paths, Tokimeki-style highest-meter finale, *jama ga hairu* interrupted
  kisses). Get the references right; she'll notice.
- **The games she plays are mostly innocent: you build up to a kiss.**
  "Things like hand holding and stuff are intense moments." This is LAW
  (see CLAUDE.md locked decisions): the ladder is freed → befriended →
  hand-holding as the game's most intense beat → almost-kiss (interrupted)
  → the real kiss only at the very end. Blushing IS the content.
- **The interrupted-kiss / "definitely next time" trope is a direct hit** —
  Juan: "almost brings a tear to my eye." The finale is built on it.
- **Otome presentation is the target for how characters should look** —
  Juan: "Dress them all up like they are in the games she plays, otome…
  Pretty Cure cute dresses with detailing, pastels and flowers and
  pastries." That is v0.7's whole reason to exist.

### Working assumptions [ASSUMED — confirm in playtest]

- She'll enjoy *discovering* systems over being told about them (walk-up
  talking, springboard secrets, the 1-in-20 rainbow are all undiscoverable-
  on-purpose delights).
- The clone mystery ("why are there three Yukis who share one memory?")
  will read as intriguing rather than as a bug. Characters deflect
  questions about it; that's deliberate.
- Cozy difficulty is right: generous hearts, friendly healers, no fail
  states that destroy relationship progress permanently.

## What "finished" means — the 1.0 target [PROPOSED — Juan to ratify]

The handoff's goal is to take v0.4 → **a complete, playable gift**. Proposed
definition of done for 1.0 ("Cut the Last String"):

1. **Every character feels like a real route** — v0.5's conversation pools,
   memory callbacks (the mem data has been recording since v0.3), branching
   trees, multiple polished scenes each. Depth ordered by Juan's voice
   ranking (playtest.md, Big Two).
2. **The big beats have art** — v0.6's procedural event-CGs. The
   hand-holding CG is the acceptance test: if you can't tell they're
   holding hands, it isn't done.
3. **They look the part** — v0.7's otome costume pass.
4. **The caves & gifts layer** (Juan's direction, 2026-07-26): hidden caves
   in solid-looking geometry holding items that unlock secret scenes.
5. **The ending is real**: confront the puppeteer, the truth about the
   clones (never explained *until then*), and the kiss — earned,
   uninterrupted (unless the joke is better). Puppeteer's identity stays
   unspoiled in code and docs until built.
6. **Ship hygiene**: numbers corrected by real playtests (N menu), a sound
   pass, `window._game` + debug menu stripped, tags applied, one final
   version file + the launcher.

Anything beyond this list (World 2, jealousy, photo mode) is post-1.0 unless
Juan promotes it.

## Handoff orientation — read in this order

1. **VISION.md** (this file) — why, who, what done means.
2. **CLAUDE.md** — architecture law: locked decisions, core state, attitude
   bands, interaction matrix, watch list. *Do not violate the locked list.*
3. **design-doc.md** — Juan's v0.2 playtest compiled into law + the release
   plan. Historical §s 4–5 (v0.3/v0.4) are BUILT; §6–§8 are the future.
   Its [PROPOSED]-numbers warning still applies to everything.
4. **roadmap.md** — what's next, organized by blocker (buildable now /
   needs play data / needs Juan's ruling).
5. **playtest.md** — the open questions, deliberately short. The Big Two
   (voice ranking, band legibility) gate the most work.
6. **plan.md** — session-by-session history of how we got here.

### Operational notes for whoever picks this up

- **The game**: one self-contained HTML file per version
  (`midnight-crush-vX.Y-title.html`), zero assets, everything procedural.
  `index.html` is the launcher/Pages entry with an in-page version menu.
  Live at https://12code4.github.io/iso-city-builder/ (Pages, from `main`).
- **Verification convention**: every version ships with a headless
  playwright-core suite (Chromium at `/opt/pw-browsers/...`) driving
  `window._game` — the deliberate test surface — plus screenshot review.
  v0.4's suite covers 21 checks; keep this bar. The `N` debug menu is the
  human playtest instrument.
- **Process law** (CLAUDE.md): one branch per update, verbose versioned
  filenames, docs synced every release, granular commits, `main` = truth,
  definition of done includes Juan's review.
- **Known environment quirks**: cloud sessions cannot push git *tags*
  (remote 403s tag refs; branches are fine) — tags are queued for Juan's
  organizational pass. Two stray branches (`claude/v0.4-art-immersion`,
  `claude/v0.5-charm-critters`) belong to the SHELVED city builder, fork
  from its old line, and must never merge into `main`; their version
  numbers collide with this project's. The full city builder lives safely
  on branch `iso-city-builder` — leave it alone.
- **Decision rights**: Juan owns every number tagged [PROPOSED], the
  aggression spec (design-doc §9.2 — do not invent it), the jealousy
  mechanic ruling, and final review of each version. The romance-pacing
  and archetype-voice fences are not up for "improvement" by anyone.
