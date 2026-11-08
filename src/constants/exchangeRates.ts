/**
 * Baseline Exchange Rates relative to 1 USD
 * Used for instant, offline local-first conversions.
 * Users can also override any pair manually in Settings.
 */
export const BASE_RATES_TO_USD: Record<string, number> = {
  USD: 1.0,
  BDT: 121.75, // Bangladeshi Taka
  EUR: 0.94,   // Euro
  GBP: 0.79,   // British Pound
  INR: 86.80,  // Indian Rupee
  CAD: 1.42,   // Canadian Dollar
  AUD: 1.58,   // Australian Dollar
  SAR: 3.75,   // Saudi Riyal
  AED: 3.67,   // UAE Dirham
  JPY: 154.20, // Japanese Yen
  CNY: 7.28,   // Chinese Yuan
  PKR: 279.50, // Pakistani Rupee
  MYR: 4.45,   // Malaysian Ringgit
  SGD: 1.34,   // Singapore Dollar
  CHF: 0.90,   // Swiss Franc
  KWD: 0.31,   // Kuwaiti Dinar
  QAR: 3.64,   // Qatari Riyal
  BHD: 0.38,   // Bahraini Dinar
  OMR: 0.385,  // Omani Rial
  NZD: 1.72,   // New Zealand Dollar
  HKD: 7.78,   // Hong Kong Dollar
  SEK: 10.95,  // Swedish Krona
  NOK: 11.20,  // Norwegian Krone
  DKK: 7.05,   // Danish Krone
  TRY: 35.40,  // Turkish Lira
  BRL: 5.75,   // Brazilian Real
  MXN: 20.40,  // Mexican Peso
  ZAR: 18.20,  // South African Rand
  KRW: 1395.0, // South Korean Won
  THB: 34.60,  // Thai Baht
  IDR: 16100.0,// Indonesian Rupiah
  VND: 25400.0,// Vietnamese Dong
  PHP: 58.50,  // Philippine Peso
  EGP: 50.20,  // Egyptian Pound
  NGN: 1520.0, // Nigerian Naira
  KES: 129.50, // Kenyan Shilling
  GHS: 15.60,  // Ghanaian Cedi
  LKR: 292.0,  // Sri Lankan Rupee
  NPR: 138.80, // Nepalese Rupee
  RUB: 97.50,  // Russian Ruble
  PLN: 4.10,   // Polish Zloty
  CZK: 23.80,  // Czech Koruna
  HUF: 385.0,  // Hungarian Forint
  ILS: 3.70,   // Israeli New Shekel
  CLP: 970.0,  // Chilean Peso
  COP: 4350.0, // Colombian Peso
  ARS: 1010.0, // Argentine Peso
};
