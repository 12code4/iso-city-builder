# design/mocks — throwaway experiments, NOT part of the game

These two scripts produced the screenshots that `design-doc.md` argues from.
They are **evidence, not tooling**. Nothing here ships, nothing here is
maintained, and the game does not depend on any of it. Midnight Crush is still
one self-contained HTML file with zero dependencies — that rule is untouched.

Both scripts patch a **copy** of the game in a temp dir and drive it with headless
Chromium. The original file is never modified.

## Running them

```sh
npm i playwright-core          # the only dependency; do not add it to the game
node zoomshot.js               # → shots/road-*.png, shots/platform-*.png
node cgshot.js                 # → shots/cg-wide.png, shots/cg-close.png
```

Both patch the game **by exact string match**, so they break the moment those
lines change — and `design-doc.md` §2.7 renames the runnable file outright. Point
them at the new name with `MC_HTML=... node zoomshot.js`. If a patch silently
stops matching you get an unzoomed screenshot rather than an error; check that the
output actually looks different before trusting it.

## zoomshot.js — the camera zoom (design-doc.md §4.1)

Worth reading before implementing v0.3's zoom: **this script contains a working
implementation of it.** The whole change is three string replacements:

1. Declare `VIEW_TILES` and a zoom factor `Z`.
2. In `resize()`, keep the canvas at device size but make `W`/`H` **world** units:
   `Z = innerWidth / (VIEW_TILES * CONFIG.tile)`, then `W = innerWidth / Z`.
3. Open `render()` with `ctx.setTransform(Z,0,0,Z,0,0)`.

The reason it's so small is the finding: because `W`/`H` become world units rather
than pixels, every existing use of them keeps working untouched — camera clamp,
parallax stars, moon, hills, fog, vignette. No other renderer line changes. Ran
clean at all three zoom levels.

Shots are two vantage points (tile 54 on the road, tile 43 at the platform climb)
at the current view, 24 tiles and 20 tiles.

`platform-*.png` caught something unplanned: the player drops onto Yuki and dialog
opens mid-traverse — a picture of exactly the problem §2.1 exists to fix.

## cgshot.js — the procedural event CG (design-doc.md §2.6, §7)

Composes a full-screen romance CG from the **existing** `drawChibi`, no new art.
Two patches: expose `drawChibi`/`CAST` on `window`, and add
`if (window._cgMode) return;` to `render()` so the game loop stops repainting over
the composition.

The composition order in `compose()` **is** the frame layer §7.1 asks for, and it
is the cheap high-yield part — steps 1–5 and 7–9 are roughly 40 lines of canvas:

1. sky gradient warmed toward pink (romance beat, not a horror one)
2. moon + bloom halo
3. bokeh circles at low alpha
4. hill silhouette + ground
5. radial key light centred on the point of contact
6. **the figures** — `drawChibi` at large scale
7. falling petals
8. vignette, then letterbox bars
9. low wide translucent textbox

Step 6 is the part that failed, and that failure is why v0.6 targets a **pose
vocabulary** rather than drawn art: `drawChibi` knows one pose — standing, arms at
sides, seen from the side. The hand-holding CG could not depict hand-holding. The
glow and rising hearts at the hand position are the script trying to fake it, and
the wide shot shows that faking it doesn't read.

Also visible at CG scale: the scarf becomes a plank, hair side-locks are hard
rectangles. Faces, though, hold up well — see `cg-close.png`.

The HUD hearts and "0/3" in the shots are DOM overlays the script doesn't hide;
ignore them.

## shots/

~4 MB of PNG. Kept lossless deliberately — several double as palette references
(playtest sheet Q21), and JPEG artifacts on pastel gradients would defeat that.
