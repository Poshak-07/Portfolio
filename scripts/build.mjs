import { mkdir, writeFile, cp, access } from 'node:fs/promises';
import { homePage, projectPage, notFoundPage } from '../src/render.mjs';
import { profile, projects } from '../src/content.mjs';
const required = ['annam-poshak-resume.pdf', 'cricket-prototype.webp', 'cricket-comparison.webp', 'svln-desktop.webp', 'svln-mobile.webp', 'og-image.png'];
for (const file of required) await access(`public/assets/${file}`);
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
await writeFile('dist/index.html', homePage());
await writeFile('dist/404.html', notFoundPage());
for (const project of projects) {
  await mkdir(`dist/work/${project.id}`, { recursive: true });
  await writeFile(`dist/work/${project.id}/index.html`, projectPage(project));
}
const base = profile.siteUrl.replace(/\/$/, '');
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n${base ? `Sitemap: ${base}/sitemap.xml\n` : ''}`);
if (base) await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', ...projects.map(p => `/work/${p.id}/`)].map(route => `<url><loc>${base}${route}</loc></url>`).join('')}</urlset>`);
console.log(`Built home + ${projects.length} case studies + 404. No dependencies or remote assets.`);
if (!base) console.log('Publication note: set profile.siteUrl to enable absolute social URLs, canonical links and sitemap.');
