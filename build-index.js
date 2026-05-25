const fs = require('fs');
const path = require('path');

const SITE = 'https://samuelguevarasilva.com';
const srcHtml = path.join(__dirname, '..', 'samuel-guevara-silva-corregido (5).html');
const outHtml = path.join(__dirname, 'index.html');

let html = fs.readFileSync(srcHtml, 'utf8');

const imageSlots = [
  {
    src: 'images/samuel-guevara-silva-biografia.jpg',
    alt: 'Samuel Guevara Silva, guitarrista clásico colombiano — retrato de biografía',
    width: 1475,
    height: 769,
    loading: 'eager',
    fetchpriority: 'high',
    className: 'portrait-img',
  },
  {
    src: 'images/galeria-la-cajita-universidad-andes-2025.jpg',
    alt: 'Samuel Guevara Silva en concierto La Cajita, Universidad de los Andes 2025',
    width: 1080,
    height: 769,
    loading: 'lazy',
    className: '',
  },
  {
    src: 'images/galeria-fotografia-artistica-1.png',
    alt: 'Samuel Guevara Silva — fotografía artística 2024',
    width: 662,
    height: 828,
    loading: 'lazy',
    className: '',
  },
  {
    src: 'images/galeria-fotografia-artistica-2.png',
    alt: 'Samuel Guevara Silva — fotografía artística en estudio 2024',
    width: 662,
    height: 828,
    loading: 'lazy',
    className: '',
  },
  {
    src: 'images/decoracion-hero.png',
    alt: '',
    width: 0,
    height: 0,
    loading: 'lazy',
    decorative: true,
    className: '',
  },
];

function buildImgTag(slot) {
  if (slot.decorative) {
    return `<img src="${slot.src}" alt="" decoding="async" loading="${slot.loading}" aria-hidden="true">`;
  }
  const cls = slot.className ? ` class="${slot.className}"` : '';
  const fetch = slot.fetchpriority ? ` fetchpriority="${slot.fetchpriority}"` : '';
  return `<img src="${slot.src}" alt="${slot.alt}" width="${slot.width}" height="${slot.height}" decoding="async" loading="${slot.loading}"${fetch}${cls}>`;
}

let slotIndex = 0;
html = html.replace(/<img[^>]*src="data:image\/[^"]+"[^>]*>/gi, () => {
  const slot = imageSlots[slotIndex++];
  if (!slot) throw new Error('More base64 images than expected');
  return buildImgTag(slot);
});

if (slotIndex !== imageSlots.length) {
  throw new Error(`Expected ${imageSlots.length} images, replaced ${slotIndex}`);
}

html = html.replace(
  /<meta property="og:image" content="[^"]*">/,
  `<meta property="og:image" content="${SITE}/images/portrait.jpg">`
);
html = html.replace(
  /<meta name="twitter:image" content="[^"]*">/,
  `<meta name="twitter:image" content="${SITE}/images/portrait.jpg">`
);
html = html.replace(
  /<meta property="og:image:width" content="[^"]*">/,
  '<meta property="og:image:width" content="1475">'
);
html = html.replace(
  /<meta property="og:image:height" content="[^"]*">/,
  '<meta property="og:image:height" content="769">'
);

const preloadBlock = `  <link rel="preload" as="image" href="images/samuel-guevara-silva-biografia.jpg" fetchpriority="high">\n`;

if (!html.includes('rel="preload" as="image"')) {
  html = html.replace('<link rel="canonical"', `${preloadBlock}  <link rel="canonical"`);
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'Samuel Guevara Silva',
      inLanguage: ['es', 'en', 'fr', 'zh'],
    },
    {
      '@type': 'Person',
      '@id': `${SITE}/#person`,
      name: 'Samuel Guevara Silva',
      description:
        'Guitarrista clásico colombiano, compositor y estudiante de la Universidad Nacional de Colombia.',
      url: SITE,
      image: [
        `${SITE}/images/portrait.jpg`,
        `${SITE}/images/samuel-guevara-silva-biografia.jpg`,
        `${SITE}/images/galeria-la-cajita-universidad-andes-2025.jpg`,
        `${SITE}/images/galeria-fotografia-artistica-1.png`,
        `${SITE}/images/galeria-fotografia-artistica-2.png`,
      ],
      sameAs: [
        'https://www.instagram.com/samuel.guevara.silva/',
        'https://www.youtube.com/@SamuelGS-v2b',
      ],
      jobTitle: 'Guitarrista Clásico',
      nationality: { '@type': 'Country', name: 'Colombia' },
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Universidad Nacional de Colombia',
      },
      award: 'Ganador FestiU 2025',
      knowsAbout: ['Guitarra clásica', 'Música clásica colombiana', 'Compositor'],
    },
    {
      '@type': 'ImageObject',
      '@id': `${SITE}/#image-biografia`,
      contentUrl: `${SITE}/images/samuel-guevara-silva-biografia.jpg`,
      url: `${SITE}/images/samuel-guevara-silva-biografia.jpg`,
      name: 'Samuel Guevara Silva — retrato biografía',
      description:
        'Retrato de Samuel Guevara Silva, guitarrista clásico colombiano, para la sección de biografía.',
      width: 1475,
      height: 769,
      encodingFormat: 'image/jpeg',
      representativeOfPage: true,
      about: { '@id': `${SITE}/#person` },
    },
    {
      '@type': 'ImageObject',
      '@id': `${SITE}/#image-cajita`,
      contentUrl: `${SITE}/images/galeria-la-cajita-universidad-andes-2025.jpg`,
      url: `${SITE}/images/galeria-la-cajita-universidad-andes-2025.jpg`,
      name: 'Samuel Guevara Silva — La Cajita Universidad de los Andes 2025',
      width: 1080,
      height: 769,
      encodingFormat: 'image/jpeg',
      about: { '@id': `${SITE}/#person` },
    },
    {
      '@type': 'ImageObject',
      '@id': `${SITE}/#image-artistica-1`,
      contentUrl: `${SITE}/images/galeria-fotografia-artistica-1.png`,
      url: `${SITE}/images/galeria-fotografia-artistica-1.png`,
      name: 'Samuel Guevara Silva — fotografía artística 2024',
      width: 662,
      height: 828,
      encodingFormat: 'image/png',
      about: { '@id': `${SITE}/#person` },
    },
    {
      '@type': 'ImageObject',
      '@id': `${SITE}/#image-artistica-2`,
      contentUrl: `${SITE}/images/galeria-fotografia-artistica-2.png`,
      url: `${SITE}/images/galeria-fotografia-artistica-2.png`,
      name: 'Samuel Guevara Silva — fotografía artística 2024 (2)',
      width: 662,
      height: 828,
      encodingFormat: 'image/png',
      about: { '@id': `${SITE}/#person` },
    },
  ],
};

html = html.replace(
  /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
  `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`
);

fs.writeFileSync(outHtml, html);
const sizeKb = Math.round(fs.statSync(outHtml).size / 1024);
console.log(`Wrote ${outHtml} (${sizeKb} KB)`);
