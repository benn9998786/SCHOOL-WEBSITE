/*
 * Builds the website pages from the files in src/.
 *
 *   node build.js
 *
 * Edit these, then run the command above:
 *   src/partials/header.html     top bar + menu (shared by every page)
 *   src/partials/footer.html     footer (shared by every page)
 *   src/partials/preloader.html  logo loading screen (when the site is opened or refreshed)
 *   src/pages/*.html             the content of each page
 *   PAGES (below)                page titles, descriptions and page-header pictures
 *
 * It writes index.html, about.html, academics.html, gallery.html, contact.html and 404.html,
 * plus sitemap.xml, robots.txt and site.webmanifest (search data lives in src/partials/seo.js).
 * Shared styles live in assets/css/site.css + fx.css, scripts in assets/js/site.js + fx.js.
 */
const fs = require('fs');
const path = require('path');
const root = __dirname;
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const { sprite, iconize } = require('./src/partials/icons.js');
const { headTags, sitemap, robots, manifest } = require('./src/partials/seo.js');

const SITE = 'Fr. Agnel Higher Secondary School, Pilar';

const NAV = [
  ['home', 'index.html', 'Home'],
  ['about', 'about.html', 'About Us'],
  ['academics', 'academics.html', 'Academics'],
  ['gallery', 'gallery.html', 'Gallery'],
  ['contact', 'contact.html', 'Contact'],
];

/* Which page each in-page section lives on (used to fix links between pages) */
const SECTION_PAGE = {
  home: 'home', highlights: 'home', slider: 'home', welcome: 'home', streams: 'home', 'gallery-preview': 'home',
  about: 'about', history: 'about', vision: 'about', patron: 'about', values: 'about', community: 'about', prayer: 'about',
  academics: 'academics', 'gallery-showcase': 'gallery', visit: 'contact',
};

/* Small line-art graphics for each page header */
const GRAPHICS = {
  about: `<svg viewBox="0 0 200 200" class="ph-graphic" aria-hidden="true"><defs><linearGradient id="phg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe36b"/><stop offset="1" stop-color="#f4c400"/></linearGradient></defs><circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,.18)" stroke-dasharray="4 8" class="ph-spin"/><path d="M100 28 C82 42 62 48 40 50 V108 C40 140 66 162 100 174 C134 162 160 140 160 108 V50 C138 48 118 42 100 28Z" fill="none" stroke="url(#phg)" stroke-width="5" class="ph-draw"/><g fill="#fff" class="ph-twinkle"><path d="M78 80l4 10 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z"/><path d="M122 80l4 10 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z"/><path d="M100 112l4 10 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z"/></g></svg>`,
  academics: `<svg viewBox="0 0 200 200" class="ph-graphic" aria-hidden="true"><circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,.18)" stroke-dasharray="4 8" class="ph-spin"/><g class="ph-float"><path d="M100 52 L172 86 L100 120 L28 86 Z" fill="#f4c400"/><path d="M60 102 V134 C60 148 140 148 140 134 V102 L100 120 Z" fill="#fff"/><path d="M164 90 V132" stroke="#ffe36b" stroke-width="5" stroke-linecap="round"/><circle cx="164" cy="138" r="7" fill="#ffe36b"/></g></svg>`,
  gallery: `<svg viewBox="0 0 200 200" class="ph-graphic" aria-hidden="true"><circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,.18)" stroke-dasharray="4 8" class="ph-spin"/><rect x="34" y="62" width="132" height="94" rx="16" fill="none" stroke="#fff" stroke-width="6"/><rect x="74" y="46" width="52" height="22" rx="7" fill="#fff"/><g class="ph-aperture"><circle cx="100" cy="109" r="31" fill="none" stroke="#f4c400" stroke-width="6"/><path d="M100 78 L112 100 M131 109 L106 112 M100 140 L88 118 M69 109 L94 106" stroke="#ffe36b" stroke-width="5" stroke-linecap="round"/></g><circle cx="146" cy="80" r="6" fill="#f4c400" class="ph-twinkle"/></svg>`,
  contact: `<svg viewBox="0 0 200 200" class="ph-graphic" aria-hidden="true"><circle cx="100" cy="150" r="16" fill="none" stroke="#f4c400" stroke-width="3" class="ph-ping"/><circle cx="100" cy="150" r="16" fill="none" stroke="#f4c400" stroke-width="3" class="ph-ping ph-ping2"/><g class="ph-float"><path d="M100 30 C70 30 48 52 48 82 C48 120 100 160 100 160 C100 160 152 120 152 82 C152 52 130 30 100 30Z" fill="#f4c400"/><circle cx="100" cy="82" r="20" fill="#062b59"/></g></svg>`,
};

const PAGES = [
  { key: 'home', file: 'index.html', src: 'src/pages/home.html',
    title: 'Fr. Agnel Higher Secondary School, Pilar, Goa | Std XI & XII',
    description: 'Fr. Agnel Higher Secondary School, Pilar, Goa offers Std XI & XII in Arts, Commerce, Science and four vocational courses. Always Higher, since 1979.',
    crumb: 'Home', imageAlt: 'Fr. Agnel Higher Secondary School building, Pilar, Goa', sitemapImages: ['images/school-campus-wide.jpg', 'images/logo.png', 'images/event-sports-day.jpg', 'images/event-creative-canvas-1.jpg'],
    hero: 'images/school-campus-wide.jpg' },
  { key: 'about', file: 'about.html', src: 'src/pages/about.html',
    title: 'About Us: History, Principal & Patron | Fr. Agnel HSS Pilar',
    description: 'Our history since 1979, the principal\'s message, past principals, vision, patron Ven. Fr. Agnelo de Souza and staff of Fr. Agnel HSS, Pilar, Goa.',
    crumb: 'About Us', imageAlt: 'Staff of Fr. Agnel Higher Secondary School, Pilar', sitemapImages: ['images/teachers-jpeg.jpg', 'images/principal.jpg'],
    hero: 'images/teachers-jpeg.jpg', eyebrow: 'Since 1979', words: ['About', 'Us'],
    subtitle: 'Our story, our people and the values that guide us, Always Higher.' },
  { key: 'academics', file: 'academics.html', src: 'src/pages/academics.html',
    title: 'Courses & Streams (Std XI-XII) | Fr. Agnel HSS, Pilar, Goa',
    description: 'Std XI-XII streams at Fr. Agnel HSS, Pilar: Arts, Commerce, Science and vocational Auto Engineering, Computer Technique, Business & Insurance, Office Management.',
    crumb: 'Academics', imageAlt: 'Science practicals at Fr. Agnel Higher Secondary School, Pilar',
    hero: 'images/pilar-hss-9-jpg.jpg', eyebrow: 'Learning Pathways', words: ['Our', 'Academics'],
    subtitle: 'Three general streams and four vocational courses for Std XI and XII.' },
  { key: 'gallery', file: 'gallery.html', src: 'src/pages/gallery.html',
    title: 'Gallery & Events | Fr. Agnel Higher Secondary School, Pilar',
    description: 'Photos and recent events at Fr. Agnel Higher Secondary School, Pilar, Goa: Sports Day, Creative Canvas, celebrations, culture, faith and campus life.',
    crumb: 'Gallery', imageAlt: 'Creative Canvas 2026 performance at Fr. Agnel HSS, Pilar', sitemapImages: ['images/event-creative-canvas-1.jpg', 'images/event-sports-day.jpg', 'images/event-exposure-tour.jpg', 'images/event-creative-canvas-2.jpg', 'images/pilar-hss-20-jpg.jpg'],
    hero: 'images/event-creative-canvas-1.jpg', eyebrow: 'Life at Fr. Agnel', words: ['Gallery', '&amp; Events'],
    subtitle: 'Celebrations, culture, learning and faith on our campus.' },
  { key: 'contact', file: 'contact.html', src: 'src/pages/contact.html',
    title: 'Contact Us & Directions | Fr. Agnel HSS, Pilar, Goa',
    description: 'Contact Fr. Agnel Higher Secondary School, Pilar, Tiswadi, Goa 403203: phone 9423747736, office 0832-2218589, email, school hours and map directions.',
    crumb: 'Contact', imageAlt: 'Fr. Agnel Higher Secondary School building, Pilar, Goa',
    hero: 'images/school-campus-wide.jpg', eyebrow: 'Get in Touch', words: ['Contact', 'Us'],
    subtitle: 'We would love to hear from you or welcome you on campus.' },
];

/* Rewrite "#section" links that point to a section on another page */
function fixLinks(html, pageKey) {
  return html.replace(/href="#([\w-]+)"/g, (m, id) => {
    const target = SECTION_PAGE[id];
    if (!target || target === pageKey) return m;
    const file = NAV.find(n => n[0] === target)[1];
    if (id === target) return `href="${file}"`;                 // e.g. #academics -> academics.html
    if (target === 'gallery' || target === 'contact') return `href="${file}"`;
    return `href="${file}#${id}"`;                                // e.g. #history -> about.html#history
  });
}

function pageHero(p) {
  const small = p.hero.replace('images/', 'images/800/');
  const crumb = NAV.find(n => n[0] === p.key)[2];
  return `<section class="page-hero page-hero-${p.key}" aria-labelledby="page-title">
  <div class="page-hero-bg" aria-hidden="true"><img src="${p.hero}" srcset="${small} 800w, ${p.hero} 1600w" sizes="100vw" alt="" fetchpriority="high" decoding="async"></div>
  <canvas class="hero-canvas" id="heroCanvas" aria-hidden="true"></canvas>
  <span class="ph-orb ph-orb1" aria-hidden="true"></span><span class="ph-orb ph-orb2" aria-hidden="true"></span>
  <div class="container ph-inner">
    <div class="ph-content">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span aria-current="page">${crumb}</span></nav>
      <span class="ph-eyebrow">${p.eyebrow}</span>
      <h1 id="page-title" class="ph-title">${p.words.map((w, i) => `<span class="ph-word${i === p.words.length - 1 ? ' accent' : ''}" style="--i:${i}">${w}</span>`).join(' ')}</h1>
      <p class="ph-sub">${p.subtitle}</p>
    </div>
    ${GRAPHICS[p.key] || ''}
  </div>
  <svg class="ph-wave" viewBox="0 0 2880 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0,40 C240,70 480,10 720,40 C960,70 1200,10 1440,40 C1680,70 1920,10 2160,40 C2400,70 2640,10 2880,40 L2880,70 L0,70 Z"/></svg>
</section>`;
}

const header = read('src/partials/header.html');
const footer = read('src/partials/footer.html');
const preloader = read('src/partials/preloader.html');

function render(p, rawContent) {
  const nav = NAV.map(([key, href, label]) => key === p.key
    ? `                <li><a href="${href}" class="active" aria-current="page">${label}</a></li>`
    : `                <li><a href="${href}">${label}</a></li>`).join('\n');
  const content = fixLinks(rawContent, p.key);
  const preloadHero = p.key === 'home'
    ? `<link rel="preload" as="image" href="${p.hero}" imagesrcset="${p.hero.replace('images/', 'images/800/')} 800w, ${p.hero} 1600w" imagesizes="100vw" fetchpriority="high">`
    : `<link rel="preload" as="image" href="${p.hero}" imagesrcset="${p.hero.replace('images/', 'images/800/')} 800w, ${p.hero} 1600w" imagesizes="100vw" fetchpriority="high">`;
  const html = `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${headTags(p)}
${preloadHero}
<link rel="preload" as="image" href="images/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap">
<link rel="stylesheet" href="assets/css/site.css">
<link rel="stylesheet" href="assets/css/fx.css">
<script src="assets/js/site.js" defer></script>
<script src="assets/js/fx.js" defer></script>
</head>
<!-- This page is generated by build.js from src/. Edit the files in src/ and run: node build.js -->
<body class="page-${p.key}" data-hero="${p.hero}">
${sprite}

${preloader}
${fixLinks(header.replace('{{NAV}}', nav), p.key)}
<main id="main">
${p.key === 'home' || p.noHero ? '' : pageHero(p) + '\n\n'}${content}
</main>

${fixLinks(footer, p.key)}
</body>
</html>
`;
  fs.writeFileSync(path.join(root, p.file), iconize(html));
  console.log('built', p.file.padEnd(15), (Buffer.byteLength(html) / 1024).toFixed(1) + ' KB');
}

for (const p of PAGES) render(p, read(p.src));

/* Friendly "page not found" page (not indexed by search engines) */
render({
  key: 'notfound', file: '404.html', noHero: true, noindex: true, hero: 'images/school-campus-wide.jpg',
  title: 'Page Not Found | Fr. Agnel Higher Secondary School, Pilar',
  description: 'Sorry, that page could not be found. Visit the home page of Fr. Agnel Higher Secondary School, Pilar, Goa.',
}, read('src/pages/404.html'));

/* Search engine files */
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap(PAGES));
fs.writeFileSync(path.join(root, 'robots.txt'), robots());
fs.writeFileSync(path.join(root, 'site.webmanifest'), manifest());
console.log('built sitemap.xml, robots.txt, site.webmanifest');
