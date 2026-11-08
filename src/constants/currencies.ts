import { CurrencyInfo } from '../types';

export const CURRENCIES: CurrencyInfo[] = [
  // High Priority / Popular Currencies
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', decimals: 2, countryCode: 'BD', flag: '🇧🇩' },
  { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2, countryCode: 'US', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2, countryCode: 'EU', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2, countryCode: 'GB', flag: '🇬🇧' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimals: 2, countryCode: 'IN', flag: '🇮🇳' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', decimals: 2, countryCode: 'CA', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimals: 2, countryCode: 'AU', flag: '🇦🇺' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', decimals: 2, countryCode: 'SA', flag: '🇸🇦' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', decimals: 2, countryCode: 'AE', flag: '🇦🇪' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimals: 0, countryCode: 'JP', flag: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', decimals: 2, countryCode: 'CN', flag: '🇨🇳' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', decimals: 2, countryCode: 'PK', flag: '🇵🇰' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', decimals: 2, countryCode: 'MY', flag: '🇲🇾' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimals: 2, countryCode: 'SG', flag: '🇸🇬' },

  // Worldwide Expanded ISO 4217 Currencies
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimals: 2, countryCode: 'CH', flag: '🇨🇭' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', decimals: 3, countryCode: 'KW', flag: '🇰🇼' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', decimals: 2, countryCode: 'QA', flag: '🇶🇦' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', decimals: 3, countryCode: 'BH', flag: '🇧🇭' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'OMR', decimals: 3, countryCode: 'OM', flag: '🇴🇲' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', decimals: 2, countryCode: 'NZ', flag: '🇳🇿' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', decimals: 2, countryCode: 'HK', flag: '🇭🇰' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', decimals: 2, countryCode: 'SE', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', decimals: 2, countryCode: 'NO', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', decimals: 2, countryCode: 'DK', flag: '🇩🇰' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', decimals: 2, countryCode: 'TR', flag: '🇹🇷' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimals: 2, countryCode: 'BR', flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', decimals: 2, countryCode: 'MX', flag: '🇲🇽' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', decimals: 2, countryCode: 'ZA', flag: '🇿🇦' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', decimals: 0, countryCode: 'KR', flag: '🇰🇷' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', decimals: 2, countryCode: 'TH', flag: '🇹🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', decimals: 0, countryCode: 'ID', flag: '🇮🇩' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', decimals: 0, countryCode: 'VN', flag: '🇻🇳' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', decimals: 2, countryCode: 'PH', flag: '🇵🇭' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', decimals: 2, countryCode: 'EG', flag: '🇪🇬' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', decimals: 2, countryCode: 'NG', flag: '🇳🇬' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', decimals: 2, countryCode: 'KE', flag: '🇰🇪' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', decimals: 2, countryCode: 'GH', flag: '🇬🇭' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', decimals: 2, countryCode: 'LK', flag: '🇱🇰' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs', decimals: 2, countryCode: 'NP', flag: '🇳🇵' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', decimals: 2, countryCode: 'RU', flag: '🇷🇺' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', decimals: 2, countryCode: 'PL', flag: '🇵🇱' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', decimals: 2, countryCode: 'CZ', flag: '🇨🇿' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', decimals: 0, countryCode: 'HU', flag: '🇭🇺' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', decimals: 2, countryCode: 'IL', flag: '🇮🇱' },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$', decimals: 0, countryCode: 'CL', flag: '🇨🇱' },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COL$', decimals: 0, countryCode: 'CO', flag: '🇨🇴' },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'ARS$', decimals: 2, countryCode: 'AR', flag: '🇦🇷' },
];

export const CURRENCY_MAP = new Map<string, CurrencyInfo>(
  CURRENCIES.map((c) => [c.code, c])
);

export function getCurrencyInfo(code: string): CurrencyInfo {
  return (
    CURRENCY_MAP.get(code) || {
      code,
      name: code,
      symbol: code,
      decimals: 2,
      countryCode: 'XX',
      flag: '🌐',
    }
  );
}
