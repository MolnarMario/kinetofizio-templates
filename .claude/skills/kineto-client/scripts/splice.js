// Usage: node splice.js <template.html> <out.html> <head-frag.html> <body-frag.html> <rules.json>
// Takes a template, replaces the head block (first comment in <head> up to <style>) and the body
// (after <body> up to the main <script>), then applies the rules. Every "exact" rule must match once
// or more, otherwise the build stops. "tokens" are optional global swaps (phone, e-mail).
const fs = require('fs'), path = require('path');
const [src, dst, headF, bodyF, rulesF] = process.argv.slice(2);
if (!rulesF) {
  console.error('usage: node splice.js <template.html> <out.html> <head-frag.html> <body-frag.html> <rules.json>');
  process.exit(1);
}
// Git with autocrlf may hand you CRLF files; the markers below expect LF
const read = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
let t = read(src);
const cut = (i, end, repl, label) => {
  const j = i < 0 ? -1 : t.indexOf(end, i);
  if (i < 0 || j < 0) throw new Error('missing marker: ' + label);
  t = t.slice(0, i) + repl + t.slice(j);
};
cut(t.indexOf('<!--', t.indexOf('<head>')), '<style>', read(headF), 'head comment ... <style>');
cut(t.indexOf('<body>'), '\n<script>\n/*', '<body>\n' + read(bodyF), '<body> ... main <script>');
const rules = JSON.parse(read(rulesF));
for (const [a, b] of rules.exact || []) {
  if (!t.includes(a)) throw new Error('rule did not match: ' + a.slice(0, 80));
  t = t.split(a).join(b);
}
for (const [a, b] of rules.tokens || []) t = t.split(a).join(b);
// template placeholders; "Exemplu" can be a real label (Elan has "Exemplu:"), so check each hit by hand
const left = ['Nume Studio', '0700 000 000', '40700000000', 'numestudio', 'Exemplu', 'Nume Prenume', 'București'].filter(x => t.includes(x));
if (left.length) console.log('CHECK, still in the page:', left.join(', '));
fs.mkdirSync(path.dirname(dst), { recursive: true });
fs.writeFileSync(dst, t);
console.log('wrote', dst, t.length, 'bytes');
