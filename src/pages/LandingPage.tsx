import React, { useState, useEffect } from 'react';
import { Logo } from '../branding/Logo';
import { BRAND_CONFIG } from '../branding/brandConfig';
import {
  ArrowRight,
  Download,
  Globe,
  Coins,
  ShieldCheck,
  PieChart,
  Target,
  Sparkles,
  Smartphone,
  Laptop,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowLeftRight,
  ExternalLink,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDownloadApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      alert(
        lang === 'bn'
          ? '📱 অ্যাপটি সরাসরি আপনার কম্পিউটার বা মোবাইলে ডাউনলোড ও ইনস্টল করতে:\n\n১. ব্রাউজারের অ্যাড্রেস বারের ডানপাশে থাকা "Install App" বাটন চাপুন।\n২. অথবা মোবাইলে ব্রাউজার মেনু (তিন ডট) থেকে "Add to Home Screen" সিলেক্ট করুন।'
          : '📱 To install Monevia on your device:\n\n1. Click the "Install App" icon in your browser address bar.\n2. Or tap "Add to Home Screen" from your mobile browser menu.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B132B] text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-brand-blue selection:text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-brand-navy-dark/90 backdrop-blur-md border-b border-slate-200/80 dark:border-brand-border-dark px-4 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="horizontal" size="md" showTagline={false} />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-brand-blue transition-colors">
              {lang === 'bn' ? 'বৈশিষ্ট্যসমূহ' : 'Features'}
            </a>
            <a href="#how-it-works" className="hover:text-brand-blue transition-colors">
              {lang === 'bn' ? 'কীভাবে কাজ করে' : 'How it works'}
            </a>
            <a href="#download" className="hover:text-brand-blue transition-colors">
              {lang === 'bn' ? 'অ্যাপ ডাউনলোড' : 'Download'}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-slate-300 flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-brand-blue" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Launch Web App Button */}
            <button
              type="button"
              onClick={onEnterApp}
              className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <span>{lang === 'bn' ? 'অ্যাপে প্রবেশ করুন' : 'Launch App'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 md:px-12 pt-12 md:pt-20 pb-16 max-w-7xl mx-auto w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-brand-blue text-xs font-bold animate-pulse">
          <Sparkles className="w-4 h-4 text-brand-teal" />
          <span>{lang === 'bn' ? 'আন্তর্জাতিক পার্সোনাল ফাইন্যান্স প্ল্যাটফর্ম' : 'Global Personal Finance Platform'}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-brand-navy dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
          {lang === 'bn' ? (
            <>
              আপনার অর্থ। <span className="text-brand-blue">আপনার নিয়ন্ত্রণ।</span>
            </>
          ) : (
            <>
              Your Money. <span className="text-brand-blue">Your Total Control.</span>
            </>
          )}
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {lang === 'bn'
            ? 'বাংলাদেশ থেকে যুক্তরাষ্ট্র—বিশ্বের যেকোনো প্রান্তের জন্য বহু-মুদ্রা সমর্থন, মাসিক বাজেট, সঞ্চয় লক্ষ্য ও ব্যাংকিং হিসাবের আধুনিক প্ল্যাটফর্ম।'
            : 'Track multi-currency income, categorize expenses, plan monthly budgets, and achieve savings goals with bank-grade local-first privacy.'}
        </p>

        {/* Hero Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <button
            type="button"
            onClick={onEnterApp}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-blue hover:bg-brand-blue-hover text-white font-black text-base shadow-elevated flex items-center justify-center gap-2.5 transition-transform active:scale-95"
          >
            <span>{lang === 'bn' ? 'সরাসরি অনলাইনে ব্যবহার করুন' : 'Open Web App'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleDownloadApp}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-brand-card-dark hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-brand-emerald text-brand-emerald font-black text-base shadow-card flex items-center justify-center gap-2.5 transition-transform active:scale-95"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>{lang === 'bn' ? 'অ্যাপ ডাউনলোড / ইনস্টল করুন' : 'Download / Install App'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          {lang === 'bn'
            ? '✓ কোনো ক্রেডিট কার্ড লাগবে না • ১০০% ফ্রি • সম্পূর্ণ অফলাইনেও কাজ করে'
            : '✓ No credit card required • 100% Free • Fully works offline'}
        </p>

        {/* Interactive Mockup Preview Card */}
        <div className="pt-10 max-w-5xl mx-auto">
          <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-2xl text-left space-y-5">
            {/* Top Bar Preview */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-xs font-bold text-slate-400">monevia.finance/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald font-bold text-xs font-mono">
                  BDT (৳)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-brand-blue font-bold text-xs">
                  {lang === 'bn' ? 'বাংলা' : 'English'}
                </span>
              </div>
            </div>

            {/* Metrics Row Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Net Balance</span>
                <div className="text-lg sm:text-xl font-black font-mono text-brand-navy dark:text-white mt-0.5">৳১,৮৫,৪৫০.০০</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Monthly Income</span>
                <div className="text-lg sm:text-xl font-black font-mono text-brand-emerald mt-0.5">+৳৬৫,০০০.০০</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Monthly Expenses</span>
                <div className="text-lg sm:text-xl font-black font-mono text-rose-500 mt-0.5">-৳২৫,২০০.০০</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Net Savings</span>
                <div className="text-lg sm:text-xl font-black font-mono text-brand-teal mt-0.5">+৳৩৯,৮০০.০০</div>
              </div>
            </div>

            {/* Multi-Currency Snapshot Strip */}
            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/30 flex flex-wrap items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-brand-blue font-bold">
                <Coins className="w-4 h-4" />
                {lang === 'bn' ? 'বহু-মুদ্রা লাইভ রূপান্তর:' : 'Multi-Currency Live Snapshot:'}
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                $500.00 USD ➔ ৳60,875.00 BDT (Rate: 121.75)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="px-4 md:px-12 py-16 bg-white dark:bg-brand-card-dark border-t border-slate-200/80 dark:border-brand-border-dark">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy dark:text-white tracking-tight">
              {lang === 'bn' ? 'কেন আপনি মনিভিয়া ব্যবহার করবেন?' : 'Why Choose Monevia?'}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              {lang === 'bn'
                ? 'সাধারণ মানি ট্র্যাকার অ্যাপগুলোর সীমাবদ্ধতা দূর করে তৈরি বিশ্বমানের আর্থিক ইঞ্জিন।'
                : 'Built with international fintech architecture to give you full clarity over your wealth.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Multi-Currency */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-brand-blue flex items-center justify-center">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-brand-navy dark:text-white">
                {lang === 'bn' ? '১০০% বহু-মুদ্রা ইঞ্জিন' : 'Universal Multi-Currency Engine'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'bn'
                  ? 'BDT (৳), USD ($), EUR (€), INR (₹), SAR (﷼) সহ বিশ্বের যেকোনো মুদ্রায় লেনদেন লিখুন। স্বয়ংক্রিয় রেট স্ন্যাপশটে বেস মুদ্রায় মোট ব্যালেন্স হিসাব হবে।'
                  : 'Track foreign income and expenses with automatic ISO 4217 exchange rate snapshots without altering historical records.'}
              </p>
            </div>

            {/* Feature 2: Independent Localization */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-brand-emerald flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-brand-navy dark:text-white">
                {lang === 'bn' ? 'স্বাধীন আঞ্চলিক সেটিংস' : 'Independent Localization'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'bn'
                  ? 'ভাষা (বাংলা/English), দেশ, মুদ্রা, টাইমজোন ও তারিখ ফরম্যাট সম্পূর্ণ আলাদা। কোনো সেটিংস অন্যটিকে জোর করে পরিবর্তন করে না।'
                  : 'Language, currency, country, and timezone are separate settings. Any combination works smoothly.'}
              </p>
            </div>

            {/* Feature 3: Bank-Grade Privacy */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-brand-teal flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-brand-navy dark:text-white">
                {lang === 'bn' ? 'সম্পূর্ণ নিরাপদ ও লোকাল-ফার্স্ট' : '100% Private & Local-First'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'bn'
                  ? 'আপনার সমস্ত আর্থিক ডাটা আপনার নিজের ডিভাইসেই IndexedDB ডাটাবেসে সুরক্ষিত থাকে। কোনো ইন্টারনেট বা সার্ভার ছাড়াই চলে।'
                  : 'Your financial ledger lives privately in your browser storage. Zero latency and works completely offline.'}
              </p>
            </div>

            {/* Feature 4: Monthly Accounting */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-brand-navy dark:text-white">
                {lang === 'bn' ? 'স্বয়ংক্রিয় মাসিক সমাপ্তি ও জের' : 'Automated Month-End Accounting'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'bn'
                  ? 'সমাপনী ব্যালেন্স = প্রারম্ভিক ব্যালেন্স + আয় - ব্যয়। মাস শেষে ক্লোজিং ব্যালেন্স স্বয়ংক্রিয়ভাবে পরের মাসে স্থানান্তরিত হয়।'
                  : 'Strict accounting rules. Internal transfers are neutral, and monthly closing balances safely carry forward.'}
              </p>
            </div>

            {/* Feature 5: Smart Budgets */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-brand-navy dark:text-white">
                {lang === 'bn' ? 'ক্যাটাগরি বাজেট ও সতর্কতা' : 'Category Budgets & Alerts'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'bn'
                  ? 'খাবার, বাসা ভাড়া, যাতায়াত ইত্যাদির জন্য বাজেট ঠিক করুন। ৫০%, ৮০% এবং ১০০% খরচ হয়ে গেলে স্বয়ংক্রিয় এলার্ট পাবেন।'
                  : 'Monthly spending caps with automatic progress bars and milestone warning triggers at 50%, 80%, and 100%.'}
              </p>
            </div>

            {/* Feature 6: Savings Goals */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-brand-navy dark:text-white">
                {lang === 'bn' ? 'দ্বৈত-গণনামুক্ত সঞ্চয় লক্ষ্য' : 'Target Savings Goals'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'bn'
                  ? 'জরুরি তহবিল, হজ, গাড়ি বা স্বপ্নের ছুটির জন্য নির্দিষ্ট লক্ষ্য তৈরি করুন। অভ্যন্তরীণ বরাদ্দ টাকা দ্বিগুণ গণনা করে না।'
                  : 'Track progress toward milestones with deposit and withdrawal allocation without double-counting funds.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="px-4 md:px-12 py-16 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy dark:text-white tracking-tight">
            {lang === 'bn' ? 'মাত্র ৩ ধাপে শুরু করুন' : 'Start in 3 Simple Steps'}
          </h2>
          <p className="text-sm text-slate-500">
            {lang === 'bn' ? 'কোনো জটিল সাইন-আপ ফর্ম বা ব্যাংকের পাসওয়ার্ডের দরকার নেই।' : 'No complicated forms, no bank credentials required.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle space-y-2">
            <span className="w-10 h-10 rounded-full bg-brand-blue text-white font-black text-base inline-flex items-center justify-center">
              ১
            </span>
            <h4 className="font-extrabold text-base text-brand-navy dark:text-white">
              {lang === 'bn' ? 'মুদ্রা ও ভাষা নির্বাচন' : 'Pick Currency & Language'}
            </h4>
            <p className="text-xs text-slate-500">
              {lang === 'bn' ? 'আপনার সুবিধাজনক ভাষা (বাংলা/English) এবং প্রধান মুদ্রা (BDT/USD/INR) বেছে নিন।' : 'Select your base reporting currency and preferred display language.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle space-y-2">
            <span className="w-10 h-10 rounded-full bg-brand-emerald text-white font-black text-base inline-flex items-center justify-center">
              ২
            </span>
            <h4 className="font-extrabold text-base text-brand-navy dark:text-white">
              {lang === 'bn' ? 'অ্যাকাউন্ট ও লেনদেন যুক্ত করুন' : 'Add Accounts & Records'}
            </h4>
            <p className="text-xs text-slate-500">
              {lang === 'bn' ? 'নগদ টাকা, ব্যাংক বা বিকাশ/নগদ ওয়ালেট যুক্ত করে আয়-ব্যয় নোট করুন।' : 'Track cash, bank accounts, and mobile wallets with receipt attachments.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle space-y-2">
            <span className="w-10 h-10 rounded-full bg-brand-teal text-white font-black text-base inline-flex items-center justify-center">
              ৩
            </span>
            <h4 className="font-extrabold text-base text-brand-navy dark:text-white">
              {lang === 'bn' ? 'আর্থিক স্বাধীনতা উপভোগ করুন' : 'Master Your Wealth'}
            </h4>
            <p className="text-xs text-slate-500">
              {lang === 'bn' ? 'গ্রাফ, রিয়েল-টাইম ক্যাশফ্লো ক্যালেন্ডার এবং স্টেটমেন্ট দেখে সঞ্চয় বাড়ান।' : 'Visualize trends on interactive charts and export official PDF/CSV statements.'}
            </p>
          </div>
        </div>
      </section>

      {/* Download Center Section */}
      <section id="download" className="px-4 md:px-12 py-16 bg-gradient-to-b from-brand-navy to-brand-navy-dark text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-brand-emerald font-extrabold">
              {lang === 'bn' ? 'যেকোনো ডিভাইসে ইন্সটল করুন' : 'Install on Any Device'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              {lang === 'bn' ? 'Monevia অ্যাপ ডাউনলোড করুন' : 'Download Monevia App'}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              {lang === 'bn'
                ? 'ওয়েব ব্রাউজার ছাড়াও আপনার কম্পিউটার বা মোবাইলে একটি পূর্ণাঙ্গ অ্যাপ হিসেবে সরাসরি ইনস্টল করে চালাতে পারবেন।'
                : 'Install Monevia as a standalone native app on Windows, macOS, Android, and iOS.'}
            </p>
          </div>

          {/* Supported Platforms Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-brand-blue" /> Windows PC
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-slate-300" /> macOS
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-brand-emerald" /> Android
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-purple-300" /> iPhone / iPad
            </span>
          </div>

          {/* Download Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleDownloadApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-emerald hover:bg-emerald-600 text-white font-black text-base shadow-elevated flex items-center justify-center gap-2.5 transition-transform active:scale-95"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>{lang === 'bn' ? 'অ্যাপ ডাউনলোড / ইনস্টল করুন' : 'Download Monevia App'}</span>
            </button>

            <button
              type="button"
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base flex items-center justify-center gap-2.5 transition-colors"
            >
              <span>{lang === 'bn' ? 'ওয়েবসাইটে ব্যবহার করুন' : 'Use on Web Browser'}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-12 py-8 bg-brand-navy-dark text-slate-400 text-xs border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo variant="mark" size="sm" theme="navy" />
            <span className="font-extrabold text-white text-sm">Monevia</span>
            <span>— {BRAND_CONFIG.tagline}</span>
          </div>
          <p>© {new Date().getFullYear()} Monevia Technologies Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
