// Usage: node check.js <client-folder>
// Checks every index.html in the client folder before you commit. Exits 1 on errors.
// Errors: template placeholders, em dashes, curly quotes, ş/ţ with a cedilla, missing image files, srcset widths that
// don't match the file, <img> without alt, #links to ids that don't exist, broken JSON-LD, no noindex.
// Warnings: "Exemplu", template stock photos still in use, more than one phone number, DE CONFIRMAT count.
const sharp = require('sharp');
const fs = require('fs'), path = require('path');
const dir = process.argv[2];
if (!dir) { console.error('usage: node check.js <client-folder>'); process.exit(1); }
const repo = path.resolve(__dirname, '../../../..');
const stock = new Set();
for (const v of fs.readdirSync(repo).filter(d => d.startsWith('varianta-'))) {
  const d = path.join(repo, v, 'img');
  if (fs.existsSync(d)) fs.readdirSync(d).forEach(f => stock.add(f.replace(/-\d+\.webp$/, '')));
}
const pages = [];
const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
  const p = path.join(d, e.name);
  if (e.isDirectory() && e.name !== 'img') walk(p); else if (e.name === 'index.html') pages.push(p);
});
walk(path.resolve(dir));
let errors = 0;

(async () => {
  for (const page of pages) {
    const t = fs.readFileSync(page, 'utf8'), base = path.dirname(page);
    const err = [], warn = [];
    const lineOf = i => t.slice(0, i).split('\n').length;
    for (const s of ['Nume Studio', '0700 000 000', '40700000000', 'numestudio', 'Nume Prenume', 'București', 'Strada Exemplu']) {
      const i = t.indexOf(s); if (i >= 0) err.push(`placeholder "${s}" (line ${lineOf(i)})`);
    }
    for (const m of t.matchAll(/\bExemplu\b/g)) warn.push(`"Exemplu" on line ${lineOf(m.index)}, fine if it is a real label`);
    for (const m of t.matchAll(/—/g)) err.push(`em dash on line ${lineOf(m.index)}`);
    for (const m of t.matchAll(/[“”„‘’«»]/g)) err.push(`curly quote ${m[0]} on line ${lineOf(m.index)}`);
    for (const m of t.matchAll(/[şţŞŢ]/g)) err.push(`cedilla ${m[0]} on line ${lineOf(m.index)}, Romanian uses ș ț with a comma below`);
    if (!/<meta name="robots" content="noindex/.test(t)) err.push('no <meta name="robots" content="noindex">, the page will show up in Google before launch');

    for (const m of t.matchAll(/<img\b[^>]*>/g)) if (!/\salt=/.test(m[0])) err.push(`<img> without alt on line ${lineOf(m.index)}`);
    // local image files: src, href (icons), srcset, imagesrcset
    const files = new Map();
    for (const m of t.matchAll(/\s(?:src|href)="([^"#?:]+\.(?:webp|jpe?g|png|svg))"/g)) files.set(m[1], null);
    for (const m of t.matchAll(/\s(?:srcset|imagesrcset)="([^"]+)"/g)) for (const part of m[1].split(',')) {
      const [f, d] = part.trim().split(/\s+/);
      if (f && !/^https?:/.test(f)) files.set(f, d && d.endsWith('w') ? parseInt(d) : files.get(f) ?? null);
    }
    for (const [f, w] of files) {
      const p = path.join(base, f);
      if (!fs.existsSync(p)) { err.push(`missing file ${f}`); continue; }
      const name = path.basename(f).replace(/-\d+\.webp$/, '');
      if (stock.has(name) && /\.webp$/.test(f)) warn.push(`${f} has a template stock photo name, is that on purpose?`);
      if (w) { const meta = await sharp(p).metadata(); if (meta.width !== w) err.push(`${f} is ${meta.width} px wide but srcset says ${w}w`); }
    }
    const ids = new Set([...t.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
    for (const m of t.matchAll(/\shref="#([^"]+)"/g)) if (!ids.has(m[1])) err.push(`link to #${m[1]} but no element has that id`);
    for (const m of t.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(m[1]); } catch (e) { err.push('JSON-LD does not parse: ' + e.message); }
    }
    const phones = new Set([...t.matchAll(/(?:tel:|wa\.me\/)\+?(\d+)/g)].map(m => m[1].slice(-9)));
    if (phones.size > 1) warn.push('more than one phone number in tel:/wa.me links: ' + [...phones].join(', '));
    const todo = (t.match(/DE CONFIRMAT/g) || []).length;
    if (todo) warn.push(`${todo} x DE CONFIRMAT, each one belongs on the switcher list and in the README`);

    console.log(`\n${path.relative(process.cwd(), page)}: ${err.length} errors, ${warn.length} warnings`);
    err.forEach(e => console.log('  ERROR', e));
    warn.forEach(w => console.log('  warn ', w));
    errors += err.length;
  }
  if (!pages.length) { console.log('no index.html under', dir); process.exit(1); }
  process.exit(errors ? 1 : 0);
})();
