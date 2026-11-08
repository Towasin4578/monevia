import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  TrendingDown,
  Plus,
  Search,
  Trash2,
  Edit2,
  Wallet,
  Tag,
  Paperclip,
  Layers,
} from 'lucide-react';
import { Transaction } from '../types';

interface ExpensesPageProps {
  onOpenAddExpense: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({
  onOpenAddExpense,
  onEditTransaction,
}) => {
  const {
    t,
    transactions,
    categories,
    accounts,
    deleteTransaction,
    formatMoney,
    formatDateStr,
    preferences,
  } = useFinance();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  const expenseTransactions = useMemo(
    () => transactions.filter((t) => t.type === 'expense'),
    [transactions]
  );

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === 'expense'),
    [categories]
  );

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const accountMap = useMemo(
    () => new Map(accounts.map((a) => [a.id, a])),
    [accounts]
  );

  // Filtered List
  const filtered = useMemo(() => {
    return expenseTransactions.filter((tx) => {
      const matchSearch =
        tx.payeeOrPayer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === 'all' || tx.categoryId === selectedCategory;
      const matchAccount =
        selectedAccount === 'all' || tx.accountId === selectedAccount;
      return matchSearch && matchCategory && matchAccount;
    });
  }, [expenseTransactions, searchTerm, selectedCategory, selectedAccount]);

  const totalFilteredExpense = useMemo(
    () => filtered.reduce((sum, tx) => sum + tx.baseAmount, 0),
    [filtered]
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-navy dark:text-white tracking-tight">
            {t('nav.expenses')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Categorized expenditures across Food, Housing, Transport, Education, and Personal.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddExpense}
          className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('transactions.addExpense')}</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-card flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-rose-100 font-bold">
            Total Recorded Expenses
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono mt-1">
            {formatMoney(totalFilteredExpense)}
          </div>
          <span className="text-xs text-rose-100/80 mt-1 block">
            {filtered.length} transactions in view
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md">
          <TrendingDown className="w-8 h-8" />
        </div>
      </div>

      {/* Category Pills Quick Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-brand-blue text-white shadow-sm'
              : 'bg-white dark:bg-brand-card-dark text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-brand-border-dark hover:border-slate-300'
          }`}
        >
          All ({expenseTransactions.length})
        </button>
        {expenseCategories.map((c) => {
          const count = expenseTransactions.filter((tx) => tx.categoryId === c.id).length;
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-white dark:bg-brand-card-dark text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-brand-border-dark hover:border-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              <span>
                {preferences.language === 'bn' && c.nameBn ? c.nameBn : c.name} ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Account Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('common.search')}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-800 dark:text-white"
          />
        </div>

        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="w-full md:w-52 px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="all">All Accounts</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-brand-border-dark">
              <tr>
                <th className="px-5 py-3.5">{t('common.date')}</th>
                <th className="px-5 py-3.5">{t('transactions.payeeOrPayer')}</th>
                <th className="px-5 py-3.5">{t('common.category')}</th>
                <th className="px-5 py-3.5">{t('common.account')}</th>
                <th className="px-5 py-3.5 text-right">{t('common.amount')}</th>
                <th className="px-5 py-3.5 text-center">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-brand-border-dark">
              {filtered.length > 0 ? (
                filtered.map((tx) => {
                  const cat = categoryMap.get(tx.categoryId);
                  const sub = cat?.subcategories.find((s) => s.id === tx.subcategoryId);
                  const acc = accountMap.get(tx.accountId);
                  const isMulti =
                    tx.originalCurrency !== preferences.primaryCurrency;

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {formatDateStr(tx.date, 'medium')}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span>{tx.payeeOrPayer}</span>
                          {tx.receiptUrl && (
                            <span title="Receipt attached" className="text-brand-blue">
                              <Paperclip className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        {tx.notes && (
                          <div className="text-[11px] text-slate-400 font-normal truncate max-w-xs">
                            {tx.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-semibold w-max">
                            <Tag className="w-3 h-3" />
                            <span>
                              {preferences.language === 'bn' && cat?.nameBn
                                ? cat.nameBn
                                : cat?.name || 'Expense'}
                            </span>
                          </span>
                          {sub && (
                            <span className="text-[11px] text-slate-400 pl-1">
                              ↳{' '}
                              {preferences.language === 'bn' && sub.nameBn
                                ? sub.nameBn
                                : sub.name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Wallet className="w-3.5 h-3.5 text-slate-400" />
                          <span>{acc?.name || 'Account'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-rose-500 whitespace-nowrap">
                        -{formatMoney(tx.baseAmount)}
                        {isMulti && (
                          <div className="text-[10px] text-slate-400">
                            orig: {tx.amount.toFixed(2)} {tx.originalCurrency}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onEditTransaction(tx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-blue hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTransaction(tx.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-xs text-slate-400"
                  >
                    No expense records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
