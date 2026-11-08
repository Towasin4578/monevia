import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Account, AccountType } from '../../types';
import { CURRENCIES } from '../../constants/currencies';
import { X, WalletCards } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAccount?: Account | null;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  editingAccount = null,
}) => {
  const { t, addAccount, updateAccount, preferences } = useFinance();

  const [name, setName] = useState<string>(editingAccount ? editingAccount.name : '');
  const [type, setType] = useState<AccountType>(
    editingAccount ? editingAccount.type : 'bank'
  );
  const [currency, setCurrency] = useState<string>(
    editingAccount ? editingAccount.currency : preferences.primaryCurrency
  );
  const [balance, setBalance] = useState<string>(
    editingAccount ? String(editingAccount.balance) : '0'
  );
  const [institution, setInstitution] = useState<string>(
    editingAccount?.institution || ''
  );
  const [color, setColor] = useState<string>(
    editingAccount?.color || '#3563E9'
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingAccount) {
      await updateAccount({
        ...editingAccount,
        name: name.trim(),
        type,
        currency,
        balance: parseFloat(balance) || 0,
        institution: institution.trim() || undefined,
        color,
      });
    } else {
      await addAccount({
        name: name.trim(),
        type,
        currency,
        balance: parseFloat(balance) || 0,
        institution: institution.trim() || undefined,
        color,
        icon: 'Wallet',
      });
    }

    onClose();
  };

  const colors = ['#3563E9', '#142D4E', '#16A36A', '#0F9D8A', '#8B5CF6', '#F59E0B', '#EF4444'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-brand-card-dark rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-brand-border-dark overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-brand-border-dark flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-brand-blue">
              <WalletCards className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-brand-navy dark:text-white">
              {editingAccount
                ? t('common.edit') + ' ' + t('common.account')
                : t('accounts.createAccount')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              {t('accounts.accountName')} *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. City Bank Savings, bKash Personal, Main Cash"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {t('accounts.accountType')} *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AccountType)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
              >
                <option value="bank">{t('accounts.types.bank')}</option>
                <option value="cash">{t('accounts.types.cash')}</option>
                <option value="digital_wallet">{t('accounts.types.digital_wallet')}</option>
                <option value="mobile_money">{t('accounts.types.mobile_money')}</option>
                <option value="debit_card">{t('accounts.types.debit_card')}</option>
                <option value="credit_card">{t('accounts.types.credit_card')}</option>
                <option value="investment">{t('accounts.types.investment')}</option>
                <option value="other">{t('accounts.types.other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {t('accounts.currency')} *
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              {t('accounts.balance')} ({currency}) *
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="0.00"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base font-bold focus:ring-2 focus:ring-brand-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              {t('accounts.institution')}
            </label>
            <input
              type="text"
              placeholder="e.g. HSBC, Dutch-Bangla Bank, bKash Ltd."
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-border-dark bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
            />
          </div>

          {/* Theme Color */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Account Color
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-110 ring-2 ring-offset-2 ring-slate-400' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-sm"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
