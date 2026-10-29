// Usage: node cut.js <screenshot.png> <chunk-height> <out-prefix> [scale]
// Cuts a tall full-page screenshot into chunks you can read, and drops the blank strip at the bottom.
// Example: node cut.js shots/axa-d.png 1400 shots/c-axa-d 0.6  ->  shots/c-axa-d-01.jpg, -02.jpg, ...
const sharp = require('sharp');
const [file, chunkH, prefix, scale = '1'] = process.argv.slice(2);
if (!prefix) { console.error('usage: node cut.js <screenshot.png> <chunk-height> <out-prefix> [scale]'); process.exit(1); }
(async () => {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, rowEq = (a, b) => { for (let x = 0; x < W * 3; x++) if (data[a * W * 3 + x] !== data[b * W * 3 + x]) return false; return true; };
  // the last row that differs from the bottom row is where the page content ends
  let end = info.height - 1; while (end > 0 && rowEq(end, info.height - 1)) end--;
  const H = Math.min(info.height, end + 2), ch = +chunkH; let n = 0;
  for (let y = 0; y < H; y += ch) {
    const h = Math.min(ch, H - y);
    await sharp(file).extract({ left: 0, top: y, width: W, height: h }).resize({ width: Math.round(W * +scale) }).jpeg({ quality: 80 }).toFile(`${prefix}-${String(++n).padStart(2, '0')}.jpg`);
  }
  console.log(file, 'content height', H, 'chunks', n);
})().catch(e => { console.error(e.message); process.exit(1); });
