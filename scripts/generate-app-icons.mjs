/**
 * Generates all Monevia app icons & splash screens from the brand SVG.
 *
 *   node scripts/generate-app-icons.mjs
 *
 * Outputs:
 *  - Android launcher icons (legacy + round + adaptive foreground) for every density
 *  - Android splash screens (portrait + landscape) for every density
 *  - PWA icons in public/brand (icon-192.png, icon-512.png)
 */
import sharp from 'sharp';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const res = join(root, 'android', 'app', 'src', 'main', 'res');
const NAVY = '#142D4E';

const fullIconSvg = readFileSync(join(root, 'public', 'brand', 'app-icon.svg'), 'utf8');

// Glyph only (no background) — used for adaptive-icon foreground & splash.
const glyphDefs = fullIconSvg.match(/<defs>[\s\S]*?<\/defs>/)[0];
const glyphGroup = fullIconSvg.match(/<g filter="url\(#shadow\)">[\s\S]*?<\/g>/)[0];
const glyphSvg = (scale) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  ${glyphDefs}
  <g transform="translate(256 256) scale(${scale}) translate(-256 -266)">${glyphGroup}</g>
</svg>`;

const png = (svg, w, h = w) =>
  sharp(Buffer.from(svg), { density: 384 }).resize(w, h).png().toBuffer();

const circleMask = (size) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`);

const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

// ── Launcher icons ─────────────────────────────────────────────
for (const [d, k] of Object.entries(densities)) {
  const dir = join(res, `mipmap-${d}`);
  const legacy = Math.round(48 * k);
  const fg = Math.round(108 * k);

  const square = await png(fullIconSvg, legacy);
  await sharp(square).toFile(join(dir, 'ic_launcher.png'));

  // Round: navy circle with the glyph
  const roundSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
    ${glyphDefs}<circle cx="256" cy="256" r="256" fill="url(#bg-glow)"/>
    <g transform="translate(256 256) scale(0.82) translate(-256 -266)">${glyphGroup}</g></svg>`;
  const round = await png(roundSvg, legacy);
  await sharp(round)
    .composite([{ input: circleMask(legacy), blend: 'dest-in' }])
    .toFile(join(dir, 'ic_launcher_round.png'));

  // Adaptive foreground: glyph inside the 66/108 safe zone, transparent bg
  await sharp(await png(glyphSvg(0.72), fg)).toFile(join(dir, 'ic_launcher_foreground.png'));
  console.log(`✓ mipmap-${d}: ${legacy}px icon, ${fg}px foreground`);
}

// ── Splash screens (keep the template's existing dimensions) ───
const splashDirs = ['drawable', ...Object.keys(densities).flatMap((d) => [`drawable-port-${d}`, `drawable-land-${d}`])];
for (const dirName of splashDirs) {
  const file = join(res, dirName, 'splash.png');
  if (!existsSync(file)) continue;
  const { width, height } = await sharp(file).metadata();
  const logo = Math.round(Math.min(width, height) * 0.32);
  const fontSize = Math.round(logo * 0.26);
  const gap = Math.round(logo * 0.12);
  const totalH = logo + gap + fontSize;
  const top = Math.round((height - totalH) / 2);

  const logoPng = await png(fullIconSvg, logo);
  const textSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${fontSize * 1.4}">
    <text x="50%" y="${fontSize}" text-anchor="middle" font-family="Segoe UI, Roboto, Arial, sans-serif"
      font-size="${fontSize}" font-weight="800" fill="#FFFFFF">Monevia</text></svg>`);

  await sharp({ create: { width, height, channels: 4, background: NAVY } })
    .composite([
      { input: logoPng, left: Math.round((width - logo) / 2), top },
      { input: textSvg, left: 0, top: top + logo + gap },
    ])
    .png()
    .toFile(file + '.tmp');
  await sharp(file + '.tmp').toFile(file);
  (await import('node:fs')).unlinkSync(file + '.tmp');
  console.log(`✓ ${dirName}/splash.png ${width}x${height}`);
}

// ── PWA icons ──────────────────────────────────────────────────
for (const size of [192, 512]) {
  await sharp(await png(fullIconSvg, size)).toFile(join(root, 'public', 'brand', `icon-${size}.png`));
  console.log(`✓ public/brand/icon-${size}.png`);
}
