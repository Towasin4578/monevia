import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  WalletCards,
  Plus,
  ArrowLeftRight,
  Landmark,
  CreditCard,
  Banknote,
  Smartphone,
  TrendingUp,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Account, AccountType } from '../types';

interface AccountsPageProps {
  onOpenCreateAccount: () => void;
  onEditAccount: (account: Account) => void;
  onOpenTransfer: () => void;
}

export const AccountsPage: React.FC<AccountsPageProps> = ({
  onOpenCreateAccount,
  onEditAccount,
  onOpenTransfer,
}) => {
  const { t, accounts, deleteAccount, formatMoney } = useFinance();

  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case 'bank':
        return Landmark;
      case 'credit_card':
      case 'debit_card':
        return CreditCard;
      case 'cash':
        return Banknote;
      case 'mobile_money':
      case 'digital_wallet':
        return Smartphone;
      default:
        return WalletCards;
    }
  };

  const totalNetWorth = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-navy dark:text-white tracking-tight">
            {t('accounts.title')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('accounts.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenTransfer}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-brand-blue flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>{t('accounts.transferBetween')}</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateAccount}
            className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('accounts.createAccount')}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Balance Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-navy-light to-brand-blue text-white shadow-card flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">
            Total Combined Portfolio Worth
          </span>
          <div className="text-3xl font-black font-mono mt-1 text-brand-emerald">
            {formatMoney(totalNetWorth)}
          </div>
          <span className="text-xs text-slate-300/80 mt-1 block">
            Aggregated across {accounts.length} active financial accounts
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md">
          <WalletCards className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {accounts.map((acc) => {
          const Icon = getAccountIcon(acc.type);

          return (
            <div
              key={acc.id}
              className="p-5 rounded-2xl bg-white dark:bg-brand-card-dark border border-slate-200/80 dark:border-brand-border-dark shadow-subtle hover:shadow-card transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: acc.color || '#3563E9' }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-brand-navy dark:text-white truncate max-w-[150px]">
                        {acc.name}
                      </h3>
                      <span className="text-xs text-slate-400 capitalize">
                        {acc.institution || acc.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditAccount(acc)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-blue hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {accounts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteAccount(acc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t('accounts.balance')}
                  </span>
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                    {formatMoney(acc.balance, acc.currency)}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-brand-border-dark flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Currency: {acc.currency}</span>
                {acc.isDefault && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-brand-blue font-bold text-[10px]">
                    Primary
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
