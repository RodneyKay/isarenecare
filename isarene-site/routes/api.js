const fs = require('fs');
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const site = require('../data/site');

const router = express.Router();
router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false,
  message: { ok: false, message: 'Too many requests. Please try again later or call us.' } }));

const LOG = process.env.SUBMISSIONS_FILE || path.join(__dirname, '..', 'data', 'submissions.jsonl');
const clean = (v, max = 2000) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let transport = null;
if (process.env.SMTP_HOST) {
  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });
}

async function deliver(kind, data) {
  const record = { kind, receivedAt: new Date().toISOString(), ...data };
  fs.appendFileSync(LOG, JSON.stringify(record) + '\n');
  if (!transport) return;
  const rows = Object.entries(data).map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(String(v))}</td></tr>`).join('');
  await transport.sendMail({
    from: process.env.MAIL_FROM || site.email, to: process.env.MAIL_TO || site.email,
    replyTo: emailOk(data.email || '') ? data.email : undefined,
    subject: `[Website] ${kind}: ${data.name || data.email || 'new submission'}`,
    html: `<table cellpadding="6">${rows}</table>`
  });
}

function handler(kind, fields, required) {
  return async (req, res) => {
    const b = req.body || {};
    if (clean(b.website)) return res.json({ ok: true, message: 'Thank you.' }); // honeypot: pretend success
    const data = {};
    fields.forEach((f) => { data[f] = clean(b[f], f === 'message' ? 3000 : 200); });
    const missing = required.filter((f) => !data[f]);
    if (missing.length) return res.status(400).json({ ok: false, message: 'Please fill in: ' + missing.join(', ') + '.' });
    if (data.email && !emailOk(data.email)) return res.status(400).json({ ok: false, message: 'Please enter a valid email address.' });
    try {
      await deliver(kind, data);
      res.json({ ok: true, message: kind === 'newsletter' ? 'You are subscribed. Thank you!' : 'Thank you. We have your request and will contact you shortly.' });
    } catch (e) {
      console.error('delivery failed', e.message);
      res.status(500).json({ ok: false, message: `We could not send that right now. Please call ${site.phonePrimary.display}.` });
    }
  };
}

router.post('/contact', handler('contact', ['name', 'email', 'phone', 'subject', 'message'], ['name', 'message']));
router.post('/request-care', handler('request-care', ['name', 'email', 'phone', 'service', 'town', 'bestTime', 'message'], ['name', 'phone']));
router.post('/apply', handler('job-application', ['name', 'email', 'phone', 'role', 'message'], ['name', 'phone', 'role']));
router.post('/newsletter', handler('newsletter', ['email'], ['email']));

module.exports = router;
