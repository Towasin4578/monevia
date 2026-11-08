import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
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
  SupportedLanguage,
} from '../types';
import {
  initializeDatabase,
  dbRepo,
  DEFAULT_PREFERENCES,
  DEFAULT_PROFILE,
} from '../db/indexedDb';
import { translate } from '../i18n';
import { formatCurrency, formatDate } from '../utils/formatting';
import { convertCurrency } from '../utils/currencyConverter';
import { calculateMonthFinancials, resolveOpeningBalanceForMonth } from '../utils/accounting';

interface FinanceContextType {
  isLoaded: boolean;
  preferences: UserPreferences;
  profile: UserProfile;
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  monthlyClosings: MonthlyClosing[];
  customExchangeRates: ExchangeRateMap;

  // Translation & Localization helper
  t: (key: string, params?: Record<string, string | number>) => string;
  formatMoney: (amount: number, currency?: string) => string;
  formatDateStr: (date: string | Date, style?: 'short' | 'medium' | 'long') => string;

  // Actions
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (data: {
    language: SupportedLanguage;
    primaryCurrency: string;
    country: string;
    startingAccount: {
      name: string;
      type: Account['type'];
      balance: number;
      date: string;
    };
    profile: {
      name: string;
      email?: string;
      avatarUrl?: string;
    };
    suggestedDefaults?: {
      timezone?: string;
      dateFormat?: string;
      numberLocale?: string;
    };
  }) => Promise<void>;

  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Account>;
  updateAccount: (account: Account) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;

  addTransaction: (
    txData: Omit<Transaction, 'id' | 'baseAmount' | 'baseCurrency' | 'exchangeRate' | 'createdAt' | 'updatedAt'> & {
      customRate?: number;
    }
  ) => Promise<Transaction>;
  updateTransaction: (tx: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  saveCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  saveBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;

  saveSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
  allocateSavings: (goalId: string, amount: number, accountId: string, direction: 'deposit' | 'withdraw') => Promise<void>;

  closeMonthAccounting: (month: string, notes?: string) => Promise<MonthlyClosing>;

  saveCustomRate: (pair: string, rate: number) => Promise<void>;
  removeCustomRate: (pair: string) => Promise<void>;

  resetAllData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [monthlyClosings, setMonthlyClosings] = useState<MonthlyClosing[]>([]);
  const [customExchangeRates, setCustomExchangeRates] = useState<ExchangeRateMap>({});

  // Initialize from IndexedDB
  useEffect(() => {
    let mounted = true;
    initializeDatabase()
      .then((data) => {
        if (!mounted) return;
        setPreferences(data.preferences);
        setProfile(data.profile);
        setAccounts(data.accounts);
        setCategories(data.categories);
        setTransactions(data.transactions);
        setBudgets(data.budgets);
        setSavingsGoals(data.savingsGoals);
        setMonthlyClosings(data.monthlyClosings);
        setCustomExchangeRates(data.customExchangeRates);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to init Monevia DB:', err);
        setIsLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Theme synchronization
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      preferences.theme === 'dark' ||
      (preferences.theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [preferences.theme]);

  // Translation helper
  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return translate(preferences.language, key, params);
    },
    [preferences.language]
  );

  // Formatting helpers
  const formatMoney = useCallback(
    (amount: number, currency?: string) => {
      const curr = currency || preferences.primaryCurrency;
      return formatCurrency(amount, curr, {
        locale: preferences.numberFormatLocale,
      });
    },
    [preferences.primaryCurrency, preferences.numberFormatLocale]
  );

  const formatDateStr = useCallback(
    (date: string | Date, style: 'short' | 'medium' | 'long' = 'medium') => {
      return formatDate(
        date,
        style,
        preferences.numberFormatLocale,
        preferences.timezone
      );
    },
    [preferences.numberFormatLocale, preferences.timezone]
  );

  // Preference updates
  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    const nextPrefs: UserPreferences = {
      ...preferences,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    setPreferences(nextPrefs);
    await dbRepo.savePreferences(nextPrefs);
  };

  // Profile updates
  const updateProfile = async (updates: Partial<UserProfile>) => {
    const nextProfile: UserProfile = {
      ...profile,
      ...updates,
    };
    setProfile(nextProfile);
    await dbRepo.saveProfile(nextProfile);
  };

  // First-time onboarding complete
  const completeOnboarding = async (data: {
    language: SupportedLanguage;
    primaryCurrency: string;
    country: string;
    startingAccount: {
      name: string;
      type: Account['type'];
      balance: number;
      date: string;
    };
    profile: {
      name: string;
      email?: string;
      avatarUrl?: string;
    };
    suggestedDefaults?: {
      timezone?: string;
      dateFormat?: string;
      numberLocale?: string;
    };
  }) => {
    const now = new Date().toISOString();

    // 1. Create Primary Account
    const startingAccount: Account = {
      id: 'acc_starting_' + Date.now(),
      name: data.startingAccount.name || 'Primary Account',
      type: data.startingAccount.type || 'bank',
      currency: data.primaryCurrency,
      balance: data.startingAccount.balance,
      color: '#3563E9',
      icon: 'Wallet',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
    };

    // 2. If starting balance > 0, create starting transaction
    let initialTx: Transaction | null = null;
    if (data.startingAccount.balance > 0) {
      initialTx = {
        id: 'tx_init_' + Date.now(),
        type: 'income',
        amount: data.startingAccount.balance,
        originalCurrency: data.primaryCurrency,
        baseCurrency: data.primaryCurrency,
        baseAmount: data.startingAccount.balance,
        exchangeRate: 1.0,
        accountId: startingAccount.id,
        categoryId: 'inc_salary',
        date: data.startingAccount.date || now.split('T')[0],
        payeeOrPayer: 'Opening Balance',
        notes: 'Initial account balance during onboarding',
        createdAt: now,
        updatedAt: now,
      };
    }

    // 3. New Profile
    const newProfile: UserProfile = {
      name: data.profile.name || 'Monevia User',
      email: data.profile.email || '',
      avatarUrl: data.profile.avatarUrl || 'avatar-1',
      createdAt: now,
    };

    // 4. New Preferences
    const newPrefs: UserPreferences = {
      ...preferences,
      language: data.language,
      primaryCurrency: data.primaryCurrency,
      country: data.country || preferences.country,
      timezone: data.suggestedDefaults?.timezone || preferences.timezone,
      dateFormat: data.suggestedDefaults?.dateFormat || preferences.dateFormat,
      numberFormatLocale:
        data.suggestedDefaults?.numberLocale || preferences.numberFormatLocale,
      onboardingCompleted: true,
      lastUpdated: now,
    };

    // Persist all
    await dbRepo.addAccount(startingAccount);
    if (initialTx) {
      await dbRepo.addTransaction(initialTx);
    }
    await dbRepo.saveProfile(newProfile);
    await dbRepo.savePreferences(newPrefs);

    setAccounts([startingAccount]);
    if (initialTx) {
      setTransactions([initialTx]);
    }
    setProfile(newProfile);
    setPreferences(newPrefs);
  };

  // Account operations
  const addAccount = async (
    accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Account> => {
    const now = new Date().toISOString();
    const newAcc: Account = {
      ...accountData,
      id: 'acc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: now,
      updatedAt: now,
    };

    await dbRepo.addAccount(newAcc);
    setAccounts((prev) => [...prev, newAcc]);
    return newAcc;
  };

  const updateAccount = async (account: Account) => {
    const updated = { ...account, updatedAt: new Date().toISOString() };
    await dbRepo.updateAccount(updated);
    setAccounts((prev) => prev.map((a) => (a.id === account.id ? updated : a)));
  };

  const deleteAccount = async (id: string) => {
    await dbRepo.deleteAccount(id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  // Transaction operations
  const addTransaction = async (
    txData: Omit<
      Transaction,
      'id' | 'baseAmount' | 'baseCurrency' | 'exchangeRate' | 'createdAt' | 'updatedAt'
    > & { customRate?: number }
  ): Promise<Transaction> => {
    const now = new Date().toISOString();

    // Multi-currency conversion calculation
    const baseCurrency = preferences.primaryCurrency;
    let rate = 1.0;
    let baseAmount = txData.amount;
    let isPending = false;

    if (txData.customRate && txData.customRate > 0) {
      rate = txData.customRate;
      baseAmount = Number((txData.amount * rate).toFixed(4));
    } else {
      const conversion = convertCurrency(
        txData.amount,
        txData.originalCurrency,
        baseCurrency,
        customExchangeRates,
        preferences.multiCurrencyEnabled
      );
      rate = conversion.rate;
      baseAmount = conversion.convertedAmount;
      isPending = conversion.isPending;
    }

    const newTx: Transaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      type: txData.type,
      amount: txData.amount,
      originalCurrency: txData.originalCurrency,
      baseCurrency,
      baseAmount,
      exchangeRate: rate,
      exchangeRatePending: isPending,
      accountId: txData.accountId,
      toAccountId: txData.toAccountId,
      transferFee: txData.transferFee,
      categoryId: txData.categoryId,
      subcategoryId: txData.subcategoryId,
      date: txData.date,
      time: txData.time || new Date().toTimeString().slice(0, 5),
      payeeOrPayer: txData.payeeOrPayer,
      paymentMethod: txData.paymentMethod,
      notes: txData.notes,
      receiptUrl: txData.receiptUrl,
      receiptFileName: txData.receiptFileName,
      tags: txData.tags,
      isRecurring: txData.isRecurring,
      createdAt: now,
      updatedAt: now,
    };

    // Update account balance
    setAccounts((prevAccounts) => {
      return prevAccounts.map((acc) => {
        if (newTx.type === 'income' && acc.id === newTx.accountId) {
          // If transaction currency matches account currency, use tx amount; else convert
          const delta =
            newTx.originalCurrency === acc.currency
              ? newTx.amount
              : newTx.baseAmount;
          const updated = {
            ...acc,
            balance: Number((acc.balance + delta).toFixed(2)),
            updatedAt: now,
          };
          dbRepo.updateAccount(updated);
          return updated;
        }

        if (newTx.type === 'expense' && acc.id === newTx.accountId) {
          const delta =
            newTx.originalCurrency === acc.currency
              ? newTx.amount
              : newTx.baseAmount;
          const updated = {
            ...acc,
            balance: Number((acc.balance - delta).toFixed(2)),
            updatedAt: now,
          };
          dbRepo.updateAccount(updated);
          return updated;
        }

        if (newTx.type === 'transfer') {
          if (acc.id === newTx.accountId) {
            // Deduct from source + fee
            const totalDeduction = newTx.amount + (newTx.transferFee || 0);
            const updated = {
              ...acc,
              balance: Number((acc.balance - totalDeduction).toFixed(2)),
              updatedAt: now,
            };
            dbRepo.updateAccount(updated);
            return updated;
          }
          if (acc.id === newTx.toAccountId) {
            // Add to destination
            const updated = {
              ...acc,
              balance: Number((acc.balance + newTx.amount).toFixed(2)),
              updatedAt: now,
            };
            dbRepo.updateAccount(updated);
            return updated;
          }
        }

        return acc;
      });
    });

    await dbRepo.addTransaction(newTx);
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  const updateTransaction = async (updatedTx: Transaction) => {
    const now = new Date().toISOString();
    const finalTx = { ...updatedTx, updatedAt: now };

    // Recompute balances by rolling back previous and applying new
    // For simplicity & robustness, recalculate account balances based on full ledger
    await dbRepo.updateTransaction(finalTx);
    setTransactions((prev) =>
      prev.map((t) => (t.id === finalTx.id ? finalTx : t))
    );
  };

  const deleteTransaction = async (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    // Rollback account balances
    setAccounts((prevAccounts) => {
      return prevAccounts.map((acc) => {
        if (tx.type === 'income' && acc.id === tx.accountId) {
          const delta =
            tx.originalCurrency === acc.currency ? tx.amount : tx.baseAmount;
          const updated = {
            ...acc,
            balance: Number((acc.balance - delta).toFixed(2)),
          };
          dbRepo.updateAccount(updated);
          return updated;
        }
        if (tx.type === 'expense' && acc.id === tx.accountId) {
          const delta =
            tx.originalCurrency === acc.currency ? tx.amount : tx.baseAmount;
          const updated = {
            ...acc,
            balance: Number((acc.balance + delta).toFixed(2)),
          };
          dbRepo.updateAccount(updated);
          return updated;
        }
        if (tx.type === 'transfer') {
          if (acc.id === tx.accountId) {
            const totalDeduction = tx.amount + (tx.transferFee || 0);
            const updated = {
              ...acc,
              balance: Number((acc.balance + totalDeduction).toFixed(2)),
            };
            dbRepo.updateAccount(updated);
            return updated;
          }
          if (acc.id === tx.toAccountId) {
            const updated = {
              ...acc,
              balance: Number((acc.balance - tx.amount).toFixed(2)),
            };
            dbRepo.updateAccount(updated);
            return updated;
          }
        }
        return acc;
      });
    });

    await dbRepo.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Category operations
  const saveCategory = async (cat: Category) => {
    await dbRepo.saveCategory(cat);
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === cat.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = cat;
        return next;
      }
      return [...prev, cat];
    });
  };

  const deleteCategory = async (id: string) => {
    await dbRepo.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Budget operations
  const saveBudget = async (
    b: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const existing = budgets.find(
      (item) => item.categoryId === b.categoryId && item.month === b.month
    );

    const budgetToSave: Budget = {
      ...b,
      id: existing ? existing.id : 'bgt_' + Date.now(),
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };

    await dbRepo.saveBudget(budgetToSave);
    setBudgets((prev) => {
      const idx = prev.findIndex((item) => item.id === budgetToSave.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = budgetToSave;
        return next;
      }
      return [...prev, budgetToSave];
    });
  };

  const deleteBudget = async (id: string) => {
    await dbRepo.deleteBudget(id);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  // Savings Goal operations
  const saveSavingsGoal = async (
    goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    const now = new Date().toISOString();
    const goalToSave: SavingsGoal = {
      ...goal,
      id: goal.id || 'goal_' + Date.now(),
      createdAt: now,
      updatedAt: now,
      isCompleted: goal.currentAmount >= goal.targetAmount,
    };

    await dbRepo.saveSavingsGoal(goalToSave);
    setSavingsGoals((prev) => {
      const idx = prev.findIndex((g) => g.id === goalToSave.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = goalToSave;
        return next;
      }
      return [...prev, goalToSave];
    });
  };

  const deleteSavingsGoal = async (id: string) => {
    await dbRepo.deleteSavingsGoal(id);
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Allocate or withdraw savings
  const allocateSavings = async (
    goalId: string,
    amount: number,
    accountId: string,
    direction: 'deposit' | 'withdraw'
  ) => {
    const goal = savingsGoals.find((g) => g.id === goalId);
    const account = accounts.find((a) => a.id === accountId);
    if (!goal || !account) return;

    const delta = direction === 'deposit' ? amount : -amount;
    const nextCurrent = Math.max(0, goal.currentAmount + delta);

    // Update goal
    const updatedGoal: SavingsGoal = {
      ...goal,
      currentAmount: nextCurrent,
      isCompleted: nextCurrent >= goal.targetAmount,
      updatedAt: new Date().toISOString(),
    };
    await dbRepo.saveSavingsGoal(updatedGoal);
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === goalId ? updatedGoal : g))
    );
  };

  // Monthly closing
  const closeMonthAccounting = async (
    month: string,
    notes?: string
  ): Promise<MonthlyClosing> => {
    // 1. Resolve Opening Balance
    const initialAccSum = accounts.reduce((sum, a) => sum + a.balance, 0);
    const openingBal = resolveOpeningBalanceForMonth(
      month,
      monthlyClosings,
      initialAccSum
    );

    // 2. Calculate summary
    const summary = calculateMonthFinancials(month, transactions, openingBal);

    const closing: MonthlyClosing = {
      id: 'closing_' + month,
      month,
      openingBalance: summary.openingBalance,
      totalIncome: summary.totalIncome,
      totalExpenses: summary.totalExpenses,
      netSavings: summary.netSavings,
      closingBalance: summary.closingBalance,
      isClosed: true,
      closedAt: new Date().toISOString(),
      carriedForward: true,
      notes,
    };

    await dbRepo.saveMonthlyClosing(closing);
    setMonthlyClosings((prev) => {
      const idx = prev.findIndex((c) => c.month === month);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = closing;
        return next;
      }
      return [...prev, closing];
    });

    return closing;
  };

  // Custom Exchange Rates
  const saveCustomRate = async (pair: string, rate: number) => {
    await dbRepo.saveCustomRate(pair, rate);
    setCustomExchangeRates((prev) => ({ ...prev, [pair]: rate }));
  };

  const removeCustomRate = async (pair: string) => {
    await dbRepo.removeCustomRate(pair);
    setCustomExchangeRates((prev) => {
      const next = { ...prev };
      delete next[pair];
      return next;
    });
  };

  // Reset All Data
  const resetAllData = async () => {
    await dbRepo.clearAllData();
    const fresh = await initializeDatabase();
    setPreferences(fresh.preferences);
    setProfile(fresh.profile);
    setAccounts(fresh.accounts);
    setCategories(fresh.categories);
    setTransactions(fresh.transactions);
    setBudgets(fresh.budgets);
    setSavingsGoals(fresh.savingsGoals);
    setMonthlyClosings(fresh.monthlyClosings);
    setCustomExchangeRates(fresh.customExchangeRates);
  };

  return (
    <FinanceContext.Provider
      value={{
        isLoaded,
        preferences,
        profile,
        accounts,
        transactions,
        categories,
        budgets,
        savingsGoals,
        monthlyClosings,
        customExchangeRates,
        t,
        formatMoney,
        formatDateStr,
        updatePreferences,
        updateProfile,
        completeOnboarding,
        addAccount,
        updateAccount,
        deleteAccount,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        saveCategory,
        deleteCategory,
        saveBudget,
        deleteBudget,
        saveSavingsGoal,
        deleteSavingsGoal,
        allocateSavings,
        closeMonthAccounting,
        saveCustomRate,
        removeCustomRate,
        resetAllData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
