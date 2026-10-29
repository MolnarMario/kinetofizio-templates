// Usage: node logo.js <logo.png|jpg> <out-dir> [--on-dark #f4efe4] [--dark-below 0.12] [--no-mark]
// The logo has to sit on white or near-white, as Facebook profile pictures usually do.
// Writes to <out-dir>:
//   logo.png              whole logo, transparent, 640 px wide
//   semn.png              the mark alone (the part above the gap over the wordmark), 240 px tall
//   semn-deschis.png      the mark with its dark parts recoloured, for dark backgrounds
//   favicon.png           64 px, mark on white
//   apple-touch-icon.png  180 px, mark on white
//   preview-logo.png      check image: semn.png on cream, semn-deschis.png on near-black. Don't publish it.
// and prints the main colours with their contrast against white. Open preview-logo.png every time:
// the gap search guesses where the mark ends, and --dark-below decides which colours turn light on dark.
// If a dark accent (deep gold, say) turned light too, lower --dark-below; if a dark part stayed dark, raise it.
const sharp = require('sharp');
const fs = require('fs');
const args = process.argv.slice(2);
const [inF, outDir] = args;
if (!outDir) { console.error('usage: node logo.js <logo> <out-dir> [--on-dark #f4efe4] [--dark-below 0.12] [--no-mark]'); process.exit(1); }
const flag = k => { const i = args.indexOf(k); return i < 0 ? null : args[i + 1]; };
const onDark = (flag('--on-dark') || '#f4efe4').replace('#', '');
const darkRGB = [0, 2, 4].map(i => parseInt(onDark.slice(i, i + 2), 16));
const darkBelow = +(flag('--dark-below') || .12);
const noMark = args.includes('--no-mark');
const lum = (r, g, b) => {
  const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
};
const hex = p => '#' + p.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const { data, info } = await sharp(inF).flatten({ background: '#ffffff' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, out = Buffer.alloc(W * H * 4);
  let minx = W, miny = H, maxx = 0, maxy = 0;
  const buckets = new Map();
  for (let i = 0; i < W * H; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    // GIMP-style colour to alpha against white
    const a = Math.max(255 - r, 255 - g, 255 - b) / 255;
    let R = 255, G = 255, B = 255;
    if (a > 0) { R = 255 - (255 - r) / a; G = 255 - (255 - g) / a; B = 255 - (255 - b) / a; }
    const A = a < .04 ? 0 : a;
    out[i * 4] = R; out[i * 4 + 1] = G; out[i * 4 + 2] = B; out[i * 4 + 3] = Math.round(A * 255);
    if (A > 0) {
      const x = i % W, y = (i / W) | 0;
      if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
    }
    // colour sample: anything at least half covered. A threshold near 1 would skip mid-tone colours
    // entirely (green #3d544e only reaches a = 0.76 against white)
    if (a >= .5) {
      const k = (r >> 4) << 8 | (g >> 4) << 4 | (b >> 4);
      const e = buckets.get(k) || { n: 0, r: 0, g: 0, b: 0 };
      e.n++; e.r += r; e.g += g; e.b += b; buckets.set(k, e);
    }
  }
  if (minx > maxx) throw new Error('nothing found on the white background');
  // merge neighbouring buckets into clusters, biggest first, so one colour doesn't show up five times
  const clusters = [];
  for (const e of [...buckets.values()].sort((p, q) => q.n - p.n)) {
    const c = [e.r / e.n, e.g / e.n, e.b / e.n];
    const near = clusters.find(k => Math.hypot(k.c[0] - c[0], k.c[1] - c[1], k.c[2] - c[2]) < 48);
    if (near) { const n = near.n + e.n; near.c = near.c.map((v, i) => (v * near.n + c[i] * e.n) / n); near.n = n; }
    else clusters.push({ c, n: e.n });
  }
  const solid = clusters.reduce((s, k) => s + k.n, 0);
  console.log('main colours (pixels at least half covered):');
  clusters.sort((p, q) => q.n - p.n).filter(k => k.n / solid > .01).slice(0, 6).forEach(k => {
    console.log(' ', hex(k.c), (100 * k.n / solid).toFixed(1) + '%', 'contrast on white', (1.05 / (lum(...k.c) + .05)).toFixed(2));
  });

  const opaque = (x, y) => out[(y * W + x) * 4 + 3] > 10;
  const rowEmpty = y => { for (let x = minx; x <= maxx; x++) if (opaque(x, y)) return false; return true; };
  // the widest run of empty rows between 30% and 90% of the logo height is taken as the gap over the wordmark
  const bh = maxy - miny + 1;
  let gap = null, run = 0;
  for (let y = miny + Math.round(bh * .3); y < miny + bh * .9; y++) {
    if (rowEmpty(y)) { run++; if (!gap || run > gap.len) gap = { start: y - run + 1, len: run }; } else run = 0;
  }
  const useMark = !noMark && gap && gap.len >= Math.max(2, bh * .015);
  console.log('logo box', minx, miny, maxx, maxy, useMark ? 'mark ends at y=' + (gap.start - 1) + ' (gap ' + gap.len + ' px)' : 'no gap, mark = whole logo');

  const buf = await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  const pad = 6;
  const box = (x0, y0, x1, y1) => {
    const left = Math.max(0, x0 - pad), top = Math.max(0, y0 - pad);
    return { left, top, width: Math.min(W, x1 + pad + 1) - left, height: Math.min(H, y1 + pad + 1) - top };
  };
  await sharp(buf).extract(box(minx, miny, maxx, maxy)).resize({ width: 640 }).png().toFile(outDir + '/logo.png');

  let m = { x0: minx, x1: maxx, y1: maxy };
  if (useMark) {
    m = { x0: W, x1: 0, y1: miny };
    for (let y = miny; y < gap.start; y++) for (let x = minx; x <= maxx; x++) if (opaque(x, y)) {
      if (x < m.x0) m.x0 = x; if (x > m.x1) m.x1 = x; m.y1 = y;
    }
  }
  const mark = await sharp(buf).extract(box(m.x0, miny, m.x1, m.y1)).png().toBuffer();
  await sharp(mark).resize({ height: 240 }).png().toFile(outDir + '/semn.png');

  // for dark backgrounds: colours darker than --dark-below take the light colour, the rest keeps its colour.
  // 0.12 splits KineticFit's green (luminance 0.08) from the dark end of its gold gradient (0.16)
  const raw = await sharp(mark).raw().toBuffer({ resolveWithObject: true });
  const d = raw.data;
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 0 && lum(d[i], d[i + 1], d[i + 2]) < darkBelow) { d[i] = darkRGB[0]; d[i + 1] = darkRGB[1]; d[i + 2] = darkRGB[2]; }
  await sharp(d, { raw: raw.info }).resize({ height: 240 }).png().toFile(outDir + '/semn-deschis.png');

  const square = async (size, padPct, file) => {
    const inner = Math.round(size * (1 - 2 * padPct));
    const fit = await sharp(mark).resize({ width: inner, height: inner, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } }).composite([{ input: fit, gravity: 'center' }]).png().toFile(file);
  };
  await square(180, .1, outDir + '/apple-touch-icon.png');
  await square(64, .04, outDir + '/favicon.png');
  const light = await sharp(outDir + '/semn.png').toBuffer(), dark = await sharp(outDir + '/semn-deschis.png').toBuffer();
  const mw = (await sharp(light).metadata()).width;
  const panel = (bg, img) => sharp({ create: { width: mw + 40, height: 280, channels: 3, background: bg } }).composite([{ input: img, left: 20, top: 20 }]).png().toBuffer();
  await sharp({ create: { width: 2 * mw + 80, height: 280, channels: 3, background: '#000000' } })
    .composite([{ input: await panel('#f5f4f0', light), left: 0, top: 0 }, { input: await panel('#131b18', dark), left: mw + 40, top: 0 }])
    .png().toFile(outDir + '/preview-logo.png');
  console.log('wrote logo.png, semn.png, semn-deschis.png, favicon.png, apple-touch-icon.png, preview-logo.png to', outDir);
})().catch(e => { console.error(e.message); process.exit(1); });
