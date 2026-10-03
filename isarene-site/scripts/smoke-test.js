// Starts the app on a random port and checks every page, redirect and form endpoint.
process.env.SUBMISSIONS_FILE = require('path').join(require('os').tmpdir(), 'isarene-smoke.jsonl');
const app = require('../server');
const site = require('../data/site');
const posts = require('../data/posts');

const pages = ['/', '/about', '/services', ...Object.keys(site.services).map((s) => '/services/' + s), '/blogs',
  ...posts.map((p) => '/blogs/' + p.slug), '/gallery', '/employment', '/contact', '/faq', '/privacy-policy', '/terms', '/sitemap.xml', '/robots.txt'];
const redirects = { '/home-care': '/services/home-care', '/contact-us': '/contact', '/about-us': '/about', '/terms-of-use': '/terms' };

const server = app.listen(0, async () => {
  const base = 'http://localhost:' + server.address().port;
  let fail = 0;
  const check = (ok, msg) => { if (!ok) fail++; console.log((ok ? 'PASS ' : 'FAIL ') + msg); };
  for (const p of pages) { const r = await fetch(base + p); check(r.status === 200, `${r.status} ${p}`); }
  for (const [from, to] of Object.entries(redirects)) {
    const r = await fetch(base + from, { redirect: 'manual' });
    check(r.status === 301 && r.headers.get('location') === to, `redirect ${from} -> ${to}`);
  }
  check((await fetch(base + '/missing-page')).status === 404, '404 for unknown page');
  const post = (u, b) => fetch(base + u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) });
  check((await post('/api/request-care', { name: 'T', phone: '1' })).status === 200, 'request-care accepts valid input');
  check((await post('/api/request-care', { name: 'T' })).status === 400, 'request-care rejects missing phone');
  check((await post('/api/contact', { name: 'T', message: 'm', email: 'bad' })).status === 400, 'contact rejects bad email');
  const html = await (await fetch(base + '/')).text();
  check(!/Hopewell|Give Hope/i.test(html), 'home page has no leftover template branding text');
  server.close();
  console.log(fail ? `\n${fail} check(s) failed` : '\nAll checks passed');
  process.exit(fail ? 1 : 0);
});
