const express = require('express');
const site = require('../data/site');
const posts = require('../data/posts');
const faqs = require('../data/faqs');
const legal = require('../data/legal');
const router = express.Router();

const fmt = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const decorate = (p) => ({ ...p, dateLabel: fmt(p.date) });
const allPosts = posts.map(decorate).sort((a, b) => b.date.localeCompare(a.date));

router.get('/', (req, res) => res.render('pages/home', {
  title: 'Home Care Services in Billerica, MA | Isarene Home Care Services',
  description: 'Isarene Home Care Services provides compassionate non-medical home care, healthcare staffing, and transportation services in Billerica and across Massachusetts.',
  posts: allPosts.slice(0, 3)
}));

router.get('/about', (req, res) => res.render('pages/about', {
  title: 'About Us | Isarene Home Care Services',
  description: 'Founded on family principles, Isarene is a registered non-medical home care agency bringing reliable, dignified care to Massachusetts families.'
}));

router.get('/services', (req, res) => res.render('pages/services', {
  title: 'Our Services | Isarene Home Care Services',
  description: 'Non-medical home care, healthcare staffing and medical transportation under one trusted roof in Billerica, MA.'
}));

router.get('/services/:slug', (req, res, next) => {
  const service = site.services[req.params.slug];
  if (!service) return next();
  res.render('pages/service', {
    service,
    title: `${service.short} | Isarene Home Care Services`,
    description: service.lead
  });
});
// Old WordPress URLs keep working
router.get('/home-care', (req, res) => res.redirect(301, '/services/home-care'));
router.get('/staffing-solutions', (req, res) => res.redirect(301, '/services/staffing-solutions'));
router.get('/transportation', (req, res) => res.redirect(301, '/services/transportation'));
router.get('/about-us', (req, res) => res.redirect(301, '/about'));
router.get('/why-choose-us', (req, res) => res.redirect(301, '/#why'));
router.get('/contact-us', (req, res) => res.redirect(301, '/contact'));
router.get('/privacy-policy-2', (req, res) => res.redirect(301, '/privacy-policy'));
router.get('/terms-of-use', (req, res) => res.redirect(301, '/terms'));

router.get('/blogs', (req, res) => res.render('pages/blogs', {
  title: 'Home Care Guides & Senior Care Tips | Isarene Blog',
  description: 'Practical guides and tips for families choosing home care in Massachusetts.',
  posts: allPosts
}));
router.get('/blogs/:slug', (req, res, next) => {
  const post = allPosts.find((p) => p.slug === req.params.slug);
  if (!post) return next();
  res.render('pages/post', {
    post, related: allPosts.filter((p) => p.slug !== post.slug).slice(0, 2),
    title: `${post.title} | Isarene`, description: post.excerpt.replace(/…$/, '.')
  });
});
// Old WordPress post URLs sit at the site root
allPosts.forEach((p) => router.get('/' + p.slug, (req, res) => res.redirect(301, '/blogs/' + p.slug)));

router.get('/gallery', (req, res) => res.render('pages/gallery', {
  title: 'Gallery | Isarene Home Care Services',
  description: 'Moments from our caregivers, clients and community.'
}));
router.get('/employment', (req, res) => res.render('pages/employment', {
  title: 'Careers & Employment | Isarene Home Care Services',
  description: 'Join our team of caregivers, CNAs, HHAs and drivers in Billerica, MA.'
}));
router.get('/contact', (req, res) => res.render('pages/contact', {
  title: 'Request Care & Contact Us | Isarene Home Care Services',
  description: 'Request a care assessment or ask a question. Call 24/7 or send us a message.'
}));
router.get('/faq', (req, res) => res.render('pages/faq', {
  title: 'Frequently Asked Questions | Isarene Home Care Services',
  description: 'Answers about our home care, staffing and transportation services.',
  groups: faqs
}));
router.get('/privacy-policy', (req, res) => res.render('pages/legal', { doc: legal.privacy, title: 'Privacy Policy | Isarene', description: legal.privacy.lead }));
router.get('/terms', (req, res) => res.render('pages/legal', { doc: legal.terms, title: 'Terms of Use | Isarene', description: legal.terms.lead }));

router.get('/robots.txt', (req, res) => res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`));
router.get('/sitemap.xml', (req, res) => {
  const urls = ['/', '/about', '/services', ...Object.keys(site.services).map((s) => '/services/' + s), '/blogs',
    ...allPosts.map((p) => '/blogs/' + p.slug), '/gallery', '/employment', '/contact', '/faq', '/privacy-policy', '/terms'];
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${site.url}${u === '/' ? '' : u}</loc></url>`).join('\n')}\n</urlset>`);
});

module.exports = router;
