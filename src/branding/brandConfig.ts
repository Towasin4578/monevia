/**
 * Centralized Brand Configuration for Monevia
 * Brand Name and Tagline are centralized here for global consistency.
 */
export const BRAND_CONFIG = {
  name: 'Monevia',
  legalName: 'Monevia Technologies Inc.',
  tagline: 'Your Money. Your Control.',
  taglineBengali: 'আপনার অর্থ। আপনার নিয়ন্ত্রণ।',
  description: 'Global Personal Finance & Multi-Currency Expense Management Platform',
  version: '1.0.0',
  foundedYear: 2026,
  colors: {
    navy: '#142D4E',
    navyDark: '#0B1B30',
    navyLight: '#1E3E6B',
    blue: '#3563E9',
    blueHover: '#2B50C7',
    blueLight: '#EEF2FF',
    emerald: '#16A36A',
    emeraldLight: '#ECFDF5',
    teal: '#0F9D8A',
    tealLight: '#E6F8F6',
    white: '#FFFFFF',
    background: '#F5F7FB',
    danger: '#EF4444',
    warning: '#F59E0B',
  },
  social: {
    website: 'https://monevia.finance',
    support: 'support@monevia.finance',
  },
} as const;

export type BrandConfig = typeof BRAND_CONFIG;
