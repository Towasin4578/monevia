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
  Apple,
  Monitor,
  Heart,
  ChevronDown,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallTip, setShowInstallTip] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Smooth scroll to the device download section
  const scrollToDownloadCenter = () => {
    const el = document.getElementById('download-center');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      setShowInstallTip(true);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F5F7FB] dark:bg-[#0B132B] text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-brand-blue selection:text-white">
      {/* Sticky Header with prominent Mobile & Desktop Download Actions */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-brand-navy-dark/95 backdrop-blur-md border-b border-slate-200/80 dark:border-brand-border-dark px-3 sm:px-6 md:px-12 py-3.5 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div className="shrink-0 flex items-center gap-2">
            <Logo variant="horizontal" size="md" showTagline={false} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-brand-blue transition-colors">
              {lang === 'bn' ? 'ফিচারসমূহ' : 'Features'}
            </a>
            <a href="#how-it-works" className="hover:text-brand-blue transition-colors">
              {lang === 'bn' ? 'ব্যবহার পদ্ধতি' : 'How it works'}
            </a>
            <a href="#download-center" className="hover:text-brand-blue transition-colors text-brand-emerald font-bold">
              {lang === 'bn' ? 'ডাউনলোড সেন্টার' : 'Download Center'}
            </a>
          </nav>

          {/* Header Right Actions (Mobile & Desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-slate-300 flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-brand-blue shrink-0" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Direct Download Anchor Button (Takes to Download Center without alerts) */}
            <button
              type="button"
              onClick={scrollToDownloadCenter}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800 text-brand-emerald text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">{lang === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
            </button>

            {/* Launch Web App Button */}
            <button
              type="button"
              onClick={onEnterApp}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-bold shadow-sm flex items-center gap-1 transition-transform active:scale-95 shrink-0"
            >
              <span>{lang === 'bn' ? 'অ্যাপে যান' : 'Open App'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section (Fully Responsive for Mobile - Zero Overflow) */}
      <section className="relative px-4 sm:px-6 md:px-12 pt-8 sm:pt-14 md:pt-20 pb-12 sm:pb-16 max-w-7xl mx-auto w-full text-center space-y-5 sm:space-y-6">
        {/* Fintech Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-brand-blue text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-brand-teal shrink-0" />
          <span>{lang === 'bn' ? 'গ্লোবাল পার্সোনাল ফাইন্যান্স প্ল্যাটফর্ম' : 'Global Personal Finance Platform'}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-brand-navy dark:text-white tracking-tight max-w-4xl mx-auto leading-tight break-words">
          {lang === 'bn' ? (
            <>
              আপনার অর্থ। <span className="text-brand-blue">আপনার সম্পূর্ণ নিয়ন্ত্রণ।</span>
            </>
          ) : (
            <>
              Your Money. <span className="text-brand-blue">Your Total Control.</span>
            </>
          )}
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-2">
          {lang === 'bn'
            ? 'বাংলাদেশ, ভারত, মধ্যপ্রাচ্য কিংবা যুক্তরাষ্ট্র—বিশ্বের যেকোনো প্রান্তের জন্য বহু-মুদ্রা (BDT, USD, INR), স্মার্ট বাজেট, সঞ্চয় ও ব্যাংক হিসাবের আধুনিক সমাধান।'
            : 'Track multi-currency income, categorize expenditures, manage smart budgets, and reach savings milestones with 100% offline privacy.'}
        </p>

        {/* Hero Dual Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto sm:max-w-none">
          {/* Button 1: Directly enter web app */}
          <button
            type="button"
            onClick={onEnterApp}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-blue hover:bg-brand-blue-hover text-white font-black text-sm sm:text-base shadow-elevated flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span>{lang === 'bn' ? 'সরাসরি অনলাইনে ব্যবহার করুন' : 'Launch Web App Online'}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          {/* Button 2: Scroll directly to Device Download Section */}
          <button
            type="button"
            onClick={scrollToDownloadCenter}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-brand-card-dark hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-brand-emerald text-brand-emerald font-black text-sm sm:text-base shadow-card flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Download className="w-4 h-4 shrink-0 stroke-[2.5]" />
            <span>{lang === 'bn' ? 'ডিভাইসের জন্য ডাউনলোড' : 'Download for Device'}</span>
            <ChevronDown className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-medium">✓ {lang === 'bn' ? '১০০% ফ্রি' : '100% Free'}</span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium">✓ {lang === 'bn' ? 'কোনো বিজ্ঞাপন নেই' : 'Zero Ads'}</span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium">✓ {lang === 'bn' ? 'সম্পূর্ণ অফলাইনেও চলে' : 'Runs Offline'}</span>
        </div>

        {/* Interactive Mockup Preview Card */}
        <div className="pt-6 sm:pt-10 max-w-5xl mx-auto w-full">
          <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-2xl text-left space-y-4">
            {/* Top Bar Preview */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="ml-1 font-mono text-[11px] font-bold text-slate-400 truncate max-w-[150px] sm:max-w-none">
                  monevia.finance/overview
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald font-bold text-[11px] font-mono">
                  BDT (৳)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-brand-blue font-bold text-[11px]">
                  {lang === 'bn' ? 'বাংলা' : 'English'}
                </span>
              </div>
            </div>

            {/* Metrics Row Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Net Worth</span>
                <div className="text-base sm:text-xl font-black font-mono text-brand-navy dark:text-white mt-0.5 truncate">
                  ৳১,৮৫,৪৫০.০০
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Income</span>
                <div className="text-base sm:text-xl font-black font-mono text-brand-emerald mt-0.5 truncate">
                  +৳৬৫,০০০.০০
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Expenses</span>
                <div className="text-base sm:text-xl font-black font-mono text-rose-500 mt-0.5 truncate">
                  -৳২৫,২০০.০০
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Net Savings</span>
                <div className="text-base sm:text-xl font-black font-mono text-brand-teal mt-0.5 truncate">
                  +৳৩৯,৮০০.০০
                </div>
              </div>
            </div>

            {/* Multi-Currency Conversion Strip */}
            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/30 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-brand-blue font-bold">
                <Coins className="w-4 h-4 shrink-0" />
                {lang === 'bn' ? 'বহু-মুদ্রা অডিট কনভার্সন:' : 'Multi-Currency Snapshot:'}
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                $500.00 USD ➔ ৳60,875.00 BDT (Rate: 121.75)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: DEVICE DOWNLOAD CENTER (কন ডিভাইসের জন্য ডাউনলোড করবেন) */}
      <section id="download-center" className="px-4 sm:px-6 md:px-12 py-16 bg-gradient-to-b from-brand-navy-dark via-brand-navy to-brand-navy-dark text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-wider text-brand-emerald font-black px-3 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 inline-block">
              {lang === 'bn' ? 'ডাউনলোড ও ইনস্টলেশন হাব' : 'Download & Installation Hub'}
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">
              {lang === 'bn' ? 'কোন ডিভাইসের জন্য ডাউনলোড করবেন?' : 'Choose Your Device to Download'}
            </h2>
            <p className="text-xs sm:text-base text-slate-300">
              {lang === 'bn'
                ? 'আপনার পছন্দের ডিভাইসে ক্লিক করুন — সাথে সাথে ডাউনলোড ও ইনস্টল শুরু হবে!'
                : 'Click your preferred device below to trigger direct download or 1-click installation.'}
            </p>
          </div>

          {/* 4 Dedicated Device Download Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Windows PC */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-blue hover:bg-white/10 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-brand-blue flex items-center justify-center">
                  <Monitor className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-white">
                  Windows PC
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'bn'
                    ? 'Windows 10/11-এর জন্য সম্পূর্ণ অফলাইন জিপ প্যাকেজ। ডাবল-ক্লিক করলেই চলবে।'
                    : 'Standalone offline package for Windows 10/11. No setup required.'}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href="/downloads/Monevia-Desktop-Windows.zip"
                  download="Monevia-Desktop-Windows.zip"
                  className="w-full py-3 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'Windows Zip ডাউনলোড' : 'Download Zip (PC)'}</span>
                </a>
                <span className="block text-[10px] text-slate-400 text-center font-mono">
                  v1.0.0 • 232 KB • 100% Offline
                </span>
              </div>
            </div>

            {/* 2. Android Mobile */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-emerald hover:bg-white/10 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-brand-emerald flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-white">
                  Android Mobile
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'bn'
                    ? 'Android ফোনের জন্য সরাসরি আসল Monevia.apk ডাউনলোড করে সাধারণ অ্যাপের মতো ইনস্টল করুন।'
                    : 'Download official Monevia.apk directly to your Android device and install.'}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href="/downloads/Monevia.apk"
                  download="Monevia.apk"
                  className="w-full py-3 px-4 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'সরাসরি Monevia.apk ডাউনলোড' : 'Download Monevia.apk'}</span>
                </a>
                <button
                  type="button"
                  onClick={handleInstallPWA}
                  className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{lang === 'bn' ? 'বা ১-ক্লিক ব্রাউজারে ইনস্টল' : 'Or 1-Click Install'}</span>
                </button>
                <span className="block text-[10px] text-slate-400 text-center font-mono">
                  v1.0.0 • 4.2 MB • Native Android APK
                </span>
              </div>
            </div>

            {/* 3. Apple iPhone / Mac */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-400 hover:bg-white/10 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                  <Apple className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-white">
                  Apple iPhone / Mac
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'bn'
                    ? 'iOS Safari থেকে "Add to Home Screen" অথবা Mac-এ সরাসরি অ্যাপ চালান।'
                    : 'Fast installation on iOS Safari via Add to Home Screen and macOS.'}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleInstallPWA}
                  className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'iOS / Mac-এ ইনস্টল' : 'Install for Apple'}</span>
                </button>
                <span className="block text-[10px] text-slate-400 text-center font-mono">
                  iOS & macOS Verified
                </span>
              </div>
            </div>

            {/* 4. Instant Web Browser App */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-400 hover:bg-white/10 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-white">
                  Web Browser
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'bn'
                    ? 'কোনো কিছু ডাউনলোড না করেই সরাসরি ব্রাউজারে ইনস্ট্যান্ট ব্যবহার শুরু করুন।'
                    : 'Zero downloads. Launch the complete platform directly in your browser.'}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={onEnterApp}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'অনলাইনে চালু করুন' : 'Launch Online'}</span>
                </button>
                <span className="block text-[10px] text-slate-400 text-center font-mono">
                  Chrome, Safari, Edge, Firefox
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="px-4 sm:px-6 md:px-12 py-16 bg-white dark:bg-brand-card-dark border-t border-slate-200/80 dark:border-brand-border-dark">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-brand-navy dark:text-white tracking-tight">
              {lang === 'bn' ? 'Monevia-র মূল শক্তিশালী ফিচারসমূহ' : 'Powerful Core Features'}
            </h2>
            <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400">
              {lang === 'bn'
                ? 'সাধারণ মানি ট্র্যাকার অ্যাপগুলোর সীমাবদ্ধতা দূর করে তৈরি বিশ্বমানের আর্থিক সিস্টেম।'
                : 'Built with international fintech architecture to give you clarity and discipline.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Multi-Currency */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-brand-blue flex items-center justify-center">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-brand-navy dark:text-white">
                {lang === 'bn' ? '১০০% বহু-মুদ্রা ইঞ্জিন' : 'Universal Multi-Currency Engine'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'bn'
                  ? 'BDT (৳), USD ($), EUR (€), INR (₹), SAR (﷼) সহ বিশ্বের যেকোনো মুদ্রায় লেনদেন লিখুন। আসল হিস্টোরিক্যাল রেট বজায় রেখে হিসাব হবে।'
                  : 'Track foreign income and expenses with automatic ISO 4217 exchange rate snapshots without altering historical records.'}
              </p>
            </div>

            {/* Feature 2: Independent Localization */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-brand-emerald flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-brand-navy dark:text-white">
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
              <h3 className="font-extrabold text-base sm:text-lg text-brand-navy dark:text-white">
                {lang === 'bn' ? 'নিরাপদ ও লোকাল-ফার্স্ট' : '100% Private & Local-First'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'bn'
                  ? 'আপনার সমস্ত আর্থিক ডাটা আপনার নিজের ডিভাইসেই IndexedDB ডাটাবেসে সুরক্ষিত থাকে। কোনো ইন্টারনেট ছাড়াও চলে।'
                  : 'Your financial ledger lives privately in your browser storage. Zero latency and works completely offline.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Credits & Main Website Showcase */}
      <section className="px-4 sm:px-6 md:px-12 py-10 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/50 text-brand-blue text-xs font-bold">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Developer & Creator Credit</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            Designed & Developed by <span className="text-brand-blue font-black">Towasin</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            {lang === 'bn'
              ? 'অন্যান্য প্রজেক্ট ও পোর্টফোলিও দেখতে ভিজিট করুন অফিসিয়াল ওয়েবসাইটে:'
              : 'Discover more software projects, products, and portfolio work:'}
          </p>
          <div className="pt-1">
            <a
              href="https://towasin.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-brand-blue text-brand-blue font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105"
            >
              <span>towasin.pages.dev</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 md:px-12 py-8 bg-brand-navy-dark text-slate-400 text-xs border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Logo variant="mark" size="sm" theme="navy" />
            <span className="font-extrabold text-white text-sm">Monevia</span>
            <span>— {BRAND_CONFIG.tagline}</span>
          </div>
          <p>
            © {new Date().getFullYear()} Monevia • Created by{' '}
            <a
              href="https://towasin.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue font-bold hover:underline"
            >
              Towasin
            </a>
          </p>
        </div>
      </footer>

      {/* Mobile Install Helper Modal */}
      {showInstallTip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-navy-dark rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-elevated border border-slate-200 dark:border-brand-border-dark text-slate-800 dark:text-white animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-brand-emerald/20 text-brand-emerald flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowInstallTip(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <h4 className="font-black text-lg">
              {lang === 'bn' ? 'মোবাইলে ইনস্টল করার নিয়ম' : 'How to Install on Mobile'}
            </h4>
            <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>{lang === 'bn' ? 'ব্রাউজারের উপরের বা নিচের ৩-ডট (মেনু) বাটনে চাপুন।' : 'Tap the 3-dots (menu) in your browser.'}</li>
              <li>{lang === 'bn' ? '"Install app" অথবা "Add to Home screen"-এ ট্যাপ করুন।' : 'Tap "Install app" or "Add to Home screen".'}</li>
              <li>{lang === 'bn' ? 'সাথে সাথে আপনার মোবাইলে আসল Monevia অ্যাপ ইনস্টল হয়ে যাবে!' : 'Monevia will install directly onto your phone!'}</li>
            </ol>
            <button
              type="button"
              onClick={() => setShowInstallTip(false)}
              className="w-full py-3 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors"
            >
              {lang === 'bn' ? 'বুঝেছি / ঠিক আছে' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
