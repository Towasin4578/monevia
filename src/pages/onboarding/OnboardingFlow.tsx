import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Logo } from '../../branding/Logo';
import { BRAND_CONFIG } from '../../branding/brandConfig';
import { CURRENCIES, getCurrencyInfo } from '../../constants/currencies';
import { COUNTRIES, getCountryInfo } from '../../constants/countries';
import { SupportedLanguage, AccountType } from '../../types';
import { formatCurrency, getCurrencyPreview } from '../../utils/formatting';
import {
  Globe,
  Coins,
  MapPin,
  Wallet,
  User,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Search,
  Sparkles,
  ShieldCheck,
  Check,
  Download,
} from 'lucide-react';

const AVATAR_OPTIONS = [
  { id: 'avatar-1', label: 'Executive', emoji: '💼', bg: 'bg-blue-100 text-blue-700' },
  { id: 'avatar-2', label: 'Investor', emoji: '📈', bg: 'bg-emerald-100 text-emerald-700' },
  { id: 'avatar-3', label: 'Digital Nomad', emoji: '✈️', bg: 'bg-purple-100 text-purple-700' },
  { id: 'avatar-4', label: 'Entrepreneur', emoji: '🚀', bg: 'bg-amber-100 text-amber-700' },
  { id: 'avatar-5', label: 'Saver', emoji: '🌱', bg: 'bg-teal-100 text-teal-700' },
  { id: 'avatar-6', label: 'Professional', emoji: '👔', bg: 'bg-indigo-100 text-indigo-700' },
];

export interface OnboardingFlowProps {
  onBackToLanding?: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onBackToLanding,
}) => {
  const { t, preferences, completeOnboarding, updatePreferences } = useFinance();

  // Current Step: 1 to 6
  const [step, setStep] = useState<number>(1);

  // Step 1: Language
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(
    preferences.language || 'en'
  );

  // Step 2: Currency
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    preferences.primaryCurrency || 'BDT'
  );
  const [currencySearch, setCurrencySearch] = useState<string>('');

  // Step 3: Country (Optional)
  const [selectedCountry, setSelectedCountry] = useState<string>('BD');
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [suggestedDefaults, setSuggestedDefaults] = useState<{
    timezone?: string;
    dateFormat?: string;
    numberLocale?: string;
  }>({
    timezone: 'Asia/Dhaka',
    dateFormat: 'DD/MM/YYYY',
    numberLocale: 'en-US',
  });

  // Step 4: Starting Balance
  const [accountName, setAccountName] = useState<string>('Primary Checking');
  const [accountType, setAccountType] = useState<AccountType>('bank');
  const [startingBalance, setStartingBalance] = useState<string>('5000');
  const [startingDate, setStartingDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Step 5: Profile
  const [userName, setUserName] = useState<string>('Tahmid Hasan');
  const [userEmail, setUserEmail] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('avatar-1');

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      alert(
        selectedLang === 'bn'
          ? '📱 অ্যাপটি আপনার ডিভাইস বা কম্পিউটারে সরাসরি ইনস্টল করতে ব্রাউজারের অ্যাড্রেস বারের ডানপাশে থাকা "Install App" বাটন চাপুন (বা মোবাইলে মেনু থেকে "Add to Home Screen")।'
          : '📱 To install Monevia on your desktop or mobile, click the "Install App" icon in your browser address bar (or "Add to Home Screen" on mobile).'
      );
    }
  };

  // Instant language change on Step 1
  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    updatePreferences({ language: lang });
  };

  // Country selection handler (suggests defaults, never forces currency)
  const handleSelectCountry = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const country = getCountryInfo(countryCode);
    if (country) {
      setSuggestedDefaults({
        timezone: country.defaultTimezone,
        dateFormat: country.defaultDateFormat,
        numberLocale: country.defaultNumberLocale,
      });
      // Do NOT overwrite selectedCurrency! Keep user's Step 2 currency choice.
    }
  };

  // Filter currencies
  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
      c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
      c.symbol.toLowerCase().includes(currencySearch.toLowerCase())
  );

  // Filter countries
  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Complete onboarding
  const handleFinish = async () => {
    await completeOnboarding({
      language: selectedLang,
      primaryCurrency: selectedCurrency,
      country: selectedCountry,
      startingAccount: {
        name: accountName.trim() || 'Primary Account',
        type: accountType,
        balance: parseFloat(startingBalance) || 0,
        date: startingDate,
      },
      profile: {
        name: userName.trim() || 'Monevia User',
        email: userEmail.trim() || undefined,
        avatarUrl: selectedAvatar,
      },
      suggestedDefaults,
    });
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-bg-dark flex flex-col justify-between p-4 md:p-8 selection:bg-brand-blue selection:text-white">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200 dark:border-brand-border-dark gap-2">
        <div className="flex items-center gap-3">
          <Logo variant="horizontal" size="md" showTagline={true} />
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="hidden sm:inline-block text-xs font-bold text-slate-500 hover:text-brand-blue pl-2 border-l border-slate-300 dark:border-slate-700"
            >
              ← {selectedLang === 'bn' ? 'হোমপেজ' : 'Website'}
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Prominent App Download Button at the Very Beginning */}
          <button
            type="button"
            onClick={handleInstallApp}
            title="Download / Install Monevia App on your Device"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-emerald to-teal-600 hover:from-teal-600 hover:to-brand-emerald text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{selectedLang === 'bn' ? 'অ্যাপ ডাউনলোড' : 'Download App'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-blue-400">
            <span>Step {step} of 6</span>
          </div>
        </div>
      </div>

      {/* Main Multi-Step Container */}
      <div className="max-w-3xl mx-auto w-full my-auto py-8">
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-blue to-brand-emerald transition-all duration-300 ease-out"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* STEP 1: LANGUAGE SELECTION */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-blue-50 dark:bg-brand-card-dark text-brand-blue mb-2">
                <Globe className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-navy dark:text-white">
                {t('onboarding.step1Title')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
                {t('onboarding.step1Desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-4">
              {/* English */}
              <button
                type="button"
                onClick={() => handleSelectLanguage('en')}
                className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between group ${
                  selectedLang === 'en'
                    ? 'border-brand-blue bg-white dark:bg-brand-card-dark shadow-elevated ring-2 ring-brand-blue/20'
                    : 'border-slate-200 dark:border-brand-border-dark bg-white dark:bg-brand-card-dark hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">🇺🇸</span>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                      English
                    </h3>
                    <p className="text-xs text-slate-500">United States / International</p>
                  </div>
                </div>
                {selectedLang === 'en' && (
                  <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>

              {/* Bangla */}
              <button
                type="button"
                onClick={() => handleSelectLanguage('bn')}
                className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between group ${
                  selectedLang === 'bn'
                    ? 'border-brand-blue bg-white dark:bg-brand-card-dark shadow-elevated ring-2 ring-brand-blue/20'
                    : 'border-slate-200 dark:border-brand-border-dark bg-white dark:bg-brand-card-dark hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">🇧🇩</span>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white font-bengali">
                      বাংলা
                    </h3>
                    <p className="text-xs text-slate-500">বাংলাদেশ ও আন্তর্জাতিক</p>
                  </div>
                </div>
                {selectedLang === 'bn' && (
                  <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            </div>

            {/* Quick App Download Card on Step 1 */}
            <div className="max-w-xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-navy-light to-brand-blue text-white shadow-card flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-brand-emerald">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">
                    {selectedLang === 'bn' ? 'সরাসরি অ্যাপ ডাউনলোড বা ইনস্টল করতে চান?' : 'Want to install the App directly?'}
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {selectedLang === 'bn'
                      ? 'কম্পিউটার বা মোবাইলে ইনস্টল করে অফলাইনেও ব্যবহার করতে পারবেন।'
                      : 'Install as a standalone native app on Windows, Mac, Android, or iOS.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleInstallApp}
                className="px-3.5 py-2 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-xs whitespace-nowrap shadow-sm transition-transform active:scale-95 shrink-0"
              >
                {selectedLang === 'bn' ? 'ডাউনলোড / ইনস্টল' : 'Download App'}
              </button>
            </div>

            <div className="text-center pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
                Additional international languages can be added seamlessly via the localization module.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: CURRENCY SELECTION */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-50 dark:bg-brand-card-dark text-brand-emerald mb-2">
                <Coins className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-navy dark:text-white">
                {t('onboarding.step2Title')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {t('onboarding.step2Desc')}
              </p>
            </div>

            {/* Currency Live Preview Card */}
            <div className="max-w-xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-brand-navy to-brand-navy-light text-white shadow-elevated">
              <div className="text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                {t('onboarding.previewLabel')}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold tracking-tight text-brand-emerald">
                  {getCurrencyPreview(selectedCurrency, preferences.numberFormatLocale)}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-mono font-bold">
                  ISO: {selectedCurrency}
                </span>
              </div>
            </div>

            {/* Search Input */}
            <div className="max-w-xl mx-auto relative">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={currencySearch}
                onChange={(e) => setCurrencySearch(e.target.value)}
                placeholder={t('onboarding.currencySearchPlaceholder')}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue text-slate-800 dark:text-white"
              />
            </div>

            {/* Currency Grid */}
            <div className="max-w-xl mx-auto max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredCurrencies.map((c) => {
                const isSelected = selectedCurrency === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setSelectedCurrency(c.code)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-brand-blue bg-blue-50/50 dark:bg-blue-900/20 text-brand-blue font-bold shadow-sm'
                        : 'border-slate-200 dark:border-brand-border-dark bg-white dark:bg-brand-card-dark hover:border-slate-300 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {c.code}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                            {c.symbol}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {c.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-500">
                        {formatCurrency(1500, c.code, { locale: preferences.numberFormatLocale })}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: COUNTRY SELECTION (OPTIONAL) */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-teal-50 dark:bg-brand-card-dark text-brand-teal mb-2">
                <MapPin className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-navy dark:text-white">
                {t('onboarding.step3Title')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {t('onboarding.step3Desc')}
              </p>
            </div>

            {/* Selected Country Banner & Suggested Defaults */}
            <div className="max-w-xl mx-auto p-4 rounded-xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-brand-navy dark:text-white">
                  {t('onboarding.suggestedDefaults')}
                </span>
                <span className="text-brand-emerald font-semibold">
                  Currency preserved: {selectedCurrency}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <div className="text-slate-400">Timezone</div>
                  <div className="font-mono font-medium truncate">
                    {suggestedDefaults.timezone}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <div className="text-slate-400">Date Format</div>
                  <div className="font-mono font-medium">
                    {suggestedDefaults.dateFormat}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <div className="text-slate-400">Locale</div>
                  <div className="font-mono font-medium">
                    {suggestedDefaults.numberLocale}
                  </div>
                </div>
              </div>
            </div>

            {/* Country Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder={t('onboarding.countrySearchPlaceholder')}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue text-slate-800 dark:text-white"
              />
            </div>

            {/* Country Grid */}
            <div className="max-w-xl mx-auto max-h-60 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {filteredCountries.map((country) => {
                const isSelected = selectedCountry === country.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelectCountry(country.code)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-brand-blue bg-blue-50/50 dark:bg-blue-900/20 text-brand-blue font-bold shadow-sm'
                        : 'border-slate-200 dark:border-brand-border-dark bg-white dark:bg-brand-card-dark hover:border-slate-300 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.flag}</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-white">
                        {country.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {country.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: STARTING BALANCE */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-blue-50 dark:bg-brand-card-dark text-brand-blue mb-2">
                <Wallet className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-navy dark:text-white">
                {t('onboarding.step4Title')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {t('onboarding.step4Desc')}
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-white dark:bg-brand-card-dark p-6 rounded-2xl border border-slate-200 dark:border-brand-border-dark shadow-subtle space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  {t('onboarding.accountNameLabel')}
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder={t('onboarding.accountNamePlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    {t('onboarding.accountTypeLabel')}
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as AccountType)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  >
                    <option value="bank">{t('accounts.types.bank')}</option>
                    <option value="cash">{t('accounts.types.cash')}</option>
                    <option value="digital_wallet">{t('accounts.types.digital_wallet')}</option>
                    <option value="mobile_money">{t('accounts.types.mobile_money')}</option>
                    <option value="debit_card">{t('accounts.types.debit_card')}</option>
                    <option value="credit_card">{t('accounts.types.credit_card')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    {t('onboarding.startingDateLabel')}
                  </label>
                  <input
                    type="date"
                    value={startingDate}
                    onChange={(e) => setStartingDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  {t('onboarding.initialBalanceLabel')} ({selectedCurrency})
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-lg font-bold text-slate-400">
                    {getCurrencyInfo(selectedCurrency).symbol}
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={startingBalance}
                    onChange={(e) => setStartingBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono text-lg font-bold focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: PROFILE */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-purple-50 dark:bg-brand-card-dark text-purple-600 mb-2">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-navy dark:text-white">
                {t('onboarding.step5Title')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {t('onboarding.step5Desc')}
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-white dark:bg-brand-card-dark p-6 rounded-2xl border border-slate-200 dark:border-brand-border-dark shadow-subtle space-y-5">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {t('onboarding.chooseAvatar')}
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all ${
                        selectedAvatar === av.id
                          ? 'ring-2 ring-brand-blue scale-105 shadow-md bg-blue-50 dark:bg-blue-900/30'
                          : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-2xl">{av.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  {t('onboarding.fullNameLabel')} *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={t('onboarding.fullNamePlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  {t('onboarding.emailLabel')}
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder={t('onboarding.emailPlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: FINISH / WELCOME */}
        {step === 6 && (
          <div className="space-y-6 text-center max-w-xl mx-auto animate-fadeIn">
            <div className="inline-flex p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald mb-2">
              <CheckCircle2 className="w-14 h-14" />
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-brand-navy dark:text-white tracking-tight">
              {t('onboarding.step6Title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              {t('onboarding.step6Subtitle')}
            </p>

            {/* Summary Review Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark text-left shadow-card space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs uppercase font-bold text-slate-400">User</span>
                <span className="font-bold text-slate-800 dark:text-white">{userName}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs uppercase font-bold text-slate-400">Language</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {selectedLang === 'bn' ? 'বাংলা (Bangla)' : 'English'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs uppercase font-bold text-slate-400">Reporting Currency</span>
                <span className="font-bold text-brand-blue">{selectedCurrency} ({getCurrencyInfo(selectedCurrency).symbol})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-400">Initial Account</span>
                <span className="font-bold text-brand-emerald">
                  {accountName} — {formatCurrency(parseFloat(startingBalance) || 0, selectedCurrency, { locale: preferences.numberFormatLocale })}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-4 px-6 rounded-2xl bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-base md:text-lg shadow-elevated transition-transform active:scale-95 flex items-center justify-center gap-3"
              >
                <span>{t('onboarding.getStartedBtn')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation Controls (Steps 1 to 5) */}
        {step < 6 && (
          <div className="max-w-xl mx-auto flex items-center justify-between pt-8 border-t border-slate-200 dark:border-brand-border-dark mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('common.back')}</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95"
            >
              <span>{t('common.next')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-400 dark:text-slate-600 pt-6">
        {BRAND_CONFIG.name} — {BRAND_CONFIG.tagline} • Bank-grade offline storage with IndexedDB
      </div>
    </div>
  );
};
