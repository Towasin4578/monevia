/**
 * Monevia - Core Data Models and Types
 */

export type AccountType =
  | 'cash'
  | 'bank'
  | 'debit_card'
  | 'credit_card'
  | 'digital_wallet'
  | 'mobile_money'
  | 'investment'
  | 'other';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: string; // ISO 4217 code
  balance: number; // in standard unit, e.g., 1500.50
  institution?: string;
  accountNumberMasked?: string;
  color: string;
  icon: string;
  isDefault?: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // Original amount in originalCurrency
  originalCurrency: string; // ISO 4217 code
  baseCurrency: string; // User's primary base currency at time of transaction
  baseAmount: number; // Converted amount into primary base currency
  exchangeRate: number; // Snapshot of exchange rate (baseAmount = amount * exchangeRate)
  exchangeRatePending?: boolean; // True if rate could not be determined at time of creation
  accountId: string; // Source account (or destination for income)
  toAccountId?: string; // For transfers only
  transferFee?: number; // Fee for transfer if applicable
  categoryId: string; // Category identifier
  subcategoryId?: string; // Optional subcategory identifier
  date: string; // ISO YYYY-MM-DD
  time?: string; // HH:mm
  payeeOrPayer: string; // Source or recipient
  paymentMethod?: string;
  notes?: string;
  receiptUrl?: string; // Base64 data or URL
  receiptFileName?: string;
  tags?: string[];
  isRecurring?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameBn?: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  subcategories: Subcategory[];
  isDefault?: boolean;
  isCustom?: boolean;
}

export interface Subcategory {
  id: string;
  name: string;
  nameBn?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  month: string; // YYYY-MM
  amountLimit: number; // in base currency
  notify50?: boolean;
  notify80?: boolean;
  notify100?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate: string; // YYYY-MM-DD
  linkedAccountId?: string;
  color: string;
  icon: string;
  notes?: string;
  isCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyClosing {
  id: string;
  month: string; // YYYY-MM
  openingBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  closingBalance: number;
  isClosed: boolean;
  closedAt?: string;
  carriedForward: boolean;
  notes?: string;
}

export type SupportedLanguage = 'en' | 'bn';
export type AppTheme = 'light' | 'dark' | 'system';

export interface UserPreferences {
  language: SupportedLanguage;
  country: string; // ISO 3166-1 alpha-2 code e.g. 'BD', 'US'
  primaryCurrency: string; // ISO 4217 code e.g. 'BDT', 'USD'
  multiCurrencyEnabled: boolean;
  timezone: string; // e.g. 'Asia/Dhaka', 'America/New_York'
  dateFormat: string; // 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY'
  numberFormatLocale: string; // 'en-US' | 'bn-BD' | 'en-GB' etc.
  theme: AppTheme;
  budgetAlertsEnabled: boolean;
  notifyAt50: boolean;
  notifyAt80: boolean;
  notifyAt100: boolean;
  onboardingCompleted: boolean;
  lastUpdated: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  countryCode: string;
  flag: string;
}

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  defaultCurrency: string;
  defaultTimezone: string;
  defaultDateFormat: string;
  defaultNumberLocale: string;
}

export interface ExchangeRateMap {
  [currencyPair: string]: number; // e.g. "USD_BDT": 121.50
}
