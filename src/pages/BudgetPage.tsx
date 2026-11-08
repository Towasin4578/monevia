import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  PieChart as PieIcon,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  Calendar,
  BellRing,
} from 'lucide-react';
import { Budget } from '../types';

interface BudgetPageProps {
  onOpenCreateBudget: () => void;
  onEditBudget: (b: Budget) => void;
}

export const BudgetPage: React.FC<BudgetPageProps> = ({
  onOpenCreateBudget,
  onEditBudget,
}) => {
  const {
    t,
    budgets,
    categories,
    transactions,
    deleteBudget,
    formatMoney,
    preferences,
  } = useFinance();

  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);

  const monthBudgets = useMemo(
    () => budgets.filter((b) => b.month === selectedMonth),
    [budgets, selectedMonth]
  );

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  // Calculate actual spending for each category in the selected month
  const categorySpendingMap = useMemo(() => {
    const map = new Map<string, number>();
    transactions.forEach((tx) => {
      if (tx.type === 'expense' && tx.date.startsWith(selectedMonth)) {
        map.set(tx.categoryId, (map.get(tx.categoryId) || 0) + tx.baseAmount);
      }
    });
    return map;
  }, [transactions, selectedMonth]);

  const totalBudgeted = monthBudgets.reduce((sum, b) => sum + b.amountLimit, 0);
  const totalSpent = monthBudgets.reduce((sum, b) => {
    const spent = categorySpendingMap.get(b.categoryId) || 0;
    return sum + spent;
  }, 0);
  const totalRemaining = Math.max(0, totalBudgeted - totalSpent);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-navy dark:text-white tracking-tight">
            {t('budget.title')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('budget.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-brand-card-dark text-xs sm:text-sm font-bold text-slate-800 dark:text-white focus:outline-none"
          />

          <button
            type="button"
            onClick={onOpenCreateBudget}
            className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('budget.createBudget')}</span>
          </button>
        </div>
      </div>

      {/* Top Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Budget Limit
          </span>
          <div className="text-2xl font-black font-mono text-brand-navy dark:text-white mt-1">
            {formatMoney(totalBudgeted)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Spent in Budgets
          </span>
          <div className="text-2xl font-black font-mono text-rose-500 mt-1">
            {formatMoney(totalSpent)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Remaining Budget Pool
          </span>
          <div className="text-2xl font-black font-mono text-brand-emerald mt-1">
            {formatMoney(totalRemaining)}
          </div>
        </div>
      </div>

      {/* Budgets Grid */}
      {monthBudgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {monthBudgets.map((b) => {
            const cat = categoryMap.get(b.categoryId);
            const spent = categorySpendingMap.get(b.categoryId) || 0;
            const remaining = b.amountLimit - spent;
            const percentage = Math.min(100, Math.round((spent / b.amountLimit) * 100));
            const isExceeded = spent > b.amountLimit;
            const isWarning80 = percentage >= 80 && !isExceeded;
            const isWarning50 = percentage >= 50 && percentage < 80;

            const categoryName =
              preferences.language === 'bn' && cat?.nameBn
                ? cat.nameBn
                : cat?.name || 'Category';

            return (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle space-y-4 hover:shadow-card transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: cat?.color || '#3563E9' }}
                    />
                    <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
                      {categoryName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditBudget(b)}
                      className="p-1 rounded text-slate-400 hover:text-brand-blue"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBudget(b.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {isExceeded ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{t('budget.statusExceeded')}</span>
                    </span>
                  ) : isWarning80 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 text-xs font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{t('budget.statusWarning80')}</span>
                    </span>
                  ) : isWarning50 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-brand-blue text-xs font-bold">
                      <BellRing className="w-3.5 h-3.5" />
                      <span>{t('budget.statusWarning50')}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('budget.statusSafe')}</span>
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">
                      {percentage}% {t('budget.used')}
                    </span>
                    <span
                      className={`font-mono ${
                        isExceeded ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {formatMoney(spent)} / {formatMoney(b.amountLimit)}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isExceeded
                          ? 'bg-rose-500'
                          : isWarning80
                          ? 'bg-amber-500'
                          : 'bg-brand-emerald'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Remaining Amount */}
                <div className="pt-2 border-t border-slate-100 dark:border-brand-border-dark flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400">{t('budget.remaining')}:</span>
                  <span
                    className={`font-mono font-bold ${
                      remaining <= 0 ? 'text-rose-500' : 'text-brand-emerald'
                    }`}
                  >
                    {remaining <= 0 ? '0.00 (Exceeded)' : formatMoney(remaining)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle space-y-3">
          <div className="inline-flex p-3.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-brand-blue">
            <PieIcon className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-brand-navy dark:text-white">
            {t('budget.noBudgets')}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Choose an expense category and set monthly spending targets to build discipline and wealth.
          </p>
          <button
            type="button"
            onClick={onOpenCreateBudget}
            className="mt-2 px-5 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-md hover:bg-brand-blue-hover"
          >
            + {t('budget.createBudget')}
          </button>
        </div>
      )}
    </div>
  );
};
