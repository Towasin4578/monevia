import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { SavingsGoal } from '../../types';
import { X, Target } from 'lucide-react';

interface SavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingGoal?: SavingsGoal | null;
}

export const SavingsGoalModal: React.FC<SavingsGoalModalProps> = ({
  isOpen,
  onClose,
  editingGoal = null,
}) => {
  const { t, accounts, saveSavingsGoal, preferences } = useFinance();

  const [name, setName] = useState<string>(editingGoal ? editingGoal.name : '');
  const [targetAmount, setTargetAmount] = useState<string>(
    editingGoal ? String(editingGoal.targetAmount) : ''
  );
  const [currentAmount, setCurrentAmount] = useState<string>(
    editingGoal ? String(editingGoal.currentAmount) : '0'
  );
  const [targetDate, setTargetDate] = useState<string>(
    editingGoal
      ? editingGoal.targetDate
      : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
  );
  const [linkedAccountId, setLinkedAccountId] = useState<string>(
    editingGoal?.linkedAccountId || accounts[0]?.id || ''
  );
  const [color, setColor] = useState<string>(
    editingGoal ? editingGoal.color : '#16A36A'
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount) || 0;
    if (!name.trim() || !target || target <= 0) return;

    await saveSavingsGoal({
      id: editingGoal ? editingGoal.id : undefined,
      name: name.trim(),
      targetAmount: target,
      currentAmount: current,
      currency: preferences.primaryCurrency,
      targetDate,
      linkedAccountId: linkedAccountId || undefined,
      color,
      icon: 'Target',
    });

    onClose();
  };

  const colors = ['#16A36A', '#3563E9', '#8B5CF6', '#F59E0B', '#EF4444', '#0F9D8A'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-brand-card-dark rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-brand-border-dark overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-brand-border-dark flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-brand-navy dark:text-white">
              {editingGoal ? t('common.edit') + ' ' + t('nav.savings') : t('savings.createGoal')}
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
              {t('savings.goalName')} *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Emergency Fund, New Laptop, Hajj, Vacation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {t('savings.targetAmount')} ({preferences.primaryCurrency}) *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="100000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base font-bold focus:ring-2 focus:ring-brand-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {t('savings.currentAmount')}
              </label>
              <input
                type="number"
                step="any"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base font-bold focus:ring-2 focus:ring-brand-blue focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              {t('savings.targetDate')} *
            </label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              {t('savings.linkedAccount')}
            </label>
            <select
              value={linkedAccountId}
              onChange={(e) => setLinkedAccountId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
            >
              <option value="">(None / General Goal)</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Color Tag */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Theme Color
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-110 ring-2 ring-offset-2 ring-slate-400' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
              className="px-5 py-2 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white text-xs font-bold shadow-sm"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
