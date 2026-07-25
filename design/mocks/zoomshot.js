// Mock the proposed zoom so Juan can eyeball 24 vs 20 tiles before we spec it.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const os = require('os');
// The runnable HTML gets renamed each release (design-doc.md §2.7) — override with MC_HTML.
const SRC = process.env.MC_HTML || path.join(__dirname, '..', '..', 'index.html');
const OUT = path.join(__dirname, 'shots');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'mc-zoom-'));
const raw = fs.readFileSync(SRC, 'utf8');

function variant(tiles) {
  if (tiles === null) return raw;                       // untouched = today's view
  let s = raw;
  s = s.replace(
    'let W = innerWidth, H = innerHeight;',
    `let W = innerWidth, H = innerHeight;\nconst VIEW_TILES = ${tiles};\nlet Z = 1;`
  );
  s = s.replace(
    'function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }',
    'function resize(){ canvas.width = innerWidth; canvas.height = innerHeight;\n' +
    '  Z = innerWidth / (VIEW_TILES * CONFIG.tile);\n' +
    '  W = innerWidth / Z; H = innerHeight / Z; }'
  );
  s = s.replace('function render(){', 'function render(){\n  ctx.setTransform(Z,0,0,Z,0,0);');
  return s;
}

// Two vantage points: a stretch of road with several bodies, and the platform climb.
const SHOTS = [
  { name: 'road',     tileX: 54 },   // Rin at 52, Ren at 57, gravestones 58/61
  { name: 'platform', tileX: 43 },   // platform at 40-45, heart at 42, Yuki at 44
];

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));

  for (const tiles of [null, 24, 20]) {
    const label = tiles === null ? 'current' : `${tiles}tiles`;
    const file = path.join(TMP, `mc-${label}.html`);
    fs.writeFileSync(file, variant(tiles));

    for (const shot of SHOTS) {
      await page.goto('file://' + file);
      await page.evaluate(() => {
        localStorage.clear();                      // fresh save: everyone still on strings
        document.getElementById('startBtn').click();
      });
      await page.waitForTimeout(300);
      await page.evaluate(tx => {
        const g = window._game;
        g.player.x = tx * g.CONFIG.tile;
        g.player.y = 6 * g.CONFIG.tile;            // drop in, let gravity seat them
      }, shot.tileX);
      await page.waitForTimeout(1400);             // land + camera settle + fog drift
      await page.screenshot({ path: path.join(OUT, `${shot.name}-${label}.png`) });
    }
  }

  await browser.close();
  console.log(errs.length ? 'PAGE ERRORS:\n' + errs.join('\n') : 'no page errors');
})();
