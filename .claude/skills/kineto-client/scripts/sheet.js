// Usage: node sheet.js <image-dir> <out.jpg>
// Contact sheet of every jpg/png/webp in a folder, each tile labelled with file name and size.
// Look at it to pick photos instead of opening twenty files one by one.
const sharp = require('sharp');
const fs = require('fs'), path = require('path');
const [dir, out] = process.argv.slice(2);
if (!out) { console.error('usage: node sheet.js <image-dir> <out.jpg>'); process.exit(1); }
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
(async () => {
  const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  if (!files.length) throw new Error('no images in ' + dir);
  const W = 360, H = 270, cols = 6, rows = Math.ceil(files.length / cols);
  const comps = [];
  for (let i = 0; i < files.length; i++) {
    const f = path.join(dir, files[i]);
    const meta = await sharp(f).metadata();
    const tile = await sharp(f).resize(W, H, { fit: 'contain', background: '#222' }).toBuffer();
    const label = Buffer.from(`<svg width="${W}" height="30"><rect width="${W}" height="30" fill="rgba(0,0,0,.7)"/><text x="8" y="21" font-size="18" fill="#fff" font-family="Arial">${esc(files[i])} ${meta.width}x${meta.height}</text></svg>`);
    const x = (i % cols) * W, y = Math.floor(i / cols) * H;
    comps.push({ input: tile, left: x, top: y }, { input: label, left: x, top: y });
  }
  await sharp({ create: { width: W * cols, height: H * rows, channels: 3, background: '#000' } }).composite(comps).jpeg({ quality: 80 }).toFile(out);
  console.log(out, files.length, 'images');
})().catch(e => { console.error(e.message); process.exit(1); });
