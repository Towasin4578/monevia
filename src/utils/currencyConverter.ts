import { BASE_RATES_TO_USD } from '../constants/exchangeRates';
import { ExchangeRateMap } from '../types';

/**
 * Multi-Currency Engine
 * Computes exchange rates between any pair of currencies, records snapshots,
 * and maintains audit integrity.
 */

export interface ConversionResult {
  fromCurrency: string;
  toCurrency: string;
  originalAmount: number;
  convertedAmount: number;
  rate: number;
  isPending: boolean;
  rateSource: 'custom' | 'system' | 'identity' | 'pending';
}

export function getExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  customRates: ExchangeRateMap = {}
): { rate: number; isPending: boolean; rateSource: 'custom' | 'system' | 'identity' | 'pending' } {
  if (fromCurrency === toCurrency) {
    return { rate: 1.0, isPending: false, rateSource: 'identity' };
  }

  // 1. Check custom user-defined rates
  const directPair = `${fromCurrency}_${toCurrency}`;
  const reversePair = `${toCurrency}_${fromCurrency}`;

  if (customRates[directPair] !== undefined && customRates[directPair] > 0) {
    return { rate: customRates[directPair], isPending: false, rateSource: 'custom' };
  }
  if (customRates[reversePair] !== undefined && customRates[reversePair] > 0) {
    return { rate: 1 / customRates[reversePair], isPending: false, rateSource: 'custom' };
  }

  // 2. Check base table via USD bridge
  const fromRateToUSD = BASE_RATES_TO_USD[fromCurrency];
  const toRateToUSD = BASE_RATES_TO_USD[toCurrency];

  if (fromRateToUSD !== undefined && toRateToUSD !== undefined && fromRateToUSD > 0) {
    // 1 USD = fromRateToUSD (From), 1 USD = toRateToUSD (To)
    // 1 From = (toRateToUSD / fromRateToUSD) To
    const calculatedRate = toRateToUSD / fromRateToUSD;
    return { rate: calculatedRate, isPending: false, rateSource: 'system' };
  }

  // 3. Fallback: Rate unknown / pending
  return { rate: 1.0, isPending: true, rateSource: 'pending' };
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  customRates: ExchangeRateMap = {},
  multiCurrencyEnabled = true
): ConversionResult {
  if (!multiCurrencyEnabled || fromCurrency === toCurrency) {
    return {
      fromCurrency,
      toCurrency,
      originalAmount: amount,
      convertedAmount: amount,
      rate: 1.0,
      isPending: false,
      rateSource: 'identity',
    };
  }

  const { rate, isPending, rateSource } = getExchangeRate(
    fromCurrency,
    toCurrency,
    customRates
  );

  const convertedAmount = isPending ? amount : Number((amount * rate).toFixed(4));

  return {
    fromCurrency,
    toCurrency,
    originalAmount: amount,
    convertedAmount,
    rate,
    isPending,
    rateSource,
  };
}
