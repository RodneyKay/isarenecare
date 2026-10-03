require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const site = require('./data/site');
const pages = require('./routes/pages');
const api = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://isarene.com'],
      mediaSrc: ["'self'", 'https://isarene.com'],
      frameSrc: ['https://www.google.com'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));

const year = 60 * 60 * 24 * 365 * 1000;
const staticOpts = { maxAge: process.env.NODE_ENV === 'production' ? 7 * 24 * 3600 * 1000 : 0 };
app.use('/vendor/icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font'), { maxAge: year }));
app.use('/vendor/aos', express.static(path.join(__dirname, 'node_modules/aos/dist'), { maxAge: year }));
app.use(express.static(path.join(__dirname, 'public'), staticOpts));

app.use((req, res, next) => {
  res.locals.site = site;
  res.locals.path = req.path;
  res.locals.canonical = site.url + (req.path === '/' ? '' : req.path);
  next();
});

app.use('/api', api);
app.use('/', pages);

app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page not found', description: 'The page you were looking for could not be found.' });
});
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  if (req.path.startsWith('/api/')) return res.status(500).json({ ok: false, message: 'Something went wrong. Please call us instead.' });
  res.status(500).render('pages/404', { title: 'Something went wrong', description: '' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Isarene site running on http://localhost:${PORT}`));
}
module.exports = app;
