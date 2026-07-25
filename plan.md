# plan.md — Midnight Crush (living session log)

(The city builder's plan.md is preserved on branch `iso-city-builder`.)

## Current status

v0.2 "Broken Strings" built and headless-verified. **Awaiting Juan's playtest
review** (see playtest.md for the feedback sheet). Tagging + Witching Hour
work are blocked on that review and on Juan's behavior design doc.

## Session log

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
