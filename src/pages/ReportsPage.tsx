import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  FileBarChart2,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  TrendingDown,
  Coins,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';
import { exportTransactionsToCSV, printCurrentReport } from '../utils/export';

export const ReportsPage: React.FC = () => {
  const {
    t,
    transactions,
    accounts,
    categories,
    formatMoney,
    formatDateStr,
    preferences,
  } = useFinance();

  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [reportType, setReportType] = useState<'monthly' | 'yearly'>('monthly');

  const selectedYear = selectedMonth.slice(0, 4);

  // Relevant transactions
  const filteredTxs = useMemo(() => {
    return transactions.filter((tx) =>
      reportType === 'monthly'
        ? tx.date.startsWith(selectedMonth)
        : tx.date.startsWith(selectedYear)
    );
  }, [transactions, selectedMonth, selectedYear, reportType]);

  const totalIncome = useMemo(
    () =>
      filteredTxs
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.baseAmount, 0),
    [filteredTxs]
  );

  const totalExpense = useMemo(
    () =>
      filteredTxs
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.baseAmount, 0),
    [filteredTxs]
  );

  const netSavings = totalIncome - totalExpense;

  // Category breakdown for expenses
  const categoryExpenses = useMemo(() => {
    const map = new Map<string, number>();
    filteredTxs
      .filter((t) => t.type === 'expense')
      .forEach((tx) => {
        map.set(tx.categoryId, (map.get(tx.categoryId) || 0) + tx.baseAmount);
      });

    const catMap = new Map(categories.map((c) => [c.id, c]));

    return Array.from(map.entries())
      .map(([catId, amount]) => {
        const cat = catMap.get(catId);
        return {
          name:
            preferences.language === 'bn' && cat?.nameBn
              ? cat.nameBn
              : cat?.name || 'General',
          amount: Math.round(amount),
          color: cat?.color || '#3563E9',
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTxs, categories, preferences.language]);

  // Income sources breakdown
  const incomeSources = useMemo(() => {
    const map = new Map<string, number>();
    filteredTxs
      .filter((t) => t.type === 'income')
      .forEach((tx) => {
        map.set(tx.categoryId, (map.get(tx.categoryId) || 0) + tx.baseAmount);
      });

    const catMap = new Map(categories.map((c) => [c.id, c]));

    return Array.from(map.entries())
      .map(([catId, amount]) => {
        const cat = catMap.get(catId);
        return {
          name:
            preferences.language === 'bn' && cat?.nameBn
              ? cat.nameBn
              : cat?.name || 'Income',
          amount: Math.round(amount),
          color: cat?.color || '#16A36A',
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTxs, categories, preferences.language]);

  // Currency Exposure Breakdown
  const currencyExposure = useMemo(() => {
    const map = new Map<string, number>();
    filteredTxs.forEach((tx) => {
      map.set(
        tx.originalCurrency,
        (map.get(tx.originalCurrency) || 0) + tx.baseAmount
      );
    });

    return Array.from(map.entries()).map(([curr, baseEquiv]) => ({
      currency: curr,
      baseEquivalent: Math.round(baseEquiv),
    }));
  }, [filteredTxs]);

  const handleExportCSV = () => {
    exportTransactionsToCSV(
      filteredTxs,
      accounts,
      categories,
      preferences.primaryCurrency,
      preferences.numberFormatLocale
    );
  };

  const COLORS = ['#EF4444', '#3563E9', '#16A36A', '#F59E0B', '#8B5CF6', '#EC4899', '#0F9D8A'];

  return (
    <div className="space-y-6 animate-fadeIn pb-12 print:p-0 print:m-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-black text-brand-navy dark:text-white tracking-tight">
            {t('reports.title')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('reports.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setReportType('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                reportType === 'monthly'
                  ? 'bg-white dark:bg-brand-card-dark text-brand-blue shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              {t('reports.monthlyReport')}
            </button>
            <button
              type="button"
              onClick={() => setReportType('yearly')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                reportType === 'yearly'
                  ? 'bg-white dark:bg-brand-card-dark text-brand-blue shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              {t('reports.yearlyReport')}
            </button>
          </div>

          {reportType === 'monthly' ? (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-brand-card-dark text-xs font-bold text-slate-800 dark:text-white focus:outline-none"
            />
          ) : (
            <span className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-brand-card-dark text-xs font-bold font-mono">
              Year {selectedYear}
            </span>
          )}

          {/* Export Actions */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title={t('reports.exportCSV')}
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={printCurrentReport}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title={t('reports.exportPDF')}
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block p-4 border-b border-slate-200 mb-6">
        <h1 className="text-2xl font-black text-brand-navy">Monevia Financial Statement</h1>
        <p className="text-xs text-slate-500">
          Period: {reportType === 'monthly' ? selectedMonth : selectedYear} • Reporting Currency: {preferences.primaryCurrency}
        </p>
      </div>

      {/* 3 Executive Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Period Income
            </span>
            <TrendingUp className="w-4 h-4 text-brand-emerald" />
          </div>
          <div className="text-2xl font-black font-mono text-brand-emerald">
            +{formatMoney(totalIncome)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Period Expenses
            </span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-500">
            -{formatMoney(totalExpense)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Net Savings Margin
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                netSavings >= 0 ? 'bg-emerald-50 text-brand-emerald' : 'bg-rose-50 text-rose-500'
              }`}
            >
              {totalIncome > 0
                ? `${Math.round((netSavings / totalIncome) * 100)}% margin`
                : '0%'}
            </span>
          </div>
          <div
            className={`text-2xl font-black font-mono ${
              netSavings >= 0 ? 'text-brand-emerald' : 'text-rose-500'
            }`}
          >
            {netSavings >= 0 ? '+' : ''}
            {formatMoney(netSavings)}
          </div>
        </div>
      </div>

      {/* Row 2: Category Spending vs Income Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle space-y-4">
          <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
            {t('reports.categoryBreakdown')}
          </h3>

          <div className="space-y-3">
            {categoryExpenses.length > 0 ? (
              categoryExpenses.map((cat, i) => {
                const pct =
                  totalExpense > 0
                    ? Math.round((cat.amount / totalExpense) * 100)
                    : 0;

                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.name}</span>
                      </span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {formatMoney(cat.amount)} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: cat.color || '#3563E9',
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No expense transactions in this period.
              </div>
            )}
          </div>
        </div>

        {/* Income by Source */}
        <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle space-y-4">
          <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
            {t('reports.incomeSources')}
          </h3>

          <div className="space-y-3">
            {incomeSources.length > 0 ? (
              incomeSources.map((cat, i) => {
                const pct =
                  totalIncome > 0
                    ? Math.round((cat.amount / totalIncome) * 100)
                    : 0;

                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.name}</span>
                      </span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        +{formatMoney(cat.amount)} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-emerald"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No income transactions in this period.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Multi-Currency Exposure Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
              {t('reports.currencyExposure')}
            </h3>
            <p className="text-xs text-slate-400">
              Transactions partitioned by original currency and evaluated in {preferences.primaryCurrency}
            </p>
          </div>
          <Coins className="w-5 h-5 text-brand-blue" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {currencyExposure.map((c, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
            >
              <div className="text-xs font-mono font-bold text-brand-blue">
                {c.currency}
              </div>
              <div className="text-base font-black font-mono mt-1 text-slate-800 dark:text-white">
                {formatMoney(c.baseEquivalent)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
