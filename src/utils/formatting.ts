import { getCurrencyInfo } from '../constants/currencies';

/**
 * Independent Localization & Currency Formatting Utility
 * Never hardcodes symbols. Uses ISO 4217 standard and Intl.NumberFormat.
 */

export interface FormatCurrencyOptions {
  currency: string; // ISO 4217 code
  locale?: string; // Number formatting locale e.g. 'bn-BD', 'en-US'
  showCode?: boolean; // If true, appends currency code e.g. "৳1,500.00 BDT"
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function formatCurrency(
  amount: number | null | undefined,
  currencyCode: string,
  options?: Partial<FormatCurrencyOptions>
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    amount = 0;
  }

  const currencyInfo = getCurrencyInfo(currencyCode);
  const decimals =
    options?.minimumFractionDigits !== undefined
      ? options.minimumFractionDigits
      : currencyInfo.decimals;

  const locale = options?.locale || 'en-US';

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: decimals,
      maximumFractionDigits: options?.maximumFractionDigits ?? decimals,
    });

    const formatted = formatter.format(amount);

    if (options?.showCode) {
      return `${formatted} ${currencyCode}`;
    }
    return formatted;
  } catch (err) {
    // Graceful fallback if a rare currency code is not supported by standard browser Intl
    const symbol = currencyInfo.symbol || currencyCode;
    const formattedNum = amount.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${symbol}${formattedNum}`;
  }
}

/**
 * Format pure numbers based on user's number formatting locale
 */
export function formatNumber(
  value: number,
  locale = 'en-US',
  decimals = 2
): string {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch {
    return value.toFixed(decimals);
  }
}

/**
 * Format Dates independently of language or currency
 */
export function formatDate(
  dateInput: string | Date,
  formatStyle: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale = 'en-US',
  timezone?: string
): string {
  if (!dateInput) return '';

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
    };

    if (formatStyle === 'short') {
      options.year = 'numeric';
      options.month = '2-digit';
      options.day = '2-digit';
    } else if (formatStyle === 'medium') {
      options.year = 'numeric';
      options.month = 'short';
      options.day = 'numeric';
    } else if (formatStyle === 'long') {
      options.year = 'numeric';
      options.month = 'long';
      options.day = 'numeric';
      options.weekday = 'short';
    } else {
      options.year = 'numeric';
      options.month = 'long';
      options.day = 'numeric';
      options.weekday = 'long';
    }

    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return date.toISOString().split('T')[0];
  }
}

/**
 * Format Month Year e.g. "November 2026" or "নভেম্বর ২০২৬"
 */
export function formatMonthYear(
  monthStr: string, // YYYY-MM
  locale = 'en-US'
): string {
  if (!monthStr || !monthStr.includes('-')) return monthStr;
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
}

/**
 * Generate preview example for onboarding currency selector
 */
export function getCurrencyPreview(currencyCode: string, locale = 'en-US'): string {
  return formatCurrency(1500, currencyCode, { locale });
}
