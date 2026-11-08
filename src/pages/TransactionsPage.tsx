import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  Paperclip,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { exportTransactionsToCSV } from '../utils/export';

interface TransactionsPageProps {
  onOpenAddTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  onOpenAddTransaction,
  onEditTransaction,
}) => {
  const {
    t,
    transactions,
    accounts,
    categories,
    deleteTransaction,
    formatMoney,
    formatDateStr,
    preferences,
  } = useFinance();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const accountMap = useMemo(
    () => new Map(accounts.map((a) => [a.id, a])),
    [accounts]
  );

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.payeeOrPayer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'all' || tx.type === filterType;
      const matchAccount =
        filterAccount === 'all' ||
        tx.accountId === filterAccount ||
        tx.toAccountId === filterAccount;
      const matchCategory =
        filterCategory === 'all' || tx.categoryId === filterCategory;

      return matchSearch && matchType && matchAccount && matchCategory;
    });
  }, [transactions, searchTerm, filterType, filterAccount, filterCategory]);

  const handleExportCSV = () => {
    exportTransactionsToCSV(
      filtered,
      accounts,
      categories,
      preferences.primaryCurrency,
      preferences.numberFormatLocale
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-navy dark:text-white tracking-tight">
            {t('transactions.title')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('transactions.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-brand-blue" />
            <span>{t('common.export')} (CSV)</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddTransaction}
            className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('transactions.addTransaction')}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
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

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">{t('transactions.allTypes')}</option>
            <option value="income">{t('nav.income')}</option>
            <option value="expense">{t('nav.expenses')}</option>
            <option value="transfer">Internal Transfers</option>
          </select>

          {/* Account Filter */}
          <select
            value={filterAccount}
            onChange={(e) => setFilterAccount(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {preferences.language === 'bn' && c.nameBn ? c.nameBn : c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-brand-border-dark">
              <tr>
                <th className="px-5 py-3.5">{t('common.date')}</th>
                <th className="px-5 py-3.5">{t('transactions.payeeOrPayer')}</th>
                <th className="px-5 py-3.5">{t('common.type')}</th>
                <th className="px-5 py-3.5">{t('common.account')}</th>
                <th className="px-5 py-3.5">{t('transactions.originalAmount')}</th>
                <th className="px-5 py-3.5 text-right">{t('transactions.convertedAmount')}</th>
                <th className="px-5 py-3.5 text-center">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-brand-border-dark">
              {filtered.length > 0 ? (
                filtered.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const isTransfer = tx.type === 'transfer';
                  const isExpense = tx.type === 'expense';
                  const cat = categoryMap.get(tx.categoryId);
                  const fromAcc = accountMap.get(tx.accountId);
                  const toAcc = tx.toAccountId ? accountMap.get(tx.toAccountId) : null;
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
                          {tx.exchangeRatePending && (
                            <span
                              title="Exchange rate pending conversion"
                              className="text-amber-500"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        {tx.notes && (
                          <div className="text-[11px] text-slate-400 font-normal truncate max-w-xs">
                            {tx.notes}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isIncome
                              ? 'bg-emerald-50 text-brand-emerald dark:bg-emerald-950/40'
                              : isTransfer
                              ? 'bg-blue-50 text-brand-blue dark:bg-blue-950/40'
                              : 'bg-rose-50 text-rose-500 dark:bg-rose-950/40'
                          }`}
                        >
                          {isIncome && <TrendingUp className="w-3 h-3" />}
                          {isTransfer && <ArrowLeftRight className="w-3 h-3" />}
                          {isExpense && <TrendingDown className="w-3 h-3" />}
                          <span className="capitalize">{tx.type}</span>
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap text-xs">
                        {isTransfer ? (
                          <div className="flex items-center gap-1 font-mono">
                            <span>{fromAcc?.name}</span>
                            <span>→</span>
                            <span className="font-bold text-brand-blue">{toAcc?.name}</span>
                          </div>
                        ) : (
                          <span>{fromAcc?.name || 'Account'}</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 font-mono text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {tx.amount.toFixed(2)} {tx.originalCurrency}
                        {isMulti && (
                          <div className="text-[10px] text-slate-400">
                            Rate: {tx.exchangeRate.toFixed(4)}
                          </div>
                        )}
                      </td>

                      <td
                        className={`px-5 py-3.5 text-right font-mono font-bold whitespace-nowrap ${
                          isIncome
                            ? 'text-brand-emerald'
                            : isTransfer
                            ? 'text-brand-blue'
                            : 'text-rose-500'
                        }`}
                      >
                        {isIncome ? '+' : isTransfer ? '' : '-'}
                        {formatMoney(tx.baseAmount)}
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
                    colSpan={7}
                    className="px-5 py-10 text-center text-xs text-slate-400"
                  >
                    No transactions match your search criteria.
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
