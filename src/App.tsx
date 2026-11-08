import React, { useState } from 'react';
import { useFinance } from './context/FinanceContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Logo } from './branding/Logo';
import { isInstalledApp } from './utils/platform';

// Pages
import { LandingPage } from './pages/LandingPage';
import { OnboardingFlow } from './pages/onboarding/OnboardingFlow';
import { DashboardPage } from './pages/DashboardPage';
import { IncomePage } from './pages/IncomePage';
import { ExpensesPage } from './pages/ExpensesPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetPage } from './pages/BudgetPage';
import { SavingsPage } from './pages/SavingsPage';
import { ReportsPage } from './pages/ReportsPage';
import { CalendarPage } from './pages/CalendarPage';
import { AccountsPage } from './pages/AccountsPage';
import { SettingsPage } from './pages/SettingsPage';

// Modals
import { TransactionModal } from './components/modals/TransactionModal';
import { BudgetModal } from './components/modals/BudgetModal';
import { SavingsGoalModal } from './components/modals/SavingsGoalModal';
import { AccountModal } from './components/modals/AccountModal';
import { MonthlyClosingModal } from './components/modals/MonthlyClosingModal';

import { Transaction, Budget, SavingsGoal, Account, TransactionType } from './types';

export const App: React.FC = () => {
  const { isLoaded, preferences } = useFinance();

  // Installed app (Android APK / home-screen PWA) opens the finance app directly —
  // the marketing website & download center are only shown in a normal browser.
  const installedApp = isInstalledApp();

  // View Mode: 'landing' (Marketing + Download Showcase) or 'app' (Financial Platform)
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(installedApp ? 'app' : 'landing');
  const goToLanding = installedApp ? undefined : () => setViewMode('landing');

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Modal States
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalInitialType, setTxModalInitialType] = useState<TransactionType>('expense');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [isMonthlyClosingOpen, setIsMonthlyClosingOpen] = useState(false);

  // Loading Splash Screen
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center text-white space-y-4">
        <Logo variant="icon" size="xl" theme="navy" className="animate-pulse" />
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-black tracking-tight">Monevia</h1>
          <p className="text-xs text-slate-400">Loading secure local financial ledger...</p>
        </div>
      </div>
    );
  }

  // 1. Show Landing Page ONLY in regular web browser (NEVER inside installed app / APK)
  if (!installedApp && viewMode === 'landing') {
    return <LandingPage onEnterApp={() => setViewMode('app')} />;
  }

  // 2. If entered App and Onboarding is not completed yet, show Onboarding
  if (!preferences.onboardingCompleted) {
    return <OnboardingFlow onBackToLanding={goToLanding} />;
  }

  // Handlers for Opening Modals
  const handleOpenAddTx = (type: TransactionType = 'expense') => {
    setEditingTx(null);
    setTxModalInitialType(type);
    setIsTxModalOpen(true);
  };

  const handleEditTx = (tx: Transaction) => {
    setEditingTx(tx);
    setTxModalInitialType(tx.type);
    setIsTxModalOpen(true);
  };

  const handleOpenCreateBudget = () => {
    setEditingBudget(null);
    setIsBudgetModalOpen(true);
  };

  const handleEditBudget = (b: Budget) => {
    setEditingBudget(b);
    setIsBudgetModalOpen(true);
  };

  const handleOpenCreateGoal = () => {
    setEditingGoal(null);
    setIsSavingsModalOpen(true);
  };

  const handleEditGoal = (g: SavingsGoal) => {
    setEditingGoal(g);
    setIsSavingsModalOpen(true);
  };

  const handleOpenCreateAccount = () => {
    setEditingAccount(null);
    setIsAccountModalOpen(true);
  };

  const handleEditAccount = (a: Account) => {
    setEditingAccount(a);
    setIsAccountModalOpen(true);
  };

  const handleOpenTransfer = () => {
    setEditingTx(null);
    setTxModalInitialType('transfer');
    setIsTxModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex bg-brand-bg dark:bg-brand-bg-dark text-slate-800 dark:text-slate-100">
      {/* Desktop Navy Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenQuickAdd={() => handleOpenAddTx('expense')}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen w-full max-w-full overflow-x-hidden">
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          onOpenQuickAdd={() => handleOpenAddTx('expense')}
          onNavigateToSettings={() => setCurrentTab('settings')}
          onBackToLanding={goToLanding}
        />

        {/* Dynamic Page Router */}
        <main className="flex-1 p-3 sm:p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-8 overflow-x-hidden">
          {currentTab === 'dashboard' && (
            <DashboardPage
              onOpenAddTransaction={handleOpenAddTx}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'income' && (
            <IncomePage
              onOpenAddIncome={() => handleOpenAddTx('income')}
              onEditTransaction={handleEditTx}
            />
          )}

          {currentTab === 'expenses' && (
            <ExpensesPage
              onOpenAddExpense={() => handleOpenAddTx('expense')}
              onEditTransaction={handleEditTx}
            />
          )}

          {currentTab === 'transactions' && (
            <TransactionsPage
              onOpenAddTransaction={() => handleOpenAddTx('expense')}
              onEditTransaction={handleEditTx}
            />
          )}

          {currentTab === 'budget' && (
            <BudgetPage
              onOpenCreateBudget={handleOpenCreateBudget}
              onEditBudget={handleEditBudget}
            />
          )}

          {currentTab === 'savings' && (
            <SavingsPage
              onOpenCreateGoal={handleOpenCreateGoal}
              onEditGoal={handleEditGoal}
            />
          )}

          {currentTab === 'reports' && <ReportsPage />}

          {currentTab === 'calendar' && <CalendarPage />}

          {currentTab === 'accounts' && (
            <AccountsPage
              onOpenCreateAccount={handleOpenCreateAccount}
              onEditAccount={handleEditAccount}
              onOpenTransfer={handleOpenTransfer}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              onOpenMonthlyClosing={() => setIsMonthlyClosingOpen(true)}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onOpenQuickAdd={() => handleOpenAddTx('expense')}
        />
      </div>

      {/* Unified Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        initialType={txModalInitialType}
        editingTransaction={editingTx}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        editingBudget={editingBudget}
      />

      <SavingsGoalModal
        isOpen={isSavingsModalOpen}
        onClose={() => setIsSavingsModalOpen(false)}
        editingGoal={editingGoal}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        editingAccount={editingAccount}
      />

      <MonthlyClosingModal
        isOpen={isMonthlyClosingOpen}
        onClose={() => setIsMonthlyClosingOpen(false)}
        month={new Date().toISOString().slice(0, 7)}
      />
    </div>
  );
};
