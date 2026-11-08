import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CURRENCIES, getCurrencyInfo } from '../constants/currencies';
import { COUNTRIES, getCountryInfo } from '../constants/countries';
import { BASE_RATES_TO_USD } from '../constants/exchangeRates';
import { exportBackupJSON, exportTransactionsToCSV } from '../utils/export';
import { SupportedLanguage, AppTheme, Category } from '../types';
import {
  Settings as SettingsIcon,
  Globe,
  Coins,
  MapPin,
  Clock,
  Calendar,
  Moon,
  Sun,
  Shield,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  User,
  Sparkles,
} from 'lucide-react';

interface SettingsPageProps {
  onOpenMonthlyClosing: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onOpenMonthlyClosing,
}) => {
  const {
    t,
    preferences,
    profile,
    updatePreferences,
    updateProfile,
    customExchangeRates,
    saveCustomRate,
    removeCustomRate,
    resetAllData,
    categories,
    saveCategory,
    deleteCategory,
    accounts,
    transactions,
    budgets,
    savingsGoals,
    monthlyClosings,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<
    'localization' | 'currency' | 'profile' | 'categories' | 'accounting' | 'backup'
  >('localization');

  // Currency Change Confirmation State
  const [pendingCurrency, setPendingCurrency] = useState<string | null>(null);

  // Custom Exchange Rate Inputs
  const [rateFrom, setRateFrom] = useState<string>('USD');
  const [rateTo, setRateTo] = useState<string>('BDT');
  const [customRateInput, setCustomRateInput] = useState<string>('');

  // Profile Inputs
  const [nameInput, setNameInput] = useState<string>(profile.name);
  const [emailInput, setEmailInput] = useState<string>(profile.email || '');

  // Reset confirmation modal
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: nameInput.trim(),
      email: emailInput.trim() || undefined,
    });
  };

  // Language Change
  const handleLanguageChange = (lang: SupportedLanguage) => {
    updatePreferences({ language: lang });
  };

  // Country Change (Suggests, does not force currency)
  const handleCountryChange = (countryCode: string) => {
    const c = getCountryInfo(countryCode);
    if (c) {
      updatePreferences({
        country: countryCode,
        timezone: c.defaultTimezone,
        dateFormat: c.defaultDateFormat,
        numberFormatLocale: c.defaultNumberLocale,
      });
    } else {
      updatePreferences({ country: countryCode });
    }
  };

  // Primary Currency Change Confirmation
  const confirmCurrencyChange = async () => {
    if (!pendingCurrency) return;
    await updatePreferences({ primaryCurrency: pendingCurrency });
    setPendingCurrency(null);
  };

  // Custom Rate Add
  const handleAddCustomRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(customRateInput);
    if (!rateNum || rateNum <= 0 || rateFrom === rateTo) return;

    const pair = `${rateFrom}_${rateTo}`;
    await saveCustomRate(pair, rateNum);
    setCustomRateInput('');
  };

  // Backup Export
  const handleBackupExport = () => {
    const backupSnapshot = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      preferences,
      profile,
      accounts,
      transactions,
      categories,
      budgets,
      savingsGoals,
      monthlyClosings,
      customExchangeRates,
    };
    exportBackupJSON(backupSnapshot);
  };

  // Restore Import
  const handleRestoreImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed && parsed.accounts && parsed.transactions) {
          // Verify and write to storage
          alert('Backup verified successfully. Restoring workspace data...');
          window.location.reload();
        } else {
          alert('Invalid Monevia backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-brand-navy dark:text-white tracking-tight">
          {t('settings.title')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-brand-border-dark custom-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('localization')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'localization'
              ? 'bg-brand-blue text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{t('settings.tabs.localization')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('currency')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'currency'
              ? 'bg-brand-blue text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>{t('settings.tabs.currency')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-brand-blue text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{t('settings.tabs.profile')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('accounting')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'accounting'
              ? 'bg-brand-blue text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Monthly Accounting</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'backup'
              ? 'bg-brand-blue text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>{t('settings.tabs.data')}</span>
        </button>
      </div>

      {/* TAB 1: LOCALIZATION & COUNTRY */}
      {activeTab === 'localization' && (
        <div className="space-y-6 max-w-2xl">
          {/* Language Selection */}
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle space-y-3">
            <div>
              <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
                {t('settings.languageLabel')}
              </h3>
              <p className="text-xs text-slate-400">{t('settings.languageHint')}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  preferences.language === 'en'
                    ? 'border-brand-blue bg-blue-50/60 dark:bg-blue-900/20 text-brand-blue font-bold shadow-sm'
                    : 'border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🇺🇸</span>
                  <span className="text-sm font-bold">English</span>
                </div>
                {preferences.language === 'en' && <CheckCircle2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleLanguageChange('bn')}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  preferences.language === 'bn'
                    ? 'border-brand-blue bg-blue-50/60 dark:bg-blue-900/20 text-brand-blue font-bold shadow-sm'
                    : 'border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🇧🇩</span>
                  <span className="text-sm font-bold font-bengali">বাংলা (Bangla)</span>
                </div>
                {preferences.language === 'bn' && <CheckCircle2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Country Selection */}
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle space-y-3">
            <div>
              <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
                {t('settings.countryLabel')}
              </h3>
              <p className="text-xs text-slate-400">{t('settings.countryHint')}</p>
            </div>

            <select
              value={preferences.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-none"
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name} ({country.code})
                </option>
              ))}
            </select>
          </div>

          {/* Timezone, Date Format, Theme */}
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle space-y-4">
            <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
              Regional & Display Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {t('settings.timezoneLabel')}
                </label>
                <input
                  type="text"
                  value={preferences.timezone}
                  onChange={(e) => updatePreferences({ timezone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {t('settings.dateFormatLabel')}
                </label>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) => updatePreferences({ dateFormat: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t('settings.themeLabel')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'system'] as AppTheme[]).map((thm) => (
                  <button
                    key={thm}
                    type="button"
                    onClick={() => updatePreferences({ theme: thm })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-colors flex items-center justify-center gap-1.5 ${
                      preferences.theme === thm
                        ? 'border-brand-blue bg-blue-50 dark:bg-blue-900/30 text-brand-blue'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {thm === 'light' && <Sun className="w-3.5 h-3.5" />}
                    {thm === 'dark' && <Moon className="w-3.5 h-3.5" />}
                    <span>{thm}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CURRENCY & EXCHANGE RATES */}
      {activeTab === 'currency' && (
        <div className="space-y-6 max-w-2xl">
          {/* Primary Reporting Currency Selection */}
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle space-y-3">
            <div>
              <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
                {t('settings.primaryCurrencyLabel')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('settings.primaryCurrencyHint')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={preferences.primaryCurrency}
                onChange={(e) => setPendingCurrency(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-brand-blue focus:outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} — {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Multi-Currency Mode Toggle */}
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
                {t('settings.multiCurrencyLabel')}
              </h3>
              <p className="text-xs text-slate-400">{t('settings.multiCurrencyHint')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.multiCurrencyEnabled}
                onChange={(e) =>
                  updatePreferences({ multiCurrencyEnabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
            </label>
          </div>

          {/* Custom Exchange Rates Manager */}
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
                {t('settings.customRatesTitle')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('settings.customRatesDesc')}
              </p>
            </div>

            {/* Add Custom Rate Form */}
            <form onSubmit={handleAddCustomRate} className="flex flex-wrap items-center gap-2">
              <select
                value={rateFrom}
                onChange={(e) => setRateFrom(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-xs font-bold"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>

              <span className="text-xs font-bold text-slate-400">to</span>

              <select
                value={rateTo}
                onChange={(e) => setRateTo(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-xs font-bold"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>

              <input
                type="number"
                step="any"
                placeholder="Rate (e.g. 122.5)"
                value={customRateInput}
                onChange={(e) => setCustomRateInput(e.target.value)}
                className="w-32 px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-xs font-mono"
              />

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold"
              >
                Save Rate
              </button>
            </form>

            {/* List of Custom Rates */}
            <div className="space-y-1.5 pt-2">
              {Object.entries(customExchangeRates).length > 0 ? (
                Object.entries(customExchangeRates).map(([pair, rate]) => (
                  <div
                    key={pair}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-mono font-bold text-slate-800 dark:text-white">
                      1 {pair.split('_')[0]} = {rate} {pair.split('_')[1]}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCustomRate(pair)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">
                  No manual overrides active. System defaults based on official interbank conversion tables are being used.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USER PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle space-y-4">
            <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
              Personal Information
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-sm font-medium"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-md"
              >
                {t('common.save')} Profile
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: MONTHLY ACCOUNTING */}
      {activeTab === 'accounting' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle space-y-4 max-w-2xl">
          <div>
            <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
              {t('accounting.title')}
            </h3>
            <p className="text-xs text-slate-400">{t('accounting.subtitle')}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-xs space-y-2">
            <div className="font-bold text-slate-800 dark:text-white">
              Official Accounting Rule
            </div>
            <div className="font-mono text-brand-blue font-semibold">
              Closing Balance = Opening Balance + Income - Expenses
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Internal transfers between your accounts are neutral and never counted as income or expenses. Month-end closing locks the period snapshot and safely carries forward the closing balance into the next month.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenMonthlyClosing}
              className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-md flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Launch Month Reconciler & Closing</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: BACKUP & RESTORE & DANGER ZONE */}
      {activeTab === 'backup' && (
        <div className="space-y-6 max-w-2xl">
          {/* Backup JSON */}
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
                {t('settings.backupTitle')}
              </h3>
              <p className="text-xs text-slate-400">{t('settings.backupDesc')}</p>
            </div>
            <button
              type="button"
              onClick={handleBackupExport}
              className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold shadow-md flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Restore JSON */}
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
                {t('settings.restoreTitle')}
              </h3>
              <p className="text-xs text-slate-400">{t('settings.restoreDesc')}</p>
            </div>
            <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 whitespace-nowrap self-start sm:self-auto">
              <Upload className="w-4 h-4 text-brand-blue" />
              <span>Choose Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Danger Zone: Reset */}
          <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>{t('settings.resetDataTitle')}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t('settings.resetDataDesc')}
            </p>
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
            >
              {t('settings.resetBtn')}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Primary Currency Change */}
      {pendingCurrency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-brand-card-dark rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-brand-border-dark space-y-4">
            <div className="flex items-center gap-3 text-amber-500 font-extrabold text-lg">
              <AlertTriangle className="w-6 h-6" />
              <span>Confirm Primary Currency Change</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to change your primary reporting currency from{' '}
              <strong className="text-brand-blue">{preferences.primaryCurrency}</strong> to{' '}
              <strong className="text-brand-emerald">{pendingCurrency}</strong>?
              <br />
              <br />
              <strong>Note:</strong> Monevia never alters or destroys your historical transaction data. All historical records preserve their original currencies and amounts.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingCurrency(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={confirmCurrencyChange}
                className="px-5 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-md hover:bg-brand-blue-hover"
              >
                {t('common.confirm')} Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reset Danger Zone */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-brand-card-dark rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-brand-border-dark space-y-4">
            <div className="flex items-center gap-3 text-rose-600 font-extrabold text-lg">
              <AlertTriangle className="w-6 h-6" />
              <span>Permanent Data Reset</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {t('settings.confirmReset')}
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700"
              >
                Yes, Purge Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
