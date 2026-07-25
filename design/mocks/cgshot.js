// Procedural "event CG" mock — composed from the EXISTING drawChibi, no new art.
// Point: show Juan how far the chibi style stretches before committing to drawn CGs.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const os = require('os');
// The runnable HTML gets renamed each release (design-doc.md §2.7) — override with MC_HTML.
const SRC = process.env.MC_HTML || path.join(__dirname, '..', '..', 'index.html');
const OUT = path.join(__dirname, 'shots');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'mc-cg-'));
let src = fs.readFileSync(SRC, 'utf8');
src = src.replace('function render(){', 'function render(){\n  if (window._cgMode) return;');
src = src.replace('window._game = {', 'window._drawChibi = drawChibi; window._CAST = CAST;\nwindow._game = {');
const file = path.join(TMP, 'mc-cg.html');
fs.writeFileSync(file, src);

const PLAYER_LOOK = { hair:'#a894e0', style:'wild', skin:'#f2dcc4', outfit:'#b25a80',
  eye:'#7ec8c0', scarf:'#ffd6a0' };

// Everything below runs in the page, where drawChibi lives.
function compose({ mode, playerLook }) {
  const c = document.getElementById('game');
  const g = c.getContext('2d');
  const W = c.width, H = c.height;
  const draw = window._drawChibi;
  const yuki = window._CAST.yuki.look;
  g.setTransform(1, 0, 0, 1, 0, 0);

  // --- night sky, warmed toward pink: this is a romance beat, not a horror one
  const sky = g.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#140c2b'); sky.addColorStop(0.55, '#2d1a4e'); sky.addColorStop(1, '#4a2350');
  g.fillStyle = sky; g.fillRect(0, 0, W, H);

  // moon + bloom
  g.fillStyle = '#f0e6ff'; g.globalAlpha = 0.1;
  g.beginPath(); g.arc(W * 0.8, H * 0.2, 210, 0, 7); g.fill();
  g.globalAlpha = 1; g.fillStyle = '#eef3ff';
  g.beginPath(); g.arc(W * 0.8, H * 0.2, 92, 0, 7); g.fill();
  g.fillStyle = '#c9d6f7';
  g.beginPath(); g.arc(W * 0.8 - 28, H * 0.2 - 16, 14, 0, 7); g.fill();
  g.beginPath(); g.arc(W * 0.8 + 20, H * 0.2 + 24, 10, 0, 7); g.fill();

  // bokeh — the cheap trick every otome CG uses to sell depth
  for (let i = 0; i < 46; i++) {
    const bx = (i * 271.7) % W, by = (i * 163.3) % (H * 0.85), r = 6 + (i % 5) * 11;
    g.globalAlpha = 0.05 + (i % 4) * 0.022;
    g.fillStyle = i % 3 ? '#ffb8dd' : '#b9d4ff';
    g.beginPath(); g.arc(bx, by, r, 0, 7); g.fill();
  }
  g.globalAlpha = 1;

  // hill silhouette + ground
  g.fillStyle = '#1a1036';
  g.beginPath(); g.moveTo(0, H);
  for (let x = 0; x <= W; x += 40) g.lineTo(x, H * 0.62 + Math.sin(x * 0.0043) * 46);
  g.lineTo(W, H); g.fill();
  g.fillStyle = '#120a26'; g.fillRect(0, H * 0.9, W, H * 0.1);

  // warm key light blooming from the point where they touch
  const key = mode === 'wide' ? { x: 800, y: 660 } : { x: 800, y: 430 };
  const kg = g.createRadialGradient(key.x, key.y, 0, key.x, key.y, 460);
  kg.addColorStop(0, '#ff9ecd44'); kg.addColorStop(1, '#ff9ecd00');
  g.fillStyle = kg; g.fillRect(0, 0, W, H);

  if (mode === 'wide') {
    // --- the hand-holding climax, cinematic two-shot
    const s = 14, feet = 800;
    g.save(); g.translate(660, feet);
    draw(g, playerLook, { s, facing: 1, walk: 0, mood: 'happy' });
    g.restore();
    g.save(); g.translate(940, feet);
    draw(g, yuki, { s, facing: -1, walk: 1.2, mood: 'love', floaty: true });
    g.restore();

    // joined hands — the beat the whole scene exists for
    const hx = 800, hy = feet - 150;
    const hgl = g.createRadialGradient(hx, hy, 0, hx, hy, 120);
    hgl.addColorStop(0, '#ffd9ec99'); hgl.addColorStop(1, '#ffd9ec00');
    g.fillStyle = hgl; g.beginPath(); g.arc(hx, hy, 120, 0, 7); g.fill();
    g.fillStyle = '#ff8fc4';
    for (let i = 0; i < 5; i++) {
      const a = -1.9 + i * 0.34, d = 90 + i * 26;
      g.globalAlpha = 0.75 - i * 0.11;
      g.font = `${26 - i * 3}px sans-serif`; g.textAlign = 'center';
      g.fillText('♥', hx + Math.cos(a) * d * 0.5, hy + Math.sin(a) * d);
    }
    g.globalAlpha = 1;
  } else {
    // --- the almost-kiss, tight framing
    const s = 22, feet = 1060;
    g.save(); g.translate(600, feet);
    draw(g, playerLook, { s, facing: 1, walk: 0, mood: 'happy' });
    g.restore();
    g.save(); g.translate(1000, feet);
    draw(g, yuki, { s, facing: -1, walk: 1.2, mood: 'love', floaty: true });
    g.restore();
  }

  // falling petals
  for (let i = 0; i < 34; i++) {
    const px = (i * 397.1) % W, py = (i * 233.7) % H;
    g.save(); g.translate(px, py); g.rotate(i * 0.7);
    g.globalAlpha = 0.5; g.fillStyle = i % 2 ? '#ffc2de' : '#e5d0ff';
    g.beginPath(); g.ellipse(0, 0, 7, 3.4, 0, 0, 7); g.fill();
    g.restore();
  }
  g.globalAlpha = 1;

  // vignette + letterbox — cheap cinema, very otome
  const vg = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.95);
  vg.addColorStop(0, '#0000'); vg.addColorStop(1, '#07031499');
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
  g.fillStyle = '#000'; g.fillRect(0, 0, W, 44); g.fillRect(0, H - 44, W, 44);

  // dialogue box, otome placement: low, wide, translucent
  const bx = 150, by = H - 250, bw = W - 300, bh = 150;
  g.fillStyle = '#1b1030dd';
  g.beginPath(); g.roundRect(bx, by, bw, bh, 18); g.fill();
  g.strokeStyle = '#ff9ecd88'; g.lineWidth = 2; g.stroke();
  g.textAlign = 'left';
  g.fillStyle = '#ff9ecd'; g.font = 'bold 27px sans-serif';
  g.fillText('Yuki', bx + 34, by + 48);
  g.fillStyle = '#f0e8ff'; g.font = '23px sans-serif';
  const line = mode === 'wide'
    ? ['*her hand is freezing, and it does not let go*', 'Eighty years. Nobody… nobody ever held it.']
    : ['*she leans in. the whole town is watching. she does not', 'appear to care in the slightest*'];
  line.forEach((t, i) => g.fillText(t, bx + 34, by + 92 + i * 32));
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));

  for (const mode of ['wide', 'close']) {
    await page.goto('file://' + file);
    await page.evaluate(() => { localStorage.clear(); document.getElementById('startBtn').click(); });
    await page.waitForTimeout(250);
    await page.evaluate(() => { window._cgMode = true; });
    await page.waitForTimeout(120);
    await page.evaluate(compose, { mode, playerLook: PLAYER_LOOK });
    await page.screenshot({ path: path.join(OUT, `cg-${mode}.png`) });
  }

  await browser.close();
  console.log(errs.length ? 'PAGE ERRORS:\n' + errs.join('\n') : 'no page errors');
})();
