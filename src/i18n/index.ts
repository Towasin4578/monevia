import { en } from './locales/en';
import { bn } from './locales/bn';
import { SupportedLanguage } from '../types';

export const translations = {
  en,
  bn,
};

export type TranslationKeys = typeof en;

// Safe dot notation recursive getter
function getNestedValue(obj: any, path: string): string {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return path; // fallback to path key
    }
  }
  return typeof current === 'string' ? current : path;
}

export function translate(
  lang: SupportedLanguage,
  key: string,
  params?: Record<string, string | number>
): string {
  const dict = translations[lang] || translations.en;
  let text = getNestedValue(dict, key);

  if (text === key && lang !== 'en') {
    // fallback to English
    text = getNestedValue(translations.en, key);
  }

  if (params) {
    Object.entries(params).forEach(([paramKey, val]) => {
      text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(val));
    });
  }

  return text;
}
