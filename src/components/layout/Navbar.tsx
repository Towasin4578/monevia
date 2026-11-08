import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Logo } from '../../branding/Logo';
import { Moon, Sun, Globe, Plus, Download, Home } from 'lucide-react';

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
  onBackToLanding,
}) => {
  const { preferences, profile, updatePreferences, t } = useFinance();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        preferences.language === 'bn'
          ? 'অ্যাপটি সরাসরি আপনার ডেস্কটপ বা মোবাইলে ইনস্টল করতে আপনার ব্রাউজারের অ্যাড্রেস বারের ডানপাশে থাকা "Install App" আইকনটিতে ক্লিক করুন।'
          : 'To install Monevia on your device, click the "Install App" icon located in your browser address bar (or Add to Home Screen on mobile).'
      );
    }
  };

  const toggleLanguage = () => {
    const next = preferences.language === 'en' ? 'bn' : 'en';
    updatePreferences({ language: next });
  };

  const toggleTheme = () => {
    const next = preferences.theme === 'dark' ? 'light' : 'dark';
    updatePreferences({ theme: next });
  };

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
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-brand-card-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-brand-border-dark px-4 md:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between">
        {/* Left: Mobile Brand / Desktop Page Title */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <Logo variant="icon" size="sm" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black text-brand-navy dark:text-white tracking-tight">
              {pageTitles[currentTab] || t('nav.dashboard')}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              title="Return to Website Showcase"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-brand-blue" />
              <span className="hidden sm:inline">{preferences.language === 'bn' ? 'হোমপেজ' : 'Website'}</span>
            </button>
          )}

          {/* Install / Download App Button */}
          {!isInstalled && (
            <button
              type="button"
              onClick={handleInstallApp}
              title="Install Monevia App on Desktop/Mobile"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-brand-emerald text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{preferences.language === 'bn' ? 'অ্যাপ ডাউনলোড' : 'Install App'}</span>
            </button>
          )}

          {/* Quick Add Button (Desktop only here, mobile has bottom floating button) */}
          <button
            type="button"
            onClick={onOpenQuickAdd}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{t('dashboard.quickAdd')}</span>
          </button>

          {/* Currency Pill */}
          <button
            type="button"
            onClick={onNavigateToSettings}
            title="Primary Reporting Currency"
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-bold text-brand-navy dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {preferences.primaryCurrency}
          </button>

          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={toggleLanguage}
            title="Toggle Language"
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-brand-blue" />
            <span>{preferences.language === 'en' ? 'বাংলা' : 'English'}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title="Toggle Light/Dark Theme"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {preferences.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* User Profile Mini Badge */}
          <button
            type="button"
            onClick={onNavigateToSettings}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700"
          >
            <div className="w-8 h-8 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue flex items-center justify-center font-bold text-xs ring-1 ring-brand-blue/30">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:inline-block text-xs font-bold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
              {profile.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
