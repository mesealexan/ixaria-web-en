import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { pageSEO } from '../seo/pages';
import { sitemapImages } from '../seo/sitemap-images';
import type { PageSEO } from '../seo/types';

const escapeXML = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = () => {
  const urls = Object.values(pageSEO)
    .filter((page) => !page.robots.includes('noindex'))
    .map(
      (page: PageSEO) => `
  <url>
    <loc>${escapeXML(new URL(page.path, site.url).href)}</loc>
    ${page.lastModified ? `<lastmod>${page.lastModified}</lastmod>` : ''}
    ${(sitemapImages[page.path] ?? []).map((image) => `<image:image><image:loc>${escapeXML(new URL(image, site.url).href)}</image:loc></image:image>`).join('\n    ')}
  </url>`,
    )
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
