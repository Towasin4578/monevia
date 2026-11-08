import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { SavingsGoal } from '../types';

interface SavingsPageProps {
  onOpenCreateGoal: () => void;
  onEditGoal: (goal: SavingsGoal) => void;
}

export const SavingsPage: React.FC<SavingsPageProps> = ({
  onOpenCreateGoal,
  onEditGoal,
}) => {
  const {
    t,
    savingsGoals,
    accounts,
    deleteSavingsGoal,
    allocateSavings,
    formatMoney,
    formatDateStr,
    preferences,
  } = useFinance();

  const [allocatingGoalId, setAllocatingGoalId] = useState<string | null>(null);
  const [allocationDirection, setAllocationDirection] = useState<'deposit' | 'withdraw'>('deposit');
  const [allocationAmount, setAllocationAmount] = useState<string>('');
  const [allocationAccountId, setAllocationAccountId] = useState<string>(
    accounts[0]?.id || ''
  );

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);

  const handleAllocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocatingGoalId || !allocationAmount || !allocationAccountId) return;
    const amount = parseFloat(allocationAmount);
    if (!amount || amount <= 0) return;

    await allocateSavings(
      allocatingGoalId,
      amount,
      allocationAccountId,
      allocationDirection
    );

    setAllocatingGoalId(null);
    setAllocationAmount('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-navy dark:text-white tracking-tight">
            {t('savings.title')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('savings.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateGoal}
          className="px-4 py-2.5 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('savings.createGoal')}</span>
        </button>
      </div>

      {/* Aggregate Savings Stat Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-700 via-brand-emerald to-emerald-600 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider text-emerald-100 font-bold">
            Total Accumulated in Goals
          </span>
          <div className="text-3xl font-black font-mono">
            {formatMoney(totalSaved)}
          </div>
          <span className="text-xs text-emerald-100/80">
            Target: {formatMoney(totalTarget)} across {savingsGoals.length} goals
          </span>
        </div>

        <div className="w-full md:w-64 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-emerald-100">
            <span>Overall Progress</span>
            <span>
              {totalTarget > 0
                ? `${Math.round((totalSaved / totalTarget) * 100)}%`
                : '0%'}
            </span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{
                width: `${totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {savingsGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savingsGoals.map((goal) => {
            const percentage = Math.min(
              100,
              Math.round((goal.currentAmount / goal.targetAmount) * 100)
            );
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

            return (
              <div
                key={goal.id}
                className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle space-y-4 hover:shadow-card transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: goal.color }}
                      />
                      <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
                        {goal.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditGoal(goal)}
                        className="p-1 rounded text-slate-400 hover:text-brand-blue"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSavingsGoal(goal.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-500"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('savings.completed')}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-brand-blue text-xs font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Target: {formatDateStr(goal.targetDate, 'medium')}</span>
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">
                        {percentage}% {t('savings.progress')}
                      </span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">
                        {formatMoney(goal.currentAmount)} / {formatMoney(goal.targetAmount)}
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: goal.color || '#16A36A',
                        }}
                      />
                    </div>

                    {!isCompleted && (
                      <div className="text-[11px] text-slate-400 text-right">
                        {formatMoney(remaining)} {t('savings.remainingToSave')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Deposit / Withdraw Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-brand-border-dark flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAllocatingGoalId(goal.id);
                      setAllocationDirection('deposit');
                      setAllocationAmount('');
                    }}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 text-brand-emerald text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>{t('savings.deposit')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAllocatingGoalId(goal.id);
                      setAllocationDirection('withdraw');
                      setAllocationAmount('');
                    }}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{t('savings.withdraw')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle space-y-3">
          <div className="inline-flex p-3.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-brand-navy dark:text-white">
            {t('savings.noGoals')}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create milestone savings goals for vacations, emergencies, weddings, or investments.
          </p>
          <button
            type="button"
            onClick={onOpenCreateGoal}
            className="mt-2 px-5 py-2 rounded-xl bg-brand-emerald text-white text-xs font-bold shadow-md hover:bg-emerald-600"
          >
            + {t('savings.createGoal')}
          </button>
        </div>
      )}

      {/* Inline Allocation Modal */}
      {allocatingGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-brand-card-dark rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-brand-border-dark space-y-4">
            <h3 className="text-base font-black text-brand-navy dark:text-white capitalize">
              {allocationDirection === 'deposit' ? t('savings.deposit') : t('savings.withdraw')} Funds
            </h3>

            <form onSubmit={handleAllocationSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Amount ({preferences.primaryCurrency}) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={allocationAmount}
                  onChange={(e) => setAllocationAmount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base font-bold focus:ring-2 focus:ring-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Source / Target Account *
                </label>
                <select
                  value={allocationAccountId}
                  onChange={(e) => setAllocationAccountId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-blue focus:outline-none"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatMoney(a.balance, a.currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAllocatingGoalId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-sm"
                >
                  {t('common.confirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
