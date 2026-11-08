import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Logo } from '../../branding/Logo';
import { Plus, Settings } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onOpenQuickAdd: () => void;
  onNavigateToSettings: () => void;
  onBackToLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenQuickAdd,
  onNavigateToSettings,
}) => {
  const { profile, preferences, t } = useFinance();

  const pageTitles: Record<string, string> = {
    dashboard: t('nav.dashboard'),
    income: t('nav.income'),
    expenses: t('nav.expenses'),
    transactions: t('nav.transactions'),
    budget: t('nav.budget'),
    savings: t('nav.savings'),
    reports: t('nav.reports'),
    calendar: t('nav.calendar'),
    accounts: t('nav.accounts'),
    settings: t('nav.settings'),
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-brand-card-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-brand-border-dark px-3 sm:px-6 md:px-8 py-3 transition-colors w-full max-w-full">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Mobile Brand Icon / Page Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="lg:hidden shrink-0">
            <Logo variant="icon" size="sm" />
          </div>
          <h1 className="text-base sm:text-lg md:text-xl font-black text-brand-navy dark:text-white tracking-tight truncate">
            {pageTitles[currentTab] || t('nav.dashboard')}
          </h1>
        </div>

        {/* Right: Clean, Uncluttered Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Add Button (Desktop/Tablet) */}
          <button
            type="button"
            onClick={onOpenQuickAdd}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{t('dashboard.quickAdd')}</span>
          </button>

          {/* Dedicated Settings Button (Theme, Language, Currency all live inside Settings) */}
          <button
            type="button"
            onClick={onNavigateToSettings}
            title={preferences.language === 'bn' ? 'সেটিংস (ভাষা, মুদ্রা, থিম)' : 'Settings (Language, Currency, Theme)'}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors active:scale-95"
          >
            <Settings className="w-4 h-4 text-brand-blue" />
            <span className="text-xs font-bold">
              {preferences.language === 'bn' ? 'সেটিংস' : 'Settings'}
            </span>
          </button>

          {/* User Profile Avatar */}
          <button
            type="button"
            onClick={onNavigateToSettings}
            title={profile.name}
            className="flex items-center pl-1 transition-transform active:scale-95"
          >
            <div className="w-8 h-8 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue flex items-center justify-center font-bold text-xs ring-1 ring-brand-blue/30 shadow-sm">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
