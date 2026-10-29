// Usage: node photos.js <photos.json> <out-dir>
// photos.json (src paths are relative to the json file):
//   { "jobs": [ { "name": "masa-ventuze", "src": "raw/m09.jpg", "ratio": "4/5", "x": 0.5, "y": 0.62 } ],
//     "og": "fb/coperta.png" }
// ratio crops to width/height ("4/5", "3/2", 1.5); leave it out to keep the whole frame.
// x and y (0..1) place the crop: 0 = left/top edge, 1 = right/bottom edge.
// Each job writes <name>-800.webp plus <name>-<w>.webp at the full width (capped at 1600),
// then prints the src, srcset and size attributes to paste. "og" makes og.jpg at 1200x630.
const sharp = require('sharp');
const fs = require('fs'), path = require('path');
const [jobsF, outDir] = process.argv.slice(2);
if (!outDir) { console.error('usage: node photos.js <photos.json> <out-dir>'); process.exit(1); }
const cfg = JSON.parse(fs.readFileSync(jobsF, 'utf8'));
const base = path.dirname(path.resolve(jobsF));
const num = r => typeof r === 'string' && r.includes('/') ? r.split('/')[0] / r.split('/')[1] : +r || 0;
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  for (const j of cfg.jobs || []) {
    const src = path.resolve(base, j.src);
    const meta = await sharp(src).metadata();
    let img = sharp(src).rotate().flatten({ background: '#ffffff' }), w = meta.width, h = meta.height;
    const ratio = num(j.ratio);
    if (ratio) {
      let cw = w, ch = Math.round(w / ratio);
      if (ch > h) { ch = h; cw = Math.round(h * ratio); }
      const left = Math.round((w - cw) * (j.x ?? .5)), top = Math.round((h - ch) * (j.y ?? .5));
      img = img.extract({ left, top, width: cw, height: ch });
      w = cw; h = ch;
    }
    const buf = await img.toBuffer();
    const widths = w >= 800 ? [...new Set([800, Math.min(1600, w)])] : [w];
    const made = [];
    for (const s of widths) {
      const o = await sharp(buf).resize({ width: s }).webp({ quality: s > 800 ? 62 : 70, effort: 6 }).toFile(`${outDir}/${j.name}-${s}.webp`);
      made.push({ s, w: o.width, h: o.height, kb: Math.round(o.size / 1024) });
    }
    const first = made[0];
    console.log(`${j.name}: ${made.map(m => `${m.w}x${m.h} ${m.kb}KB`).join(', ')}`);
    console.log(`  src="img/${j.name}-${first.s}.webp" srcset="${made.map(m => `img/${j.name}-${m.s}.webp ${m.w}w`).join(', ')}" width="${first.w}" height="${first.h}"`);
    if (w < 800) console.log('  NOTE: source is only ' + w + ' px wide');
  }
  if (cfg.og) {
    await sharp(path.resolve(base, cfg.og)).flatten({ background: '#ffffff' }).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82, mozjpeg: true }).toFile(outDir + '/og.jpg');
    console.log('og.jpg 1200x630 from', cfg.og);
  }
})().catch(e => { console.error(e.message); process.exit(1); });
