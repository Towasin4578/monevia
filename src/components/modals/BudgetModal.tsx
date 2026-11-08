import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Budget } from '../../types';
import { X, PieChart } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBudget?: Budget | null;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  editingBudget = null,
}) => {
  const { t, categories, saveBudget, preferences } = useFinance();

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM

  const [categoryId, setCategoryId] = useState<string>(
    editingBudget ? editingBudget.categoryId : expenseCategories[0]?.id || ''
  );
  const [month, setMonth] = useState<string>(
    editingBudget ? editingBudget.month : currentMonthStr
  );
  const [amountLimit, setAmountLimit] = useState<string>(
    editingBudget ? String(editingBudget.amountLimit) : ''
  );
  const [notify50, setNotify50] = useState<boolean>(
    editingBudget?.notify50 ?? true
  );
  const [notify80, setNotify80] = useState<boolean>(
    editingBudget?.notify80 ?? true
  );
  const [notify100, setNotify100] = useState<boolean>(
    editingBudget?.notify100 ?? true
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(amountLimit);
    if (!limit || limit <= 0 || !categoryId) return;

    await saveBudget({
      categoryId,
      month,
      amountLimit: limit,
      notify50,
      notify80,
      notify100,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-brand-card-dark rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-brand-border-dark overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-brand-border-dark flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-brand-blue">
              <PieChart className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-brand-navy dark:text-white">
              {editingBudget ? t('budget.editBudget') : t('budget.createBudget')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              {t('common.category')} *
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
            >
              {expenseCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {preferences.language === 'bn' && c.nameBn ? c.nameBn : c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Month *
            </label>
            <input
              type="month"
              required
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              {t('budget.budgetLimit')} ({preferences.primaryCurrency}) *
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="e.g. 15000"
              value={amountLimit}
              onChange={(e) => setAmountLimit(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-lg font-bold focus:ring-2 focus:ring-brand-blue focus:outline-none"
            />
          </div>

          {/* Threshold Notification Checkboxes */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Notification Thresholds
            </span>
            <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={notify50}
                onChange={(e) => setNotify50(e.target.checked)}
                className="rounded text-brand-blue focus:ring-brand-blue"
              />
              <span>{t('budget.notify50')}</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={notify80}
                onChange={(e) => setNotify80(e.target.checked)}
                className="rounded text-brand-blue focus:ring-brand-blue"
              />
              <span>{t('budget.notify80')}</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={notify100}
                onChange={(e) => setNotify100(e.target.checked)}
                className="rounded text-brand-blue focus:ring-brand-blue"
              />
              <span>{t('budget.notify100')}</span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-sm"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
