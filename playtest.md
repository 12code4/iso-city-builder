# playtest.md — v0.2 "Broken Strings" feedback sheet

Open `index.html`, play blind (don't re-read the README first), jot answers
here or just mark ✅/❌/🤔. Numbers in [brackets] are the CONFIG knobs your
answer would tune. If she plays: **don't explain anything** — where she gets
confused IS the data. Note her first unprompted laugh and anything she
screenshots; those are the truest signals we have.

## A. Platforming feel (first 2 minutes)

1. Jump: floaty, heavy, or right? Can you clear pits comfortably but not
   trivially? [jumpVel, gravity]
2. Run speed: does crossing the map feel brisk or like a commute? [moveSpeed]
3. Stomping: can you reliably land on heads at the new sprite size, or do you
   eat side-hits you feel you didn't deserve? (This one matters most.)
4. Camera: does it keep what you care about on screen? Any nausea/jitter?

## B. The attitude system

5. Hostile chase: scary-fun or unfair? Especially near pits. [hostileSpeedMult,
   chaseRange]
6. Can you actually TELL the three bands apart just by watching a body move
   (0.8× mellow vs normal vs 1.25× hunt)? If not, they need stronger tells.
7. Bump-off: did you do it by accident while just trying to traverse? How did
   losing affection for it feel — fair consequence or gotcha? [bumpBondLoss]
8. 30s respawn after a bump: too long (map feels empty) or too short (no
   weight)? [bumpRespawn]
9. Healing from friends: did you notice it happening? Cooldown feel? 45s.
   [healCooldown]
10. Walk-up talking: did you discover it without being told? Did the dialog
    ever open when you were just trying to walk past a friend? [talkCooldown]

## C. Dialog & writing

11. Rank the four: whose voice lands best/worst? (Decides who gets content
    first in v0.3.)
12. Choices: is the +1 answer too obvious? Is picking the "wrong" answer ever
    tempting for the reaction alone? (It should be.)
13. Length: are 3 questions per first-talk right, or does it overstay?
14. The wary regreet when you've hurt someone — does it feel earned?
15. Any line that made you cringe (bad cringe, not anime cringe). Flag it.

## D. Romance pacing (the heart of the game)

16. Does the hand-holding date climax actually LAND as intense? Did the
    build-up earn it?
17. The almost-kiss finale with four spectators: satisfying-frustrating (the
    goal) or just frustrating?
18. After finishing: do you WANT the third date / the real kiss? (If no, the
    ladder is broken regardless of anything else.)

## E. Horror & aesthetic

19. Is it spooky-cozy or did it tip into either "not spooky at all" or
    "actually stressful"? Where on that dial should v0.3's Shade sit?
20. Puppet strings + glazed eyes: did you understand the mind-control lore
    WITHOUT reading anything? What did you think the strings were?
21. Palette check (the pastel pinks/purples/blues): too dark, too washed, or
    right? Screenshot the prettiest moment you find.
22. Lightning flashes: atmosphere or annoyance? [lightningChance]

## F. Structure & difficulty

23. Time from start → gate open: felt like? (Target: a cozy 10–20 min first
    run.) Is 3 romances the right price? [romancesNeeded]
24. Boss fight: did losing hearts to wrong answers feel tense or cheap? Did
    you fail it at least once (intended)?
25. Deaths: did any death feel unfair (pit placement, respawn point)?
26. Did you find all 3 heart pickups without hunting?

## G. The mystery & the meta

27. When did you first notice there are multiple Yukis/Rins? What was your
    theory? (Don't tell her there IS an answer.)
28. Did any ambient bubble / quip make the town feel alive vs noisy?
    [ambientMinS/MaxS]
29. What would you show a friend first? (That's our trailer moment.)
30. One thing you'd cut, one thing you'd double down on. No essay — one line
    each.

## Parking spots for bugs

- Softlocks / dialog stuck open:
- Bodies stuck on geometry / walking in place:
- Bubbles unreadable or overlapping:
- Mobile (if tested): buttons reachable? pinch/scroll accidents?
- Anything that survived a reload that shouldn't have (or vice versa):
