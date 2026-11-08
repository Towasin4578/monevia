import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
} from 'lucide-react';
import { Transaction } from '../types';

export const CalendarPage: React.FC = () => {
  const { t, transactions, formatMoney, formatDateStr, preferences } =
    useFinance();

  const [currentYearMonth, setCurrentYearMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() }; // 0-indexed month
  });

  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);

  const year = currentYearMonth.year;
  const month = currentYearMonth.month;

  // Month navigation
  const prevMonth = () => {
    if (month === 0) {
      setCurrentYearMonth({ year: year - 1, month: 11 });
    } else {
      setCurrentYearMonth({ year, month: month - 1 });
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setCurrentYearMonth({ year: year + 1, month: 0 });
    } else {
      setCurrentYearMonth({ year, month: month + 1 });
    }
  };

  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

  // Transactions map by day YYYY-MM-DD
  const dayTransactionsMap = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    transactions.forEach((tx) => {
      if (tx.date.startsWith(monthStr)) {
        const list = map.get(tx.date) || [];
        list.push(tx);
        map.set(tx.date, list);
      }
    });
    return map;
  }, [transactions, monthStr]);

  // Calendar matrix calculation
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = useMemo(() => {
    const days: Array<{ dayNumber: number; dateStr: string; isCurrentMonth: boolean }> = [];

    // Blank cells before first day
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ dayNumber: 0, dateStr: '', isCurrentMonth: false });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateStr, isCurrentMonth: true });
    }

    return days;
  }, [year, month, firstDayOfWeek, daysInMonth]);

  const selectedDayTransactions = useMemo(() => {
    if (!selectedDayDate) return [];
    return dayTransactionsMap.get(selectedDayDate) || [];
  }, [selectedDayDate, dayTransactionsMap]);

  const monthName = new Intl.DateTimeFormat(preferences.numberFormatLocale, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month, 1));

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-navy dark:text-white tracking-tight">
            {t('calendar.title')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('calendar.subtitle')}
          </p>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-brand-card-dark text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-brand-card-dark font-extrabold text-sm text-brand-navy dark:text-white min-w-[150px] text-center">
            {monthName}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-brand-card-dark text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle space-y-4">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 text-center font-bold text-xs uppercase text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return (
                  <div
                    key={`blank-${idx}`}
                    className="h-20 sm:h-24 rounded-xl bg-slate-50/50 dark:bg-slate-900/20 border border-transparent"
                  />
                );
              }

              const txList = dayTransactionsMap.get(cell.dateStr) || [];
              const dayIncome = txList
                .filter((t) => t.type === 'income')
                .reduce((s, t) => s + t.baseAmount, 0);
              const dayExpense = txList
                .filter((t) => t.type === 'expense')
                .reduce((s, t) => s + t.baseAmount, 0);

              const isSelected = selectedDayDate === cell.dateStr;
              const isToday =
                cell.dateStr === new Date().toISOString().split('T')[0];

              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  onClick={() => setSelectedDayDate(cell.dateStr)}
                  className={`h-20 sm:h-24 p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-brand-blue ring-2 ring-brand-blue/30 bg-blue-50/30 dark:bg-blue-900/20'
                      : isToday
                      ? 'border-brand-blue bg-white dark:bg-brand-card-dark font-black'
                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-brand-card-dark hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                    {txList.length > 0 && (
                      <span className="text-[10px] px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                        {txList.length}
                      </span>
                    )}
                  </div>

                  {/* Day Badges */}
                  <div className="space-y-0.5 overflow-hidden">
                    {dayIncome > 0 && (
                      <div className="text-[10px] font-mono font-bold text-brand-emerald truncate">
                        +{formatMoney(dayIncome)}
                      </div>
                    )}
                    {dayExpense > 0 && (
                      <div className="text-[10px] font-mono font-bold text-rose-500 truncate">
                        -{formatMoney(dayExpense)}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Detail Sidebar */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200 dark:border-brand-border-dark shadow-subtle space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('calendar.daySummary')}
            </span>
            <h3 className="text-lg font-black text-brand-navy dark:text-white mt-0.5">
              {selectedDayDate ? formatDateStr(selectedDayDate, 'long') : 'Select a day'}
            </h3>
          </div>

          <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
            {selectedDayDate && selectedDayTransactions.length > 0 ? (
              selectedDayTransactions.map((tx) => {
                const isInc = tx.type === 'income';
                const isTrf = tx.type === 'transfer';

                return (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 dark:text-white truncate">
                        {tx.payeeOrPayer}
                      </span>
                      <span
                        className={`font-mono text-xs font-bold ${
                          isInc
                            ? 'text-brand-emerald'
                            : isTrf
                            ? 'text-brand-blue'
                            : 'text-rose-500'
                        }`}
                      >
                        {isInc ? '+' : isTrf ? '' : '-'}
                        {formatMoney(tx.baseAmount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{tx.time || '12:00'}</span>
                      <span className="capitalize">{tx.type}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-xs text-slate-400">
                {selectedDayDate
                  ? t('calendar.noDayTransactions')
                  : 'Tap any calendar date to view the cashflow events recorded on that day.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
