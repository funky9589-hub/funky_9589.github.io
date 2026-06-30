import fs from 'fs';
import path from 'path';

const workspaceDir = '.';
const sitemapPath = path.join(workspaceDir, 'sitemap.xml');
const baseUrl = 'https://funky9589-hub.github.io/funky_9589.github.io';

const pages = [
  { path: '', priority: '1.0' },
  { path: 'monthly.html', priority: '0.8' },
  { path: 'monthly-2025-h2.html', priority: '0.7' },
  { path: 'monthly-2025-h1.html', priority: '0.7' },
  { path: 'playlist.html', priority: '0.8' },
  { path: 'shorts.html', priority: '0.6' }
];

function generateSitemap() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}/${page.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  console.log(`- Generated sitemap.xml at ${sitemapPath}`);
}

generateSitemap();
