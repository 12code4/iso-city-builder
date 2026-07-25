# plan.md — Midnight Crush (living session log)

(The city builder's plan.md is preserved on branch `iso-city-builder`.)

## Current status

v0.2 "Broken Strings" built and headless-verified. **Juan's playtest review is
in** — compiled as `design-doc.md`, which supersedes both tabled README backlog
items. Next build is **v0.3 "Close Quarters"** (design-doc.md §4): camera zoom,
swept stomp fix, bounce juggle, behavior bands, 0–100 hidden meter, dialog once
per body, debug menu. v0.2 tagging is still Juan's call (design-doc.md §9.7).

The old v0.3 "Witching Hour" / v0.4 "Starlight Signal" plan is displaced by the
new release plan in design-doc.md §3; re-scope those after v0.4 lands.

## Session log

- **2026-07-25 — Session 2 (playtest review → design doc).**
  - Compiled Juan's v0.2 playtest feedback into `design-doc.md` via interview.
  - Two code findings made during the review:
    - **The game has no zoom at all.** `W = canvas.width = innerWidth` and the
      world draws 1:1, so the visible slice of level depends on the player's
      monitor. Fix is to define the view in tiles (`CONFIG.viewTiles`).
    - **Stomp detection tunnels at speed.** The 12px window at `index.html:911`
      is smaller than one frame of travel at the 1100px/s fall clamp (~18px at
      60fps), so fast falls onto heads register as side hits. Needs a swept check.
  - Built two throwaway mocks (headless Chromium, not committed): a zoom
    comparison at 24/20 tiles, and a procedural "event CG" composed from the
    existing `drawChibi`. The CG mock established that the frame layer (lighting,
    bokeh, petals, letterbox, textbox) is nearly free while the figure layer has
    no pose vocabulary — which is why v0.6 targets poses rather than drawn art.
  - Headline decisions: dialogue once per body; bounce juggle (6/7, consecutive,
    5% rainbow); shrine gate removed for Mario-shaped levels; Ayame becomes a
    Lakitu-style recurring hazard; parallel meters, highest wins at the finale;
    meter goes 0–100 and hidden behind an `N` debug menu; art stays procedural.

- **2026-07-25 — Session 1 (everything so far).**
  - v0.1 "First Night": core platformer (run/jump/one-way platforms/pits),
    stomp-to-talk dating system, 5-character cast with full dialog trees,
    hearts/damage, shrine gate (3 romances), Ayame boss dialog battle,
    pastel-horror night, mobile touch, WebAudio SFX. Headless-verified.
  - v0.2 "Broken Strings" in three chunks:
    1. Puppeteer lore (visible strings + glazed puppet eyes + string-snap),
       shared persistent bonds across character clones (localStorage), date
       scenes with hand-holding climaxes, almost-kiss finale, archetype
       voice pass (Pretty-Cure girls, Rengoku Kazuma).
    2. Attitude system per Juan's spec: friendly / neutral (0.8×) / hostile
       (1.25× + chase) bands, meter-is-final-call, Mario-style bump-offs
       with archetype quotes + affection loss + respawn, walk-up talking,
       ambient speech bubbles, wary regreets.
    3. Character visual pass: arms, happy-bounce, sailor uniform, wagging
       tail, cape collar + medallion, spirit aura, hitodama orbs, lashes,
       sharp brows, player scarf, 1.28× sprites.
  - Repo handover: city builder shelved to branch `iso-city-builder`;
    Midnight Crush takes over main. Docs rewritten for this project.
  - Design decisions of record this session:
    - Walk-up = how you talk to friends (stomping a friend = rude bump-off).
    - `romanced` is a high-water mark; gate progress never regresses.
    - Bumped bodies respawn (30s) rather than dying permanently.
    - Attitude derives at interaction points only, not per frame.
    - Interrupted-kiss finale is the correct genre ending; real kiss is
      final-version content.
  - Tabled (README backlog): dialog-trigger rework (springboard tech),
    behavior design doc (owner: Juan).

## Verification notes (v0.2)

Headless Chromium (playwright-core) runs covering: physics (jump arc, pit
respawn), full dialog routes (romance / rejection / redemption), clone bond
sharing across bodies, cumulative bond across conversations, date routing +
completion, quips, reload persistence + reset link, ally healing, attitude
bands with exact speed checks (44 = 0.8×, 69 = 1.25×), hostile chase, bump-off
lifecycle (spin → offscreen → hidden), walk-up date trigger, speech bubbles.
No console errors in any run. Screenshots reviewed for: palette, strings,
puppet eyes, bubbles, full-cast lineup, portrait detail.
