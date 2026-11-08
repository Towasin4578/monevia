import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  TrendingUp,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  Wallet,
  Tag,
  Paperclip,
} from 'lucide-react';
import { Transaction } from '../types';

interface IncomePageProps {
  onOpenAddIncome: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const IncomePage: React.FC<IncomePageProps> = ({
  onOpenAddIncome,
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

  const incomeTransactions = useMemo(
    () => transactions.filter((t) => t.type === 'income'),
    [transactions]
  );

  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === 'income'),
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
    return incomeTransactions.filter((tx) => {
      const matchSearch =
        tx.payeeOrPayer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === 'all' || tx.categoryId === selectedCategory;
      const matchAccount =
        selectedAccount === 'all' || tx.accountId === selectedAccount;
      return matchSearch && matchCategory && matchAccount;
    });
  }, [incomeTransactions, searchTerm, selectedCategory, selectedAccount]);

  const totalFilteredIncome = useMemo(
    () => filtered.reduce((sum, tx) => sum + tx.baseAmount, 0),
    [filtered]
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-navy dark:text-white tracking-tight">
            {t('nav.income')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track salaries, freelance revenue, investments, gifts, and support.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddIncome}
          className="px-4 py-2.5 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('transactions.addIncome')}</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-card flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-100 font-bold">
            Total Recorded Income
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono mt-1">
            {formatMoney(totalFilteredIncome)}
          </div>
          <span className="text-xs text-emerald-100/80 mt-1 block">
            {filtered.length} transactions in view
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md">
          <TrendingUp className="w-8 h-8" />
        </div>
      </div>

      {/* Filters & Search */}
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

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-44 px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {incomeCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {preferences.language === 'bn' && c.nameBn ? c.nameBn : c.name}
              </option>
            ))}
          </select>

          {/* Account Filter */}
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full md:w-44 px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Income Records Table */}
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
                            <span title="Has attached receipt" className="text-brand-blue">
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
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald text-xs font-semibold">
                          <Tag className="w-3 h-3" />
                          <span>
                            {preferences.language === 'bn' && cat?.nameBn
                              ? cat.nameBn
                              : cat?.name || 'Income'}
                          </span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Wallet className="w-3.5 h-3.5 text-slate-400" />
                          <span>{acc?.name || 'Account'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-brand-emerald whitespace-nowrap">
                        +{formatMoney(tx.baseAmount)}
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
                    No income records found matching your filters.
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
