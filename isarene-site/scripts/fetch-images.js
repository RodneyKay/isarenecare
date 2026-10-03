// Downloads every image/video referenced in data/site.js and data/posts.js into public/img,
// so the site no longer depends on the old WordPress server.
// Usage: npm run fetch-images   (then start with LOCAL_IMAGES=true)
const fs = require('fs');
const path = require('path');
const site = require('../data/site');
const posts = require('../data/posts');

const urls = new Set([...Object.values(site.img), ...posts.map((p) => p.image)].filter((u) => /^https?:/.test(u)));
const out = path.join(__dirname, '..', 'public', 'img');
fs.mkdirSync(out, { recursive: true });

(async () => {
  let ok = 0;
  for (const u of urls) {
    const file = path.join(out, path.basename(new URL(u).pathname));
    try {
      const r = await fetch(u);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
      console.log('saved', path.basename(file)); ok++;
    } catch (e) { console.warn('FAILED', u, e.message); }
  }
  console.log(`${ok}/${urls.size} files saved to public/img`);
})();
