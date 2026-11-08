import { Transaction, Account, Category } from '../types';
import { formatCurrency, formatDate } from './formatting';

/**
 * Monevia Data Export & Backup Utilities
 */

export function exportTransactionsToCSV(
  transactions: Transaction[],
  accounts: Account[],
  categories: Category[],
  baseCurrency: string,
  locale = 'en-US'
): void {
  const accountMap = new Map(accounts.map((a) => [a.id, a.name]));
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const headers = [
    'Date',
    'Type',
    'Payee / Source',
    'Category',
    'Account',
    'Original Amount',
    'Original Currency',
    'Base Amount',
    'Base Currency',
    'Exchange Rate',
    'Notes',
  ];

  const rows = transactions.map((t) => [
    formatDate(t.date, 'short', locale),
    t.type.toUpperCase(),
    `"${(t.payeeOrPayer || '').replace(/"/g, '""')}"`,
    `"${categoryMap.get(t.categoryId) || 'Uncategorized'}"`,
    `"${accountMap.get(t.accountId) || 'Unknown'}"`,
    t.amount.toFixed(2),
    t.originalCurrency,
    t.baseAmount.toFixed(2),
    t.baseCurrency || baseCurrency,
    t.exchangeRate.toFixed(4),
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join(
    '\r\n'
  );

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `monevia_transactions_${new Date().toISOString().split('T')[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate full JSON database backup
 */
export function exportBackupJSON(allData: Record<string, unknown>): void {
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(allData, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute(
    'download',
    `monevia_backup_${new Date().toISOString().split('T')[0]}.json`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Print / PDF trigger for clean report printing
 */
export function printCurrentReport(): void {
  window.print();
}
