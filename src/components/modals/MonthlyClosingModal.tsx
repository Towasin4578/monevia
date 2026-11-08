import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  calculateMonthFinancials,
  resolveOpeningBalanceForMonth,
} from '../../utils/accounting';
import { X, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface MonthlyClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string; // YYYY-MM
}

export const MonthlyClosingModal: React.FC<MonthlyClosingModalProps> = ({
  isOpen,
  onClose,
  month,
}) => {
  const {
    t,
    accounts,
    transactions,
    monthlyClosings,
    closeMonthAccounting,
    formatMoney,
  } = useFinance();

  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const existingClosing = monthlyClosings.find((c) => c.month === month);

  // Compute live financials for this month
  const initialAccSum = accounts.reduce((sum, a) => sum + a.balance, 0);
  const openingBal = resolveOpeningBalanceForMonth(
    month,
    monthlyClosings,
    initialAccSum
  );
  const summary = calculateMonthFinancials(month, transactions, openingBal);

  const handleConfirmClose = async () => {
    setIsSubmitting(true);
    try {
      await closeMonthAccounting(month, notes);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-brand-card-dark rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-brand-border-dark overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-brand-border-dark flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-brand-navy dark:text-white">
              {t('accounting.title')}
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Month: {month}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Formula Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 text-xs text-brand-navy dark:text-blue-300 font-medium space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-brand-blue">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('accounting.closingFormula')}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t('accounting.transferNotice')}
            </p>
          </div>

          {/* Financial Breakdown Table */}
          <div className="space-y-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800 text-sm">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 font-medium">
                {t('accounting.openingBalance')}
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {formatMoney(summary.openingBalance)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
              <span className="text-brand-emerald font-medium">
                (+) Total Income ({summary.incomeCount} records)
              </span>
              <span className="font-mono font-bold text-brand-emerald">
                +{formatMoney(summary.totalIncome)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
              <span className="text-rose-500 font-medium">
                (-) Total Expenses ({summary.expenseCount} records)
              </span>
              <span className="font-mono font-bold text-rose-500">
                -{formatMoney(summary.totalExpenses)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-300 dark:border-slate-600 font-semibold">
              <span className="text-slate-700 dark:text-slate-300">
                {t('accounting.netSavings')}
              </span>
              <span
                className={`font-mono font-bold ${
                  summary.netSavings >= 0 ? 'text-brand-emerald' : 'text-rose-500'
                }`}
              >
                {summary.netSavings >= 0 ? '+' : ''}
                {formatMoney(summary.netSavings)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-bold text-brand-navy dark:text-white text-base">
                {t('accounting.closingBalance')}
              </span>
              <span className="font-mono font-black text-xl text-brand-blue">
                {formatMoney(summary.closingBalance)}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Audit Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Month reconciled with bank statements"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200 dark:border-amber-900/30">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{t('accounting.reopenWarning')}</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmClose}
              className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-md flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
            >
              <span>{existingClosing ? 'Re-reconcile & Save' : t('accounting.closeMonthBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
