import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Keep original assets as fallbacks. Generate smaller files without changing crops.
const editorial = ['hero-audit', 'audit-results', 'audit-right-info2', 'pilot-hero', 'pilot-months', 'pilt-agree', 'full-hero', 'full-three', 'full-measure', 'newsletter'];
const inputs = [
  ...editorial.map(name => ({ src: `/${name}.webp`, source: `/${name}.png`, widths: [360, 640, 960, 1280, 1920], quality: 85 })),
  { src: '/Picture1.webp', widths: [320, 560], quality: 85 },
  ...['Alex', 'Eduard', 'Ovi'].map(name => ({ src: `/people/${name}.jpg`, widths: [400, 640, 800], quality: 85 })),
  { src: '/SPO7558_Original.webp', widths: [400], quality: 85 },
  { src: '/Adi2.jfif', widths: [200, 400], quality: 85 },
  ...['002', '003', '004', '005'].map(number => ({ src: `/feature-${number}.webp`, widths: [160, 320], quality: 85 })),
  ...Array.from({ length: 12 }, (_, index) => ({ src: `/logos/Artboard ${index + 1}.jpg`, widths: [320, 480], quality: 90, maxWidth: 480 })),
];
const manifest = {};
await fs.mkdir('public/optimized', { recursive: true });
for (const input of inputs) {
  const source = path.join('public', input.source ?? input.src);
  const metadata = await sharp(source).metadata();
  const widths = [...new Set([...input.widths.filter(width => width < metadata.width), Math.min(input.maxWidth ?? metadata.width, metadata.width)])].sort((a, b) => a - b);
  const candidates = [];
  for (const width of widths) {
    if (width === metadata.width && input.src.endsWith('.webp')) {
      candidates.push(`${input.src} ${width}w`);
      continue;
    }
    const name = input.src.replace(/^\//, '').replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const url = `/optimized/${name}-${width}.webp`;
    await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: input.quality, effort: 6 }).toFile(path.join('public', url));
    candidates.push(`${url} ${width}w`);
  }
  manifest[input.src] = { width: metadata.width, height: metadata.height, srcset: candidates.join(', ') };
}
await fs.writeFile('src/data/responsive-images.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`Generated responsive WebP variants for ${inputs.length} original images.`);
