import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CURRENCIES, getCurrencyInfo } from '../../constants/currencies';
import { Transaction, TransactionType } from '../../types';
import { convertCurrency } from '../../utils/currencyConverter';
import {
  X,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  Upload,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: TransactionType;
  editingTransaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  initialType = 'expense',
  editingTransaction = null,
}) => {
  const {
    t,
    preferences,
    accounts,
    categories,
    addTransaction,
    updateTransaction,
    customExchangeRates,
    formatMoney,
  } = useFinance();

  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>(preferences.primaryCurrency);
  const [customRate, setCustomRate] = useState<string>('');
  const [useCustomRate, setUseCustomRate] = useState<boolean>(false);

  const [accountId, setAccountId] = useState<string>('');
  const [toAccountId, setToAccountId] = useState<string>('');
  const [transferFee, setTransferFee] = useState<string>('0');

  const [categoryId, setCategoryId] = useState<string>('');
  const [subcategoryId, setSubcategoryId] = useState<string>('');

  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [payeeOrPayer, setPayeeOrPayer] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Electronic');
  const [notes, setNotes] = useState<string>('');
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');

  // Synchronize on open or change
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(String(editingTransaction.amount));
      setCurrency(editingTransaction.originalCurrency);
      setAccountId(editingTransaction.accountId);
      setToAccountId(editingTransaction.toAccountId || '');
      setTransferFee(String(editingTransaction.transferFee || 0));
      setCategoryId(editingTransaction.categoryId);
      setSubcategoryId(editingTransaction.subcategoryId || '');
      setDate(editingTransaction.date);
      setTime(editingTransaction.time || '12:00');
      setPayeeOrPayer(editingTransaction.payeeOrPayer || '');
      setPaymentMethod(editingTransaction.paymentMethod || 'Card');
      setNotes(editingTransaction.notes || '');
      setReceiptUrl(editingTransaction.receiptUrl || '');
      setReceiptFileName(editingTransaction.receiptFileName || '');
    } else {
      setType(initialType);
      setAmount('');
      setCurrency(preferences.primaryCurrency);
      setCustomRate('');
      setUseCustomRate(false);
      setAccountId(accounts[0]?.id || '');
      setToAccountId(accounts[1]?.id || '');
      setTransferFee('0');
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toTimeString().slice(0, 5));
      setPayeeOrPayer('');
      setNotes('');
      setReceiptUrl('');
      setReceiptFileName('');

      // Default category for type
      const suitable = categories.filter((c) =>
        initialType === 'transfer' ? true : c.type === initialType
      );
      if (suitable[0]) {
        setCategoryId(suitable[0].id);
        setSubcategoryId(suitable[0].subcategories[0]?.id || '');
      }
    }
  }, [editingTransaction, initialType, isOpen, accounts, categories, preferences.primaryCurrency]);

  if (!isOpen) return null;

  // Selected Category & Subcategories
  const currentCategory = categories.find((c) => c.id === categoryId);
  const relevantCategories = categories.filter((c) =>
    type === 'transfer' ? true : c.type === type
  );

  // Conversion Preview
  const numAmount = parseFloat(amount) || 0;
  const isMultiCurrency = currency !== preferences.primaryCurrency;
  const conversion = convertCurrency(
    numAmount,
    currency,
    preferences.primaryCurrency,
    customExchangeRates,
    preferences.multiCurrencyEnabled
  );

  const appliedRate = useCustomRate && parseFloat(customRate) > 0
    ? parseFloat(customRate)
    : conversion.rate;
  const calculatedBaseAmount = Number((numAmount * appliedRate).toFixed(2));

  // Handle Receipt Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || numAmount <= 0) return;
    if (!accountId) return;

    if (editingTransaction) {
      await updateTransaction({
        ...editingTransaction,
        type,
        amount: numAmount,
        originalCurrency: currency,
        baseCurrency: preferences.primaryCurrency,
        baseAmount: calculatedBaseAmount,
        exchangeRate: appliedRate,
        accountId,
        toAccountId: type === 'transfer' ? toAccountId : undefined,
        transferFee: type === 'transfer' ? parseFloat(transferFee) || 0 : undefined,
        categoryId: type === 'transfer' ? (categories[0]?.id || '') : categoryId,
        subcategoryId: subcategoryId || undefined,
        date,
        time,
        payeeOrPayer: payeeOrPayer.trim() || (type === 'transfer' ? 'Internal Transfer' : 'General'),
        paymentMethod,
        notes,
        receiptUrl,
        receiptFileName,
      });
    } else {
      await addTransaction({
        type,
        amount: numAmount,
        originalCurrency: currency,
        customRate: useCustomRate ? appliedRate : undefined,
        accountId,
        toAccountId: type === 'transfer' ? toAccountId : undefined,
        transferFee: type === 'transfer' ? parseFloat(transferFee) || 0 : undefined,
        categoryId: type === 'transfer' ? (categories[0]?.id || '') : categoryId,
        subcategoryId: subcategoryId || undefined,
        date,
        time,
        payeeOrPayer: payeeOrPayer.trim() || (type === 'transfer' ? 'Internal Transfer' : 'General'),
        paymentMethod,
        notes,
        receiptUrl,
        receiptFileName,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-brand-card-dark rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-brand-border-dark custom-scrollbar">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-brand-border-dark flex items-center justify-between sticky top-0 bg-white/95 dark:bg-brand-card-dark/95 backdrop-blur z-10">
          <h2 className="text-xl font-black text-brand-navy dark:text-white">
            {editingTransaction
              ? t('common.edit') + ' ' + t('nav.transactions')
              : t('transactions.addTransaction')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Transaction Type Segmented Toggle */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                const firstExp = categories.find((c) => c.type === 'expense');
                if (firstExp) {
                  setCategoryId(firstExp.id);
                  setSubcategoryId(firstExp.subcategories[0]?.id || '');
                }
              }}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>{t('nav.expenses')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('income');
                const firstInc = categories.find((c) => c.type === 'income');
                if (firstInc) {
                  setCategoryId(firstInc.id);
                  setSubcategoryId(firstInc.subcategories[0]?.id || '');
                }
              }}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                type === 'income'
                  ? 'bg-brand-emerald text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t('nav.income')}</span>
            </button>

            <button
              type="button"
              onClick={() => setType('transfer')}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                type === 'transfer'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Transfer</span>
            </button>
          </div>

          {/* Amount & Currency Fields */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('common.amount')} *
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-3 text-lg font-bold text-slate-400">
                  {getCurrencyInfo(currency).symbol}
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xl font-bold focus:ring-2 focus:ring-brand-blue focus:outline-none"
                />
              </div>

              {/* Currency Selector */}
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-32 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Multi-Currency Conversion Preview & Snapshot */}
          {isMultiCurrency && (
            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs space-y-2">
              <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5 text-brand-blue">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('transactions.convertedTo')}:
                </span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {formatMoney(calculatedBaseAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  Rate snapshot: 1 {currency} = {appliedRate.toFixed(4)}{' '}
                  {preferences.primaryCurrency}
                </span>
                <button
                  type="button"
                  onClick={() => setUseCustomRate(!useCustomRate)}
                  className="text-brand-blue font-semibold hover:underline"
                >
                  {useCustomRate ? 'Use System Rate' : 'Edit Rate'}
                </button>
              </div>

              {useCustomRate && (
                <div className="pt-1.5 flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 whitespace-nowrap">
                    Override Rate:
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    placeholder={appliedRate.toFixed(4)}
                    className="w-28 px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              )}

              {conversion.isPending && (
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('transactions.ratePendingWarning')}</span>
                </div>
              )}
            </div>
          )}

          {/* Account Selection */}
          {type === 'transfer' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {t('transactions.fromAccount')} *
                </label>
                <select
                  required
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {t('transactions.toAccount')} *
                </label>
                <select
                  required
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                >
                  {accounts
                    .filter((a) => a.id !== accountId)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.currency})
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {t('common.account')} *
              </label>
              <select
                required
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.currency} ({formatMoney(a.balance, a.currency)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category & Subcategory Selection (Only for Income and Expense) */}
          {type !== 'transfer' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {t('common.category')} *
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    const sel = categories.find((c) => c.id === e.target.value);
                    setSubcategoryId(sel?.subcategories[0]?.id || '');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                >
                  {relevantCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {preferences.language === 'bn' && c.nameBn ? c.nameBn : c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {t('common.subcategory')}
                </label>
                <select
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  disabled={!currentCategory?.subcategories.length}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none disabled:opacity-50"
                >
                  <option value="">(None)</option>
                  {currentCategory?.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {preferences.language === 'bn' && sub.nameBn ? sub.nameBn : sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {t('common.date')} *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payee / Source */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              {t('transactions.payeeOrPayer')}
            </label>
            <input
              type="text"
              value={payeeOrPayer}
              onChange={(e) => setPayeeOrPayer(e.target.value)}
              placeholder="e.g. Agora Supermarket, Client ACME, Salary"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
            />
          </div>

          {/* Payment Method & Transfer Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {t('transactions.paymentMethod')}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
              >
                <option value="Electronic">Electronic / Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Wire">Bank Wire</option>
                <option value="bKash / Nagad">Mobile Money (bKash/Nagad)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {type === 'transfer' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {t('transactions.transferFee')}
                </label>
                <input
                  type="number"
                  step="any"
                  value={transferFee}
                  onChange={(e) => setTransferFee(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              {t('common.notes')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes or memos..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none resize-none"
            />
          </div>

          {/* Receipt Attachment Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              {t('transactions.receiptAttachment')}
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Upload className="w-4 h-4 text-brand-blue" />
                <span>{receiptFileName ? 'Change Receipt' : t('transactions.uploadReceipt')}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {receiptFileName && (
                <span className="text-xs text-brand-emerald font-medium truncate max-w-[200px]">
                  ✓ {receiptFileName}
                </span>
              )}
            </div>
            {receiptUrl && receiptUrl.startsWith('data:image') && (
              <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={receiptUrl}
                  alt="Receipt Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-brand-border-dark flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-sm shadow-md transition-transform active:scale-95"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
