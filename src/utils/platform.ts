/**
 * Platform detection helpers.
 *
 * Monevia ships in several shells:
 *  - Website (browser)          -> show marketing/landing page + download center
 *  - Native Android APK         -> Capacitor WebView, open the finance app directly
 *  - Installed PWA (standalone) -> home-screen app, open the finance app directly
 */
import { Capacitor } from '@capacitor/core';

interface CapacitorGlobal {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
}

/** True when running inside the native Android/iOS app (Capacitor). */
export const isNativeApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  // 1. Injected Android build marker
  if ((window as any).__MONEVIA_APP_MODE__ === true) return true;
  // 2. Capacitor native check
  try {
    if (Capacitor.isNativePlatform()) return true;
  } catch (e) {
    // ignore
  }
  // 3. Native webview protocols / origins
  if (
    window.location.protocol === 'capacitor:' ||
    window.location.protocol === 'ionic:' ||
    (window.location.hostname === 'localhost' && !window.location.port)
  ) {
    return true;
  }
  // 4. Fallback window.Capacitor
  const cap = (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
  return Boolean(cap?.isNativePlatform?.());
};

/** True when launched from the home screen as an installed PWA. */
export const isStandalonePWA = (): boolean => {
  if (typeof window === 'undefined') return false;
  const displayStandalone = window.matchMedia?.('(display-mode: standalone)').matches;
  const iosStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
  return Boolean(displayStandalone || iosStandalone);
};

/** Installed app experience (APK or home-screen PWA): no website / download pages. */
export const isInstalledApp = (): boolean => isNativeApp() || isStandalonePWA();
