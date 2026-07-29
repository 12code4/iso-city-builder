# design-doc.md — Juan's v0.2 playtest response & forward plan

**Status:** authored 2026-07-25 from Juan's v0.2 "Broken Strings" playtest.
**Supersedes:** the two items parked in README "Design backlog" — *dialog-trigger
rework* and *angry/neutral/friendly behavior design doc*. Both are answered here.

> **STATUS UPDATE (2026-07-26, handoff pass):** §4 (v0.3 "Close Quarters") and
> §5 (v0.4 "Open Road") are **BUILT and shipped**; §6–§8 (v0.5–v0.7) are the
> road ahead. The top-of-doc warning still applies in full: every [PROPOSED]
> number remains an unplayed guess — correct via the in-game `N` menu.
> §9.7's tag commands are deferred to Juan's organizational pass, by his call.
> Current blockers and next steps live in **roadmap.md**; the project's north
> star and player profile live in **VISION.md** (read that first).
> ### ⚠️ READ THIS FIRST — [PROPOSED] means GUESSED
>
> Juan ruled on the **design**. He did **not** rule on most of the **numbers**.
>
> Every value tagged **[PROPOSED]** in this document is a **guess by the person who
> compiled it**, inserted so the spec is buildable — *not* a decision by the game's
> owner. They carry **no authority**. They were never playtested. Several are
> almost certainly wrong.
>
> **Do not treat a [PROPOSED] number as settled just because it is written down
> here.** Implement it, expose it as a live CONFIG knob, surface it in the `N`
> debug menu (§4.7), and flag it to Juan as unconfirmed. The whole point of the
> debug menu is that these get corrected by playing, not by reasoning.
>
> The riskiest cluster is §4.5 — the 0–100 band boundaries and starting value.
> Those decide how fast the game warms up, which is the core feel of a dating sim.
> Getting them wrong will read as "the writing is bad" when the writing is fine.

**Owner of every decision below:** Juan.

Read this top to bottom before touching code. §1 is fences, §2 is new law,
§3 is the release plan, §4–§8 are the per-release specs, §9 is what's still open.

**Evidence lives in `design/mocks/`.** Two throwaway scripts and their screenshots
back the empirical claims made here. `zoomshot.js` in particular contains a
**working implementation of the §4.1 camera zoom** — read it before building that.
Neither script is part of the game; see `design/mocks/README.md`.

---

## 1. Fences — do not touch

These survived the playtest unchanged. Nothing in this document licenses altering
them, and no implementation may "fix" them in passing:

- **Romance pacing stays innocent.** freed → befriended → date climaxing in
  hand-holding → almost-kiss at the finale, interrupted. Nothing past a kiss, ever.
  Blushing IS the content. Reconfirmed this review.
- **Archetype voices.** Yuki shy, Rin genki, Kazuma Rengoku-grade booming honor,
  Ren smug with a traitorous tail, Ayame yandere-guardian.
- **The clone mystery is never explained.** Characters deflect. No code may
  lampshade it away. (§2.1 *depends* on the clones — it does not resolve them.)
- **CAST is data, not code.** Adding a character must require zero new engine
  logic. Every feature below must be expressible as CAST data + CONFIG knobs.
- **One chibi authority.** `drawChibi(g, look, opts)` draws every character at
  every size. New capability arrives as look flags and opts — never as
  per-character draw functions. This constrains §7 specifically.
- **The meter is the final call.** A body's attitude derives from the character's
  shared bond, never from a single conversation's result.
- **Repo hygiene.** One commit per milestone, tag every finished version, docs in
  sync every version, `main` is truth. Definition of done: verified → reviewed →
  docs updated → granular commits → pushed → tagged → merged.
- **Branch `iso-city-builder`** stays shelved and untouched.

---

## 2. New law from this review

### 2.1 Dialogue is once per BODY, not once per character

This is the keystone decision; several other features only make sense downstream
of it.

Each clone body you meet gets **one conversation**. Because all clones of a
character share one meter (already true — `bonds[id]` is per character, not per
body), the relationship **climbs as you cross the level**. You meet a Yuki, talk,
she warms up; three screens later you meet another Yuki who already remembers.

After a body's conversation is spent, **stomping it only bounces you**. That is
the springboard unlock — see §2.2.

This resolves the README's tabled dialog-trigger question. The chosen answer is
none of the four originally parked options; it is "dialog is a per-body resource
that is consumed once, after which the body becomes platforming furniture."

**Consequence — characters must remember.** `bonds[id]` currently stores only
`{bond, freed, romanced, dated}`. It must gain a memory record so later bodies can
reference history. Required callbacks, per Juan:

- *"you jumped on me N times"* — needs a lifetime bounce tally
- *"you killed me… but I was already dead"* — needs a lifetime fall-off tally
- *"last time you said ___"* — needs which choices were taken

`SAVE_KEY` must be bumped when this lands.

### 2.2 The bounce juggle

Bounces must be **consecutive without touching the ground**. This makes the
7-bounce fall a skill move, not an accident, and it means ordinary traversal
(bounce once, land) can never cost affection. That was a live playtest worry
(sheet Q7) and this design retires it.

- Counter lives **on the body**, not the character.
- **Touching the ground resets every body's counter.** **[PROPOSED]** — follows
  necessarily from "consecutive without touching the ground", but stated
  explicitly because the implementation needs a rule.
- Each body counts its own hits within one airborne chain, so juggling
  Rin → Ren → Rin is legal and builds both counters. **[PROPOSED]**
- Bounce 6 → an escalating annoyance line. Bounce 7 → a second line, then they
  fall.
- **5% chance** the pair is replaced by them counting out loud — "…six." then
  "SEVEN!" — instead of annoyance lines.
- The fall is **Mario-style, deliberately slowed for comedy**, and their parting
  comment **lingers at the point they left the screen** long enough to read.
- A 7-bounce fall **always costs affection**, in every state — *except* the 5%
  counting version, where they instead **flutter away with a rainbow effect and
  pay nothing**.

That exception is the design's best joke: 1-in-20 you get the funny version *and*
dodge the penalty. Do not "balance" it away.

### 2.3 Behavior bands

Answers the second tabled README item.

| Band | Speed | Contact | Notes |
| --- | --- | --- | --- |
| **Aggressive** | increased | damages player | increased aggression toward the player |
| **Neutral** | 80% of mind-controlled | damages player | otherwise identical to puppet behavior |
| **Friendly** | — | **safe** | the ONLY state where walking into them doesn't hurt |

- **Walking into a neutral body still damages you.** This explicitly answers the
  README's open question — the answer is no, neutral contact is not a dialog
  trigger.
- **Every band is bounceable** on the 6/7 juggle rules. Bouncing is universal;
  only its social cost varies.
- **Every band has passive lines** it may speak when the player is nearby. Ambient
  chatter is currently friendly-only (`index.html:898–905`) — it becomes
  all-band. Puppet-state lines should read as mind-controlled, not chatty.

### 2.4 The meter becomes 0–100 and hidden

- Range **0–100**, replacing the current small-int scale.
- **Hidden from the player.** No on-screen meter, no number.
- A **debug menu, toggled by pressing `N`**, exposes the real values — per-character
  meter, band, bounce tallies, memory flags. This is the playtest instrument;
  build it properly, it is not a throwaway.
- Dialogue choices carry **varied weights**, not the current uniform ±1.

Band boundaries and the starting value are **[PROPOSED]** below and need Juan's
confirmation — they are the single most tuning-sensitive numbers in the game.

### 2.5 No shrine gate; Mario-shaped levels

- **The shrine gate is removed.** No gated exit.
- Levels are traversed and **exited** in the Mario shape, dressed in this game's
  style. Romance accumulates as you travel rather than being a toll you pay.
- The game is **longer, with more levels**.
- **Ayame becomes a Lakitu-style recurring encounter** — she appears occasionally,
  not every level, hovering and interfering rather than sitting at the end as a
  gate boss.
- **Finale: parallel meters, highest wins.** The almost-kiss goes to whoever has
  the highest meter at the end of the game. This is the Tokimeki Memorial
  structure, and the game was already shaped for it — the old 3-romance gate was
  the anomaly, not this.

### 2.6 CGs, and where art effort goes

The hand-holding climax **does not currently land** (sheet Q16). The fix is not
better prose — it is a cutaway to composed art at climactic beats, the otome
**event CG**.

A procedural mock was built for this review from the existing `drawChibi` with
zero new art. Findings:

- **The frame layer works and is nearly free.** Warmed sky, moon bloom, bokeh,
  falling petals, a key light at the point of contact, letterbox bars, and a low
  wide translucent textbox — roughly 40 lines of canvas — do most of the "this is
  an otome CG" work on their own.
- **The figure layer is the gap.** `drawChibi` knows exactly one pose: standing,
  arms at sides, seen from the side. No lean, no reach, no joined hands, no
  looking at each other. The hand-holding CG could not depict hand-holding. The
  two beats that matter most are beats *about bodies touching* — the exact
  vocabulary the renderer lacks.
- At CG scale, flat primitives show their seams: the scarf becomes a plank, hair
  side-locks are hard rectangles.

**Decision: stay procedural.** Juan judged the mock strong enough to build on. The
art budget therefore goes to two things, both of which stay inside the one-chibi-
authority rule:

1. A **pose vocabulary** in `drawChibi` — lean, reach, joined hands, facing each
   other, sitting — expressed as `opts`, exactly like look flags.
2. A **CG level-of-detail mode** — curved hair instead of rectangles, actual
   hands, eye highlights — used only at CG/portrait scale.

Keep `drawChibi` for the platforming layer regardless: it animates, it's cheap,
and it runs many bodies at once with walk cycles, moods, string states and bump
spins. Drawn art is not being commissioned at this time.

**CGs are collectible.** A CG gallery is one of the genre's strongest hooks and
plugs into the endings gallery already on the roadmap.

### 2.7 The runnable file gets a verbose, versioned name

`index.html` is out. The runnable file is renamed each release to carry its
version and title, e.g. `midnight-crush-v0.3-close-quarters.html`, and the file
opens with a version-history comment block. **[PROPOSED]** — Juan asked for
"verbose titles for the runnable html which also documents the version history";
this covers both readings of that (name carries the version, header carries the
history). Confirm whether prior versions' files are also kept on disk so old
builds stay directly playable, or whether git tags are the only history.

Whatever is chosen, README and CLAUDE.md references must be updated in the same
commit, every release.

---

## 3. Release plan

Juan chose **feel first**. Sequence:

| Ver | Title | Contents |
| --- | --- | --- |
| **v0.3** | Close Quarters | zoom, stomp fix, bounce juggle, behavior bands, 0–100 meter, dialog-per-body, debug menu |
| **v0.4** | Open Road | gate removed, multi-level structure, level pass, view to 20 tiles, Ayame as recurring hazard, highest-meter finale |
| **v0.5** | Sweet Nothings | conversation pools, memory & callbacks, the large dialogue expansion, multiple scenes per character |
| **v0.6** | Picture Book | CG frame layer, pose vocabulary, LOD detail mode, CG gallery |
| **v0.7** | Dress Rehearsal | costume & detail pass — Pretty Cure dresses, pastels, flowers, pastries |

Titles are **[PROPOSED]**; rename freely. "The Witching Hour" and "Starlight
Signal" from the old roadmap are displaced — re-scope them after v0.4 lands.

**Why the 0–100 meter is in v0.3 and not v0.5:** v0.3 respecs the attitude bands
anyway. Speccing bands twice — once on the old int scale, once on 0–100 — is pure
waste. The *scale change* ships with the bands; the *dialogue expansion* that
exploits it ships in v0.5.

---

## 4. v0.3 "Close Quarters" — the feel patch

Ship this small and fast. It is the foundation for everything else and it makes
the next playtest trustworthy. **The level and the gate are untouched in v0.3.**

### 4.1 Camera zoom — new capability, not a resize

There is currently **no zoom in the game at all**. `index.html:528` sets
`W = canvas.width = innerWidth` and the world draws 1:1, so how much of the level
you see depends on the player's monitor — 53 of 150 tiles on a 1920px screen,
fewer on a laptop. Juan's "we see almost a third of the level" is a
1920px-monitor observation, and the resolution-dependence is itself a bug.

**Fix: define the view in tiles.** Add `CONFIG.viewTiles`. Compute a zoom factor
`Z = innerWidth / (CONFIG.viewTiles * CONFIG.tile)`, keep the canvas at device
size, set `W`/`H` to *world* units (`innerWidth / Z`, `innerHeight / Z`), and open
each frame with `ctx.setTransform(Z,0,0,Z,0,0)`. Every existing use of `W`/`H`
then keeps working unchanged, including the background parallax layers.

- **`CONFIG.viewTiles` default: 24 for v0.3.** Verified against the current level —
  at 24 tiles you see ~13.5 tiles of height and the row-6 platform with its heart
  pickup stays comfortably visible.
- **20 tiles is the target**, and Juan prefers how it looks. It moves in **v0.4**
  with the level pass, because at 20 tiles the visible height drops to ~11.25
  tiles and the existing row-6 platform sits at the edge of a blind upward leap.
- Keep it a live CONFIG knob so Juan can flip 20/24 during playtest without a code
  change.

**Two knock-ons that will break silently if missed:**

- `index.html:903` uses pixel `W` as the "is the player near enough to hear it"
  radius for ambient bubbles. With `W` now in world units this shrinks correctly —
  verify it still feels right rather than assuming.
- `index.html:1358` wraps bubble text at a hardcoded 170px. Re-check at zoom.

**Acceptance:** identical framing on a 1280px and a 1920px window; character
detail legibly larger; no parallax layer detached from the world.

### 4.2 Stomp detection — real bug, fix properly

`index.html:911`:

```js
const stomped = player.vy > 0 && player.prevBottom <= ch.y + 12;
```

Falling speed is clamped to 1100px/s (`index.html:829`), which at 60fps is
**~18px per frame** — larger than the 12px window. **At speed the player tunnels
clean through the stomp window in a single frame and it registers as a side
hit.** The faster you fall — i.e. the more committed the jump — the more likely
you eat damage for a stomp you actually landed. This is Juan's "the side hitbox
extends too far up" (playtest sheet Q3, flagged as mattering most).

**Fix:** replace the fixed window with a **swept check** against the path the
player travelled this frame, so any descent that crossed the character's top edge
counts as a stomp regardless of speed. Expose the tolerance as
`CONFIG.stompGrace` **[PROPOSED]** so it stays tunable.

**Acceptance:** a stomp landed from maximum fall speed onto a body registers as a
stomp 100% of the time, at every zoom level. Add a headless regression test at
terminal velocity — this class of bug returns silently.

### 4.3 Bounce juggle

Implement §2.2 in full. New knobs, all **[PROPOSED]** defaults:

| Knob | Default | Meaning |
| --- | --- | --- |
| `bounceWarn` | 6 | bounce that triggers the annoyance line |
| `bounceFall` | 7 | bounce that triggers the fall |
| `bounceCountChance` | 0.05 | chance of the count-out-loud variant |
| `bounceFallGravity` | 0.45× | slowed fall, for comedy |
| `bounceLingerS` | 4.0 | how long the parting comment stays readable |
| `bounceFallCost` | 6 | meter lost on a normal 7-bounce fall (0–100 scale) |

Lines live in CAST, per character, per archetype voice — not in engine code.

**Note for the implementer:** the existing friendly bump-off path
(`index.html:914–924`) is the ancestor of this system. Do not leave both alive.
The 7-bounce fall replaces bump-off as the way a body leaves the screen.

**Acceptance:** landing between bounces resets the counter; a 7-chain is
reproducibly achievable; the rainbow variant costs nothing and is visibly
distinct; the parting line is readable after the body is gone.

### 4.4 Behavior bands

Implement §2.3. Extend ambient lines to all bands. Preserve the existing rule that
attitude re-derives at interaction points only, never per frame.

**Still open — `CONFIG.attitude` needs values for what "increased aggression"
means beyond speed.** Candidates: chase persistence (how long they pursue after
losing you), chase range, a fear/flee radius for friendly bodies, damage. See §9.

### 4.5 Meter rescale to 0–100

Migrate the meter, bump `SAVE_KEY`.

> **Every number in this table is a guess.** None of it came from Juan and none of
> it has been played. This is the highest-risk table in the document — see the
> warning at the top. Build it, expose it, and get it corrected in playtest.

| Value | Proposal | Rationale |
| --- | --- | --- |
| floor / ceiling | 0 / 100 | — |
| starting value, freshly freed | 25 | you just cut their strings; they owe you something but don't know you |
| hostile band | 0–19 | |
| neutral band | 20–54 | |
| friendly band | 55–100 | |
| "love" flavour threshold | 80+ | drives bumpLove-style lines |
| date unlocks at | 55 | entering friendly earns the date |
| good dialogue choice | +4 to +8 | replaces uniform +1 |
| neutral choice | 0 | |
| bad choice | −3 to −10 | wrong answers should sting enough to be tempting |

`romanced` as a high-water mark stays, but with the gate gone (§2.5) it no longer
gates anything — it becomes date-eligibility plus finale ranking input.

### 4.6 Dialog once per body

Implement §2.1's trigger change. **Interim behaviour:** until conversation pools
land in v0.5, each body serves its character's existing scene-1 dialog. That is
acceptable and expected — do not build the pool early.

Delete the walk-up-to-talk-to-friends path only if it conflicts; otherwise leave
walk-up quips and healing intact, they tested well.

### 4.7 Debug menu (`N`)

Per §2.4. Shows per-character meter value and band, bounce tallies, memory flags,
and live CONFIG values. Gate it the same way `window._game` is gated — it goes
away before a public ship, but not before.

---

## 5. v0.4 "Open Road" — structure

- Remove the shrine gate and all `romancesNeeded` gating.
- Multi-level structure with reached exits; more levels; longer game.
- Level pass built for a tighter view; move `CONFIG.viewTiles` to **20**.
- Design levels that use the springboard: places reachable only by bouncing off a
  body, and secrets behind a juggle. This is the payoff for §2.2 — v0.3 builds the
  tech, v0.4 builds rooms that ask for it.
- Ayame reworked to a Lakitu-style recurring hazard, appearing on some levels only.
- Finale: highest meter at end of game receives the almost-kiss.

**Candidate, not yet approved — the Tokimeki jealousy mechanic.** In that game,
neglected characters notice and gossip, damaging your standing with everyone else.
The finale already has four spectators watching the almost-kiss; a game about
being watched on strings, where the people you sidelined talk to each other, is
thematically native. Flagged for Juan's decision, not scheduled.

---

## 6. v0.5 "Sweet Nothings" — affection & dialogue

- **Conversation pools.** Each *character* owns an ordered pool of conversations;
  each body you meet serves the next one you haven't seen. Adding bodies to a
  level then costs zero writing. Confirmed by Juan.
- **Memory & callbacks** per §2.1 — bounce tallies, fall tallies, past choices —
  and the lines that reference them, including the "you killed me, but I was
  already dead" beat.
- **Dialogue trees**, branching, not linear.
- **Much, much more dialogue**, with the varied meter weights from §4.5.
- **Multiple polished scenes per character**, which is what the extra levels and
  extra bodies exist to carry.

Sheet Q13 asked whether 3 questions per first-talk overstays. Unanswered — decide
during this release with real volume in hand.

---

## 7. v0.6 "Picture Book" — the CG system

Build per §2.6, in this order:

1. **Frame layer** — background, key light, bokeh, petals, letterbox, CG textbox
   placement, and the transition from normal dialogue into a CG and back. This is
   the cheap, high-yield part; it should exist before any figure work.
2. **Pose vocabulary** in `drawChibi` as `opts`. Minimum viable set: `lean`,
   `reach`, `hold-hands`, `face-each-other`. The hand-holding CG is the acceptance
   test — if a player can't tell they're holding hands, the pose set isn't done.
3. **CG detail mode** — curved hair, real hands, eye highlights, at CG scale only.
4. **CG gallery**, collectible, wired to the endings gallery.

Hard constraint: all of this arrives as `opts` and look flags on the single
`drawChibi`. No per-character and no per-scene draw functions.

---

## 8. v0.7 "Dress Rehearsal" — the costume pass

Juan: *"I really want these characters to look nice, these graphics are a bit too
plain… Pretty Cure cute dresses with detailing, pastels and flowers and pastries.
Dress them all up like they are in the games she plays, otome."*

- Detailing on dresses, pastel palette work, flowers, pastry motifs.
- Delivered as **look flags** on `drawChibi`, per §1. A new outfit must be a data
  change in CAST, never a new draw function.
- This lands after the zoom (§4.1), and that ordering is deliberate: at the
  current view size none of this detail is visible to a player. The zoom is what
  makes the costume pass worth doing.

---

## 9. Still open — Juan to rule

1. **Every number marked [PROPOSED]** — all of them are guesses, none are Juan's.
   See the warning at the top of this document. Most urgent: the 0–100 band
   boundaries and starting value (§4.5).
2. **What "increased aggression" means** for the aggressive band beyond raw speed
   (§4.4) — chase persistence, chase range, fear radius, damage.
   **Juan is authoring this himself.** Do not invent an answer, do not guess a
   default, and do not let it block the rest of v0.3 — build the band structure
   with speed as the only tell, leave the extra knobs stubbed, and wire his spec
   in when it lands.
3. **When bodies re-derive attitude** beyond dialog end / bump respawn / load. The
   third README question; currently unanswered and left as-is.
4. **Asset delivery** — moot while art stays procedural (§2.6), revisit if that
   changes.
5. **Versioned filenames** (§2.7) — confirm the scheme, and whether old versions
   stay on disk as playable files.
6. **The jealousy mechanic** (§5) — in or out.
7. **v0.2 tagging — DECIDED, but ⚠️ NOT YET APPLIED ON THE REMOTE.**
   Juan delegated the call; the ruling is **tag both**. Reasoning: the definition
   of done required a playtest review and this document is that review, so the
   hold is lifted; and v0.3 is about to make v0.2 hard to return to — `SAVE_KEY`
   bumps, the gate is deleted, the runnable file is renamed. Tagging preserves a
   playable snapshot of **exactly the build Juan playtested**, which is the
   version every finding in this document refers to.

   The session that authored this document **could not push tags** — the remote
   rejects tag refs with HTTP 403; it permits only the working branch. Someone
   with push rights must run:

   ```sh
   git tag -a v0.1-mc 4854759 -m "Midnight Crush v0.1 'First Night'"
   git tag -a v0.2-mc 33f6493 -m "Midnight Crush v0.2 'Broken Strings'"
   git push origin v0.1-mc v0.2-mc
   ```

   Until that runs, the repo still has **no tags at all** and the hygiene rule
   "tag every finished version" is unmet. Do not start v0.3 believing v0.2 is
   preserved — it isn't.

---

## 10. Playtest sheet — what got answered

Answered this round: Q3 (stomp reliability — real bug, §4.2), Q7 (accidental
bump-offs — retired by §2.2), Q16 (hand-holding doesn't land — §2.6), Q18 (wants a
longer game, more scenes per character), plus the two tabled README design
questions.

**Not yet answered, still live for the next playtest:** Q1–Q2 (jump/run feel),
Q4 (camera), Q5–Q6 (band legibility — can you tell the bands apart just by
watching?), Q8–Q10, Q11–Q15 (dialogue quality and voice ranking — decides who gets
content first), Q17, Q19–Q22 (horror and palette), Q23–Q26 (difficulty), Q27–Q30
(the mystery, the trailer moment, the one-thing-to-cut).

Q6 deserves a callout: *can a player tell the three bands apart just by watching a
body move?* With bands respecced in v0.3 and 80% vs increased speed as the only
current tell, this is the most likely thing to test badly next round. If the
answer is no, the bands need non-speed tells — posture, ambient line frequency,
string state — and that is cheap to add while §2.3 is being built.
