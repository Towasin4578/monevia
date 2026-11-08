/**
 * Removes website-only files from the native Android app bundle.
 * The /downloads folder (APK, Windows zip, standalone HTML) is for the website
 * download center — it must not be packed inside the APK itself.
 *
 *   node scripts/strip-android-web-extras.mjs   (run after `npx cap sync android`)
 */
import { rmSync, existsSync } from 'node:fs';
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
