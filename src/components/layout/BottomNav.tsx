import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  WalletCards,
  Plus,
} from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenQuickAdd: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenQuickAdd,
}) => {
  const { t } = useFinance();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-brand-card-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-brand-border-dark px-2 py-2 safe-bottom">
      <div className="flex items-center justify-around relative">
        {/* Dashboard */}
        <button
          type="button"
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium transition-colors ${
            currentTab === 'dashboard'
              ? 'text-brand-blue font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{t('nav.dashboard')}</span>
        </button>

        {/* Transactions */}
        <button
          type="button"
          onClick={() => setCurrentTab('transactions')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium transition-colors ${
            currentTab === 'transactions'
              ? 'text-brand-blue font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{t('nav.transactions')}</span>
        </button>

        {/* Center Floating Quick Add Button */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            type="button"
            onClick={onOpenQuickAdd}
            className="w-13 h-13 w-12 h-12 rounded-full bg-gradient-to-r from-brand-blue to-brand-emerald text-white shadow-elevated flex items-center justify-center ring-4 ring-white dark:ring-brand-bg-dark transition-transform active:scale-90"
            aria-label="Add transaction"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Budget */}
        <button
          type="button"
          onClick={() => setCurrentTab('budget')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium transition-colors ${
            currentTab === 'budget'
              ? 'text-brand-blue font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <PieChart className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{t('nav.budget')}</span>
        </button>

        {/* Accounts / More */}
        <button
          type="button"
          onClick={() => setCurrentTab('accounts')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium transition-colors ${
            currentTab === 'accounts' || currentTab === 'settings'
              ? 'text-brand-blue font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <WalletCards className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{t('nav.accounts')}</span>
        </button>
      </div>
    </div>
  );
};
