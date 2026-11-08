import { Transaction, MonthlyClosing } from '../types';

/**
 * Monevia Accounting Engine
 * Implements strict double-entry principles and month-end closing carry-forward.
 */

export interface MonthSummary {
  month: string; // YYYY-MM
  openingBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number; // Income - Expenses
  closingBalance: number;
  incomeCount: number;
  expenseCount: number;
  transferCount: number;
}

/**
 * Computes monthly totals for a given month YYYY-MM
 * Excludes transfers from income/expenses!
 */
export function calculateMonthFinancials(
  month: string, // YYYY-MM
  transactions: Transaction[],
  openingBalance = 0
): MonthSummary {
  let totalIncome = 0;
  let totalExpenses = 0;
  let incomeCount = 0;
  let expenseCount = 0;
  let transferCount = 0;

  for (const tx of transactions) {
    if (!tx.date.startsWith(month)) continue;

    if (tx.type === 'income') {
      totalIncome += tx.baseAmount;
      incomeCount++;
    } else if (tx.type === 'expense') {
      totalExpenses += tx.baseAmount;
      expenseCount++;
    } else if (tx.type === 'transfer') {
      // Transfers between user accounts do NOT alter net worth, except optional transfer fee
      transferCount++;
      if (tx.transferFee && tx.transferFee > 0) {
        totalExpenses += tx.transferFee;
      }
    }
  }

  const netSavings = totalIncome - totalExpenses;
  const closingBalance = openingBalance + netSavings;

  return {
    month,
    openingBalance,
    totalIncome: Number(totalIncome.toFixed(2)),
    totalExpenses: Number(totalExpenses.toFixed(2)),
    netSavings: Number(netSavings.toFixed(2)),
    closingBalance: Number(closingBalance.toFixed(2)),
    incomeCount,
    expenseCount,
    transferCount,
  };
}

/**
 * Helper to get the previous month in YYYY-MM format
 */
export function getPreviousMonth(month: string): string {
  const [yearStr, monthStr] = month.split('-');
  let year = parseInt(yearStr, 10);
  let m = parseInt(monthStr, 10);

  if (m === 1) {
    year -= 1;
    m = 12;
  } else {
    m -= 1;
  }

  return `${year}-${String(m).padStart(2, '0')}`;
}

/**
 * Helper to get the next month in YYYY-MM format
 */
export function getNextMonth(month: string): string {
  const [yearStr, monthStr] = month.split('-');
  let year = parseInt(yearStr, 10);
  let m = parseInt(monthStr, 10);

  if (m === 12) {
    year += 1;
    m = 1;
  } else {
    m += 1;
  }

  return `${year}-${String(m).padStart(2, '0')}`;
}

/**
 * Determine the opening balance for a target month by looking up
 * the previous month's closing balance, or starting balance.
 */
export function resolveOpeningBalanceForMonth(
  targetMonth: string,
  closings: MonthlyClosing[],
  initialAccountBalancesSum: number
): number {
  const prevMonth = getPreviousMonth(targetMonth);
  const prevClosing = closings.find((c) => c.month === prevMonth && c.isClosed);

  if (prevClosing) {
    return prevClosing.closingBalance;
  }

  // If no prior closing recorded, base on initial baseline accounts sum
  return initialAccountBalancesSum;
}
