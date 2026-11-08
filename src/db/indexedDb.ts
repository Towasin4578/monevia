import { openDB, DBSchema, IDBPDatabase } from 'idb';
import {
  Account,
  Transaction,
  Category,
  Budget,
  SavingsGoal,
  MonthlyClosing,
  UserPreferences,
  UserProfile,
  ExchangeRateMap,
} from '../types';
import { ALL_DEFAULT_CATEGORIES } from '../constants/categories';

interface MoneviaDB extends DBSchema {
  accounts: {
    key: string;
    value: Account;
    indexes: { 'by-currency': string };
  };
  transactions: {
    key: string;
    value: Transaction;
    indexes: {
      'by-date': string;
      'by-account': string;
      'by-category': string;
      'by-type': string;
    };
  };
  categories: {
    key: string;
    value: Category;
    indexes: { 'by-type': string };
  };
  budgets: {
    key: string;
    value: Budget;
    indexes: { 'by-month': string; 'by-category': string };
  };
  savingsGoals: {
    key: string;
    value: SavingsGoal;
  };
  monthlyClosings: {
    key: string; // YYYY-MM
    value: MonthlyClosing;
  };
  preferences: {
    key: string;
    value: UserPreferences;
  };
  profile: {
    key: string;
    value: UserProfile;
  };
  customExchangeRates: {
    key: string;
    value: { pair: string; rate: number; updatedAt: string };
  };
}

const DB_NAME = 'monevia_local_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<MoneviaDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<MoneviaDB>> {
  if (!dbPromise) {
    dbPromise = openDB<MoneviaDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Accounts store
        if (!db.objectStoreNames.contains('accounts')) {
          const accStore = db.createObjectStore('accounts', { keyPath: 'id' });
          accStore.createIndex('by-currency', 'currency');
        }

        // Transactions store
        if (!db.objectStoreNames.contains('transactions')) {
          const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
          txStore.createIndex('by-date', 'date');
          txStore.createIndex('by-account', 'accountId');
          txStore.createIndex('by-category', 'categoryId');
          txStore.createIndex('by-type', 'type');
        }

        // Categories store
        if (!db.objectStoreNames.contains('categories')) {
          const catStore = db.createObjectStore('categories', { keyPath: 'id' });
          catStore.createIndex('by-type', 'type');
        }

        // Budgets store
        if (!db.objectStoreNames.contains('budgets')) {
          const bStore = db.createObjectStore('budgets', { keyPath: 'id' });
          bStore.createIndex('by-month', 'month');
          bStore.createIndex('by-category', 'categoryId');
        }

        // Savings goals store
        if (!db.objectStoreNames.contains('savingsGoals')) {
          db.createObjectStore('savingsGoals', { keyPath: 'id' });
        }

        // Monthly closings store
        if (!db.objectStoreNames.contains('monthlyClosings')) {
          db.createObjectStore('monthlyClosings', { keyPath: 'month' });
        }

        // Preferences store
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'id' });
        }

        // Profile store
        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile', { keyPath: 'id' });
        }

        // Custom Exchange Rates store
        if (!db.objectStoreNames.contains('customExchangeRates')) {
          db.createObjectStore('customExchangeRates', { keyPath: 'pair' });
        }
      },
    });
  }
  return dbPromise;
}

// Default user preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  country: 'BD',
  primaryCurrency: 'BDT',
  multiCurrencyEnabled: true,
  timezone: 'Asia/Dhaka',
  dateFormat: 'DD/MM/YYYY',
  numberFormatLocale: 'en-US',
  theme: 'light',
  budgetAlertsEnabled: true,
  notifyAt50: true,
  notifyAt80: true,
  notifyAt100: true,
  onboardingCompleted: false,
  lastUpdated: new Date().toISOString(),
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Monevia Explorer',
  email: '',
  avatarUrl: 'avatar-1',
  createdAt: new Date().toISOString(),
};

/**
 * Initialize and seed initial dataset if stores are empty
 */
export async function initializeDatabase(): Promise<{
  preferences: UserPreferences;
  profile: UserProfile;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  monthlyClosings: MonthlyClosing[];
  customExchangeRates: ExchangeRateMap;
}> {
  const db = await getDB();

  // 1. Preferences
  let pref = (await db.get('preferences', 'current')) as any;
  if (!pref) {
    const toSave = { id: 'current', ...DEFAULT_PREFERENCES };
    await db.put('preferences', toSave as any);
    pref = toSave;
  }

  // 2. Profile
  let prof = (await db.get('profile', 'current')) as any;
  if (!prof) {
    const toSave = { id: 'current', ...DEFAULT_PROFILE };
    await db.put('profile', toSave as any);
    prof = toSave;
  }

  // 3. Categories
  let cats = await db.getAll('categories');
  if (!cats || cats.length === 0) {
    const tx = db.transaction('categories', 'readwrite');
    for (const c of ALL_DEFAULT_CATEGORIES) {
      await tx.store.put(c);
    }
    await tx.done;
    cats = await db.getAll('categories');
  }

  // 4. Accounts
  let accs = await db.getAll('accounts');

  // 5. Transactions
  let txs = await db.getAll('transactions');

  // 6. Budgets
  let bgts = await db.getAll('budgets');

  // 7. Savings Goals
  let sGoals = await db.getAll('savingsGoals');

  // 8. Monthly Closings
  let mClosings = await db.getAll('monthlyClosings');

  // 9. Custom Exchange Rates
  const rateRows = await db.getAll('customExchangeRates');
  const customRates: ExchangeRateMap = {};
  for (const row of rateRows) {
    customRates[row.pair] = row.rate;
  }

  return {
    preferences: pref,
    profile: prof,
    accounts: accs,
    categories: cats,
    transactions: txs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    budgets: bgts,
    savingsGoals: sGoals,
    monthlyClosings: mClosings,
    customExchangeRates: customRates,
  };
}

/**
 * Repository API
 */
export const dbRepo = {
  // Preferences & Profile
  async savePreferences(prefs: UserPreferences): Promise<void> {
    const db = await getDB();
    await db.put('preferences', { id: 'current', ...prefs } as any);
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    const db = await getDB();
    await db.put('profile', { id: 'current', ...profile } as any);
  },

  // Accounts
  async addAccount(acc: Account): Promise<void> {
    const db = await getDB();
    await db.put('accounts', acc);
  },

  async updateAccount(acc: Account): Promise<void> {
    const db = await getDB();
    await db.put('accounts', acc);
  },

  async deleteAccount(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('accounts', id);
  },

  // Transactions
  async addTransaction(tx: Transaction): Promise<void> {
    const db = await getDB();
    await db.put('transactions', tx);
  },

  async updateTransaction(tx: Transaction): Promise<void> {
    const db = await getDB();
    await db.put('transactions', tx);
  },

  async deleteTransaction(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('transactions', id);
  },

  // Categories
  async saveCategory(cat: Category): Promise<void> {
    const db = await getDB();
    await db.put('categories', cat);
  },

  async deleteCategory(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('categories', id);
  },

  // Budgets
  async saveBudget(b: Budget): Promise<void> {
    const db = await getDB();
    await db.put('budgets', b);
  },

  async deleteBudget(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('budgets', id);
  },

  // Savings
  async saveSavingsGoal(goal: SavingsGoal): Promise<void> {
    const db = await getDB();
    await db.put('savingsGoals', goal);
  },

  async deleteSavingsGoal(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('savingsGoals', id);
  },

  // Monthly Closings
  async saveMonthlyClosing(mc: MonthlyClosing): Promise<void> {
    const db = await getDB();
    await db.put('monthlyClosings', mc);
  },

  // Custom Exchange Rates
  async saveCustomRate(pair: string, rate: number): Promise<void> {
    const db = await getDB();
    await db.put('customExchangeRates', {
      pair,
      rate,
      updatedAt: new Date().toISOString(),
    });
  },

  async removeCustomRate(pair: string): Promise<void> {
    const db = await getDB();
    await db.delete('customExchangeRates', pair);
  },

  // Clear all data (Reset Danger Zone)
  async clearAllData(): Promise<void> {
    const db = await getDB();
    const stores = [
      'accounts',
      'transactions',
      'categories',
      'budgets',
      'savingsGoals',
      'monthlyClosings',
      'preferences',
      'profile',
      'customExchangeRates',
    ] as const;

    for (const store of stores) {
      await db.clear(store as any);
    }
  },
};
