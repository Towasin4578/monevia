import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  PieChart as PieIcon,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowLeftRight,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import { getCurrencyInfo } from '../constants/currencies';

interface DashboardPageProps {
  onOpenAddTransaction: (type?: 'income' | 'expense' | 'transfer') => void;
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenAddTransaction,
  onNavigate,
}) => {
  const {
    t,
    accounts,
    transactions,
    categories,
    budgets,
    formatMoney,
    formatDateStr,
    preferences,
  } = useFinance();

  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM

  // 1. Core Financial Metrics
  const totalBalance = useMemo(
    () => accounts.reduce((acc, a) => acc + a.balance, 0),
    [accounts]
  );

  const thisMonthTransactions = useMemo(
    () => transactions.filter((t) => t.date.startsWith(currentMonthStr)),
    [transactions, currentMonthStr]
  );

  const totalIncome = useMemo(
    () =>
      thisMonthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.baseAmount, 0),
    [thisMonthTransactions]
  );

  const totalExpenses = useMemo(
    () =>
      thisMonthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.baseAmount, 0),
    [thisMonthTransactions]
  );

  const netSavings = totalIncome - totalExpenses;

  // Total Budgets and Spent
  const currentMonthBudgets = useMemo(
    () => budgets.filter((b) => b.month === currentMonthStr),
    [budgets, currentMonthStr]
  );
  const totalBudgetLimit = currentMonthBudgets.reduce(
    (sum, b) => sum + b.amountLimit,
    0
  );
  const remainingBudget = Math.max(0, totalBudgetLimit - totalExpenses);

  // 2. Daily Spending Trend (Last 14 days)
  const dailySpendingData = useMemo(() => {
    const dayMap: Record<string, number> = {};
    const now = new Date();

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      dayMap[key] = 0;
    }

    transactions.forEach((tx) => {
      if (tx.type === 'expense' && dayMap[tx.date] !== undefined) {
        dayMap[tx.date] += tx.baseAmount;
      }
    });

    return Object.entries(dayMap).map(([dateStr, amount]) => ({
      date: dateStr.slice(5), // MM-DD
      amount: Math.round(amount),
    }));
  }, [transactions]);

  // 3. Expense Category Donut Breakdown
  const categoryDonutData = useMemo(() => {
    const catSum: Record<string, number> = {};

    thisMonthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((tx) => {
        catSum[tx.categoryId] = (catSum[tx.categoryId] || 0) + tx.baseAmount;
      });

    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    const result = Object.entries(catSum).map(([catId, amount]) => {
      const cat = categoryMap.get(catId);
      const name =
        preferences.language === 'bn' && cat?.nameBn
          ? cat.nameBn
          : cat?.name || 'General';
      return {
        name,
        value: Math.round(amount),
        color: cat?.color || '#3563E9',
      };
    });

    return result.sort((a, b) => b.value - a.value);
  }, [thisMonthTransactions, categories, preferences.language]);

  // 4. Monthly Cashflow Comparison (Last 6 Months)
  const monthlyComparisonData = useMemo(() => {
    const months: string[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toISOString().slice(0, 7));
    }

    return months.map((m) => {
      let inc = 0;
      let exp = 0;
      transactions.forEach((tx) => {
        if (tx.date.startsWith(m)) {
          if (tx.type === 'income') inc += tx.baseAmount;
          if (tx.type === 'expense') exp += tx.baseAmount;
        }
      });
      return {
        month: m.slice(5), // MM
        income: Math.round(inc),
        expense: Math.round(exp),
        savings: Math.round(inc - exp),
      };
    });
  }, [transactions]);

  // Recent 6 Transactions
  const recentTransactions = transactions.slice(0, 6);

  const DONUT_COLORS = ['#EF4444', '#F97316', '#3B82F6', '#8B5CF6', '#EC4899', '#0F9D8A', '#64748B'];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-navy dark:text-white tracking-tight">
            {t('dashboard.title')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenAddTransaction('income')}
            className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald hover:bg-emerald-100 dark:hover:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+ {t('nav.income')}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenAddTransaction('expense')}
            className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/70 border border-rose-200/60 dark:border-rose-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>+ {t('nav.expenses')}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenAddTransaction('transfer')}
            className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-brand-blue hover:bg-blue-100 dark:hover:bg-blue-950/70 border border-blue-200/60 dark:border-blue-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Transfer</span>
          </button>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Net Balance */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('dashboard.totalBalance')}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-brand-blue">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl lg:text-2xl font-black text-brand-navy dark:text-white font-mono tracking-tight truncate">
              {formatMoney(totalBalance)}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Across {accounts.length} account{accounts.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Total Income */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('dashboard.totalIncome')}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl lg:text-2xl font-black text-brand-emerald font-mono tracking-tight truncate">
              +{formatMoney(totalIncome)}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {t('dashboard.monthToDate')}
            </span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('dashboard.totalExpenses')}
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl lg:text-2xl font-black text-rose-500 font-mono tracking-tight truncate">
              -{formatMoney(totalExpenses)}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {t('dashboard.monthToDate')}
            </span>
          </div>
        </div>

        {/* Net Savings */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('dashboard.totalSavings')}
            </span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-brand-teal">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div
              className={`text-xl lg:text-2xl font-black font-mono tracking-tight truncate ${
                netSavings >= 0 ? 'text-brand-emerald' : 'text-rose-500'
              }`}
            >
              {netSavings >= 0 ? '+' : ''}
              {formatMoney(netSavings)}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Income - Expenses
            </span>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('dashboard.remainingBudget')}
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl lg:text-2xl font-black text-slate-800 dark:text-white font-mono tracking-tight truncate">
              {totalBudgetLimit > 0 ? formatMoney(remainingBudget) : 'N/A'}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {totalBudgetLimit > 0
                ? `${Math.round((totalExpenses / totalBudgetLimit) * 100)}% used`
                : 'No budget set'}
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts (Income vs Expense 6-Month Trajectory & Category Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
                {t('dashboard.incomeVsExpense')}
              </h3>
              <p className="text-xs text-slate-400">Last 6 months comparison</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-brand-emerald">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald" /> Income
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expense
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: number) => formatMoney(val)}
                  contentStyle={{ backgroundColor: '#142D4E', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="income" name="Income" fill="#16A36A" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Donut */}
        <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
              {t('dashboard.expenseBreakdown')}
            </h3>
            <p className="text-xs text-slate-400">{t('dashboard.monthToDate')}</p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            {categoryDonutData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDonutData}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => formatMoney(val)}
                    contentStyle={{ backgroundColor: '#142D4E', borderRadius: '12px', border: 'none', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-slate-400">
                No expense data this month
              </div>
            )}
          </div>

          <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 custom-scrollbar text-xs">
            {categoryDonutData.slice(0, 4).map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="font-mono font-bold">{formatMoney(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Daily Spending Area Graph & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Spending Trend (Last 14 Days) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
              {t('dashboard.dailySpending')}
            </h3>
            <p className="text-xs text-slate-400">14-day rolling expenditure</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySpendingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3563E9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3563E9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  formatter={(val: number) => formatMoney(val)}
                  contentStyle={{ backgroundColor: '#142D4E', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#3563E9" strokeWidth={2.5} fillOpacity={1} fill="url(#spendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-brand-navy dark:text-white">
                {t('dashboard.recentTransactions')}
              </h3>
              <p className="text-xs text-slate-400">Latest activity across accounts</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('transactions')}
              className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
            >
              <span>{t('common.viewAll')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                const isTransfer = tx.type === 'transfer';
                const isMulti = tx.originalCurrency !== preferences.primaryCurrency;

                return (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-brand-border-dark bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome
                            ? 'bg-emerald-100 text-brand-emerald dark:bg-emerald-950/60'
                            : isTransfer
                            ? 'bg-blue-100 text-brand-blue dark:bg-blue-950/60'
                            : 'bg-rose-100 text-rose-500 dark:bg-rose-950/60'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
                        ) : isTransfer ? (
                          <ArrowLeftRight className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">
                          {tx.payeeOrPayer}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>{formatDateStr(tx.date, 'short')}</span>
                          {tx.notes && <span className="truncate max-w-[120px]">• {tx.notes}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-mono font-bold text-xs sm:text-sm ${
                          isIncome
                            ? 'text-brand-emerald'
                            : isTransfer
                            ? 'text-brand-blue'
                            : 'text-rose-500'
                        }`}
                      >
                        {isIncome ? '+' : isTransfer ? '' : '-'}
                        {formatMoney(tx.baseAmount)}
                      </div>
                      {isMulti && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          orig: {tx.amount.toFixed(2)} {tx.originalCurrency}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                {t('dashboard.noTransactions')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
