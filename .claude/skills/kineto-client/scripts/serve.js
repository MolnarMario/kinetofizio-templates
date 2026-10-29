// Usage: node serve.js <folder> [port]
// Static server on 127.0.0.1 with caching off. Port 0 or no port lets the OS pick a free one,
// so two agents never fight over a port. Run it in the background and read the printed address.
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(process.argv[2] || '.'), port = +(process.argv[3] || 0);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8' };
const srv = http.createServer((req, res) => {
  const f0 = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!f0.startsWith(root)) { res.writeHead(403); return res.end(); }
  const f = fs.existsSync(f0) && fs.statSync(f0).isDirectory() ? path.join(f0, 'index.html') : f0;
  fs.readFile(f, (e, b) => {
    if (e) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(b);
  });
});
srv.listen(port, '127.0.0.1', () => console.log('serving', root, 'at http://127.0.0.1:' + srv.address().port + '/'));
