// Usage: node split.js <page.html> <out-prefix>
// Writes <out-prefix>-head.html and <out-prefix>-body.html: the two blocks splice.js replaces.
// Split a template to get a starting point, or a finished client page (kineticfit/axa/index.html) to see a worked example.
const fs = require('fs'), path = require('path');
const [src, prefix] = process.argv.slice(2);
if (!prefix) { console.error('usage: node split.js <page.html> <out-prefix>'); process.exit(1); }
const t = fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n');
const h0 = t.indexOf('<!--', t.indexOf('<head>')), h1 = t.indexOf('<style>', h0);
const b0 = t.indexOf('<body>\n'), b1 = t.indexOf('\n<script>\n/*', b0);
if (h0 < 0 || h1 < 0 || b0 < 0 || b1 < 0) throw new Error('markers not found in ' + src);
fs.mkdirSync(path.dirname(path.resolve(prefix)), { recursive: true });
fs.writeFileSync(prefix + '-head.html', t.slice(h0, h1));
fs.writeFileSync(prefix + '-body.html', t.slice(b0 + '<body>\n'.length, b1));
console.log('wrote', prefix + '-head.html', h1 - h0, 'bytes,', prefix + '-body.html', b1 - b0 - 7, 'bytes');
