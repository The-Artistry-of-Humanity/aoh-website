// Sitemap, generated at build. Lists the public pages only (no thank-you,
// feedback or unsubscribe pages). Paths match the canonical links in Base.astro.
const BASE = 'https://artistry-of-humanity.com';
const PAGES = [
  '/',
  '/about',
  '/contact',
  '/framework',
  '/fulfilment-check-in',
  '/human-strategy',
  '/privacy',
  '/what-we-do',
  '/what-we-do/keynotes-workshops',
  '/what-we-do/masterclass',
  '/what-we-do/leadership-coaching',
  '/what-we-do/wellness-accelerator',
  '/what-we-do/culture-consulting',
  '/what-we-do/norma',
];

export function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGES
    .map((u) => `  <url><loc>${BASE}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
