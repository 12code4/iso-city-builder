# playtest.md — v0.4 "Open Road" feedback sheet

Play at the Pages link, blind. **This sheet is short on purpose** — the old v0.2
sheet had 30 questions, which is exactly why it never got filled in. Everything
below is either (a) something no human has ever felt, or (b) an answer that
unblocks a build.

Mark ✅/❌/🤔 and scribble. Half-answers are fine.

---

## ⭐ The Big Two — answer these first

These two gate more work than everything else combined.

**1. Voice ranking.** Rank Yuki / Rin / Kazuma / Ren best→worst. Whose lines
made you actually smile? Whose fell flat?
→ *Decides who gets the big dialogue expansion first in v0.5. Nothing else
orders that work.*

```
1. ______  2. ______  3. ______  4. ______
```

**2. Band legibility.** Watching a character walk — with no icons, no dialog —
can you tell **friendly / free-thinking / hostile** apart?
→ *Right now speed is the main tell (0.8× vs 1.25×). If the answer is no, they
need non-speed tells (posture, chatter rate, string state). Cheap to add — but
only worth building if it actually fails.*

```
yes / no / only when they chase me
```

---

## 🆕 Never been felt by a human

All of this shipped since your last playtest. No data on any of it.

| Thing | What to notice |
| --- | --- |
| **Springboard bounce** | Bouncing off a freed body now lifts you a full jump + their height. Floaty? Uncontrollable? Just right? |
| **The 7-bounce juggle** | Funny or tedious? Did you ever hit the 1-in-20 where they count out loud and flutter off in a rainbow? |
| **Dialog once per body** | Does "this one already talked to me" read as intentional, or as broken dialog? |
| **Three nights** | Does hitting the lantern feel like a Mario world-clear? Any night that drags? |
| **20-tile zoom** | Too close? Can you see enough ahead to react? |
| **Ayame overhead (Night 2)** | Scary-fun or annoying? Are the falling charms readable in time? |
| **The swoon** (hand-hold) | *Re-test of the old Q16.* Does the climax land now, or still flat? |
| **The finale** | Did the winner feel *earned*? Did you know who it'd be before it said? |
| **Springboard secrets** | Did you find any? Did you even suspect they existed? |

---

## 🎛 The numbers (press **N** in-game)

Every one of these is a **guess** — nobody has ever corrected them by playing.
Nudge them live and tell me what felt right.

| Knob | Now | Notice |
| --- | --- | --- |
| `meter.friendlyMin` | 55 | Too easy/slow to make a friend? |
| `meter.hostileMax` | 19 | Do people turn hostile too readily? |
| `meter.start` | 25 | How warm is a stranger you just freed? |
| choice weights | +5/6/8, −4/−6/−8 | Does one good answer feel like enough? |
| `bounce.warn` / `.fall` | 6 / 7 | Right number of bounces before they leave? |
| `bounce.fallCost` | 6 | Does felling a friend sting enough? |
| `viewTiles` | 20 | 20 vs 24 — flip it and compare |

---

## 🐛 Bugs / parking

- Softlocks, stuck dialogs:
- Bodies stuck on geometry:
- Unfair deaths (pit placement, respawn):
- Mobile, if tested:
- Anything that made you go "huh?":

---

## ✅ Answered / retired — don't re-ask

| Q | Status |
| --- | --- |
| Q3 stomps registering as side-hits | **Fixed** (swept check). Confirm by never eating an undeserved hit. |
| Q7 accidental bump-offs cost affection | **Retired by design** — juggle counts only consecutive airborne bounces. |
| Q16 hand-holding doesn't land | **Swoon shipped** → re-test above. Full fix is still v0.6's CG/poses. |
| Q18 wants a longer game | **Half done** — three nights. "More scenes per character" is v0.5. |
| Q4 camera / Q8 respawn / Q17 kiss / Q23 pacing / Q24 boss | **Transformed** by the gate removal + juggle — restated in the tables above. |

Still live but lower priority (ask after the Big Two): jump/run feel, ally
healing discoverability, walk-up talking discoverability, horror & palette,
difficulty, the clone mystery, the trailer moment, one-thing-to-cut.
