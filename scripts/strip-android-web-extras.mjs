/**
 * Removes website-only files from the native Android app bundle.
 * The /downloads folder (APK, Windows zip, standalone HTML) is for the website
 * download center — it must not be packed inside the APK itself.
 *
 * Also injects window.__MONEVIA_APP_MODE__ into the Android index.html
 * to guarantee that the native APK ALWAYS opens directly into the app.
 *
 *   node scripts/strip-android-web-extras.mjs   (run after `npx cap sync android`)
 */
import { rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'android', 'app', 'src', 'main', 'assets', 'public');

for (const extra of ['downloads', 'sw.js']) {
  const target = join(assets, extra);
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
    console.log(`✓ removed ${extra} from Android assets`);
  }
}

// Inject native app mode marker into the Android bundle's index.html
const indexHtml = join(assets, 'index.html');
if (existsSync(indexHtml)) {
  let content = readFileSync(indexHtml, 'utf8');
  if (!content.includes('__MONEVIA_APP_MODE__')) {
    content = content.replace(
      '<head>',
      '<head><script>window.__MONEVIA_APP_MODE__ = true;</script>'
    );
    writeFileSync(indexHtml, content, 'utf8');
    console.log('✓ injected __MONEVIA_APP_MODE__ marker into Android index.html');
  }
}
