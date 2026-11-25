/*
 * Search-engine and sharing data for every page, used by build.js.
 *
 * SITE_URL is the school's official address. Every page tells Google this
 * is the "real" copy (canonical), so the GitHub Pages and onrender.com copies
 * don't count as duplicates. Change it here if the domain ever changes.
 */
const SITE_URL = 'https://fragnelhsspilar.in';
const NAME = 'Fr. Agnel Higher Secondary School, Pilar';

const abs = rel => SITE_URL + '/' + rel.replace(/^\//, '');
const pageUrl = file => file === 'index.html' ? SITE_URL + '/' : abs(file);
const esc = s => String(s).replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;').replace(/"/g, '&quot;');

/* The school, as Google's Knowledge Panel / local results understand it */
const SCHOOL = {
  '@type': 'HighSchool',
  '@id': SITE_URL + '/#school',
  name: 'Fr. Agnel Higher Secondary School',
  alternateName: ['Fr. Agnel HSS, Pilar', 'Fr. Agnel Higher Secondary School, Pilar', 'Fr Agnel Higher Secondary School Pilar Goa'],
  url: SITE_URL + '/',
  logo: abs('images/logo.png'),
  image: [abs('images/school-campus-wide.jpg'), abs('images/teachers-jpeg.jpg')],
  description: 'Higher secondary school (Std XI and XII) in Pilar, Goa, offering Arts, Commerce and Science streams and vocational courses since 1979. Run by the Xaverian Educational Society.',
  slogan: 'Always Higher',
  foundingDate: '1979',
  founder: { '@type': 'Person', name: "Fr. Philomeno D'Costa" },
  parentOrganization: { '@type': 'Organization', name: 'Xaverian Educational Society' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Pilar',
    addressLocality: 'Pilar, Tiswadi',
    addressRegion: 'Goa',
    postalCode: '403203',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 15.440062, longitude: 73.89336 },
  hasMap: 'https://www.google.com/maps?q=15.440062,73.893360',
  telephone: '+91-9423747736',
  email: 'fahsspilar@gmail.com',
  contactPoint: [{ '@type': 'ContactPoint', telephone: '+91-832-2218589', contactType: 'customer support', areaServed: 'IN', availableLanguage: ['English', 'Konkani', 'Hindi'] }],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '16:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '12:30' },
  ],
};

/* Courses, listed on the Academics page */
const COURSES = [
  ['stream-arts', 'Arts Stream', 'Std XI-XII Arts: Economics, Political Science, Psychology, History and Sociology, with English and Hindi/Konkani.'],
  ['stream-commerce', 'Commerce Stream', 'Std XI-XII Commerce: Economics, Secretarial Practice, Accountancy and Business Studies.'],
  ['stream-science', 'Science Stream', 'Std XI-XII Science: Physics, Chemistry, Biology and Mathematics.'],
  ['stream-aet', 'Auto Engineering Technology', 'Vocational course in auto servicing, automobile engineering and auto transmission, with on-the-job training.'],
  ['stream-ct', 'Computer Technique', 'Vocational course in computer organisation, operating systems, software applications and web technology.'],
  ['stream-insurance', 'Business and Insurance', 'Vocational course in life insurance, general insurance, accountancy and computer applications.'],
  ['stream-oss', 'Office Management', 'Vocational course in office procedure and practice, accountancy, stenography and computer applications (for girls).'],
];

function jsonLd(p) {
  const url = pageUrl(p.file);
  const graph = [SCHOOL];
  if (p.key === 'home') {
    graph.push({ '@type': 'WebSite', '@id': SITE_URL + '/#website', url: SITE_URL + '/', name: NAME, inLanguage: 'en-IN', publisher: { '@id': SCHOOL['@id'] } });
  }
  graph.push({
    '@type': p.key === 'contact' ? 'ContactPage' : p.key === 'about' ? 'AboutPage' : p.key === 'gallery' ? 'CollectionPage' : 'WebPage',
    '@id': url + '#webpage', url, name: p.title, description: p.description, inLanguage: 'en-IN',
    isPartOf: { '@id': SITE_URL + '/#website' }, about: { '@id': SCHOOL['@id'] },
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(p.hero) },
  });
  if (p.key !== 'home' && p.crumb) {
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: p.crumb, item: url },
    ] });
  }
  if (p.key === 'academics') {
    graph.push({ '@type': 'ItemList', name: 'Courses at ' + NAME, itemListElement: COURSES.map(([id, name, description], i) => ({
      '@type': 'ListItem', position: i + 1, item: {
        '@type': 'Course', '@id': url + '#' + id, url: url + '#' + id, name, description,
        educationalLevel: 'Higher Secondary (Std XI-XII)', inLanguage: 'en',
        provider: { '@id': SCHOOL['@id'] },
      },
    })) });
  }
  return '<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c') + '</script>';
}

/* Everything that goes in <head> for search and sharing */
function headTags(p) {
  const url = pageUrl(p.file);
  const img = abs(p.hero);
  return [
    `<title>${esc(p.title)}</title>`,
    `<meta name="description" content="${esc(p.description)}">`,
    p.noindex ? '' : `<link rel="canonical" href="${url}">`,
    `<meta name="robots" content="${p.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(NAME)}">`,
    `<meta property="og:locale" content="en_IN">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(p.title)}">`,
    `<meta property="og:description" content="${esc(p.description)}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta property="og:image:alt" content="${esc(p.imageAlt || NAME)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(p.title)}">`,
    `<meta name="twitter:description" content="${esc(p.description)}">`,
    `<meta name="twitter:image" content="${img}">`,
    `<meta name="geo.region" content="IN-GA">`,
    `<meta name="geo.placename" content="Pilar, Goa">`,
    `<meta name="geo.position" content="15.440062;73.893360">`,
    `<meta name="ICBM" content="15.440062, 73.893360">`,
    `<meta name="theme-color" content="#062b59">`,
    `<link rel="icon" type="image/png" sizes="32x32" href="images/icons/favicon-32.png">`,
    `<link rel="icon" type="image/png" sizes="192x192" href="images/icons/icon-192.png">`,
    `<link rel="apple-touch-icon" href="images/icons/apple-touch-icon.png">`,
    `<link rel="manifest" href="site.webmanifest">`,
    p.noindex ? '' : jsonLd(p),
  ].filter(Boolean).join('\n');
}

function sitemap(pages) {
  const today = new Date().toISOString().slice(0, 10);
  const prio = { home: '1.0', academics: '0.9', about: '0.8', contact: '0.8', gallery: '0.7' };
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.filter(p => !p.noindex).map(p => `  <url>
    <loc>${pageUrl(p.file)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.key === 'gallery' || p.key === 'home' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${prio[p.key] || '0.6'}</priority>
${(p.sitemapImages || [p.hero]).map(i => `    <image:image><image:loc>${abs(i)}</image:loc></image:image>`).join('\n')}
  </url>`).join('\n')}
</urlset>
`;
}

const robots = () => `# Fr. Agnel Higher Secondary School, Pilar
User-agent: *
Allow: /
Disallow: /src/
Disallow: /build.js

Sitemap: ${SITE_URL}/sitemap.xml
`;

const manifest = () => JSON.stringify({
  name: NAME,
  short_name: 'Fr. Agnel HSS',
  description: 'Fr. Agnel Higher Secondary School, Pilar, Goa. Always Higher.',
  start_url: '/',
  display: 'standalone',
  background_color: '#062b59',
  theme_color: '#062b59',
  icons: [
    { src: 'images/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'images/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'images/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2) + '\n';

module.exports = { SITE_URL, headTags, sitemap, robots, manifest };
