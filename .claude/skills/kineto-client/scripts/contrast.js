// Usage: node contrast.js <colour> <colour> [<colour> ...]
// WCAG contrast of every pair. Body text needs 4.5, large headings and icons 3.
// Example: node contrast.js c79e41 94702a f5f4f0 ffffff
const cs = process.argv.slice(2).map(c => c.replace('#', ''));
if (cs.length < 2) { console.error('usage: node contrast.js <colour> <colour> [...]'); process.exit(1); }
const lum = h => [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
  .map(v => v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4))
  .reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0);
for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
  const [a, b] = [lum(cs[i]), lum(cs[j])].sort((x, y) => y - x);
  const r = (a + .05) / (b + .05);
  console.log(`#${cs[i]} on #${cs[j]}: ${r.toFixed(2)}${r >= 4.5 ? '  text ok' : r >= 3 ? '  large text and icons only' : '  too low'}`);
}
