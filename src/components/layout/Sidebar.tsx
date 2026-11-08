import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Logo } from '../../branding/Logo';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  PieChart,
  Target,
  FileBarChart2,
  Calendar,
  WalletCards,
  Settings,
  Plus,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenQuickAdd: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenQuickAdd,
}) => {
  const { t, formatMoney, accounts } = useFinance();

  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'income', label: t('nav.income'), icon: TrendingUp },
    { id: 'expenses', label: t('nav.expenses'), icon: TrendingDown },
    { id: 'transactions', label: t('nav.transactions'), icon: ArrowLeftRight },
    { id: 'budget', label: t('nav.budget'), icon: PieChart },
    { id: 'savings', label: t('nav.savings'), icon: Target },
    { id: 'reports', label: t('nav.reports'), icon: FileBarChart2 },
    { id: 'calendar', label: t('nav.calendar'), icon: Calendar },
    { id: 'accounts', label: t('nav.accounts'), icon: WalletCards },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-brand-navy text-white min-h-screen shrink-0 border-r border-brand-navy-dark shadow-elevated select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-brand-navy-light/30">
        <Logo variant="full" theme="navy" size="md" showTagline={true} />
      </div>

      {/* Quick Add Button */}
      <div className="px-4 py-4">
        <button
          type="button"
          onClick={onOpenQuickAdd}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-blue text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('dashboard.quickAdd')}</span>
        </button>
      </div>

      {/* Nav Items List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group relative ${
                isActive
                  ? 'bg-brand-blue text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`}
              />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-brand-emerald" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Summary Card */}
      <div className="p-4 border-t border-brand-navy-light/30">
        <div className="p-3.5 rounded-xl bg-brand-navy-dark/70 border border-white/5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {t('dashboard.totalBalance')}
          </span>
          <div className="text-lg font-black text-brand-emerald font-mono tracking-tight truncate">
            {formatMoney(totalBalance)}
          </div>
        </div>
      </div>
    </aside>
  );
};
