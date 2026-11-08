-- ==============================================================================
-- MONEVIA — Production PostgreSQL / Supabase Migration Schema
-- Global Personal Finance & Expense Management Platform
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Profiles & Global Preferences
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    country VARCHAR(10) NOT NULL DEFAULT 'BD',
    primary_currency VARCHAR(10) NOT NULL DEFAULT 'BDT',
    multi_currency_enabled BOOLEAN NOT NULL DEFAULT true,
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Dhaka',
    date_format VARCHAR(20) NOT NULL DEFAULT 'DD/MM/YYYY',
    number_format_locale VARCHAR(20) NOT NULL DEFAULT 'en-US',
    theme VARCHAR(20) NOT NULL DEFAULT 'light',
    budget_alerts_enabled BOOLEAN NOT NULL DEFAULT true,
    notify_at_50 BOOLEAN NOT NULL DEFAULT true,
    notify_at_80 BOOLEAN NOT NULL DEFAULT true,
    notify_at_100 BOOLEAN NOT NULL DEFAULT true,
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Financial Accounts
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- cash, bank, debit_card, credit_card, digital_wallet, mobile_money, investment
    currency VARCHAR(10) NOT NULL, -- ISO 4217 code
    balance DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
    institution TEXT,
    account_number_masked VARCHAR(50),
    color VARCHAR(20) NOT NULL DEFAULT '#142D4E',
    icon VARCHAR(50) NOT NULL DEFAULT 'Wallet',
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accounts_user ON public.accounts(user_id);

-- 3. Categories & Subcategories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for system defaults
    name TEXT NOT NULL,
    name_bn TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    icon VARCHAR(50) NOT NULL DEFAULT 'Tag',
    color VARCHAR(20) NOT NULL DEFAULT '#3563E9',
    subcategories JSONB DEFAULT '[]'::jsonb,
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_custom BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_user ON public.categories(user_id);

-- 4. Transactions Ledger
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    amount DECIMAL(18, 4) NOT NULL, -- Original transaction amount
    original_currency VARCHAR(10) NOT NULL, -- ISO 4217
    base_currency VARCHAR(10) NOT NULL, -- Base currency snapshot
    base_amount DECIMAL(18, 4) NOT NULL, -- Converted into user base currency
    exchange_rate DECIMAL(18, 6) NOT NULL DEFAULT 1.000000,
    exchange_rate_pending BOOLEAN NOT NULL DEFAULT false,
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE RESTRICT,
    to_account_id UUID REFERENCES public.accounts(id) ON DELETE RESTRICT,
    transfer_fee DECIMAL(18, 4) DEFAULT 0.0000,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    subcategory_id TEXT,
    date DATE NOT NULL,
    time VARCHAR(10),
    payee_or_payer TEXT NOT NULL,
    payment_method VARCHAR(50),
    notes TEXT,
    receipt_url TEXT,
    tags TEXT[],
    is_recurring BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tx_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_tx_account ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_tx_category ON public.transactions(category_id);

-- 5. Monthly Budgets
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- YYYY-MM
    amount_limit DECIMAL(18, 4) NOT NULL,
    notify_50 BOOLEAN NOT NULL DEFAULT true,
    notify_80 BOOLEAN NOT NULL DEFAULT true,
    notify_100 BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, category_id, month)
);

-- 6. Savings Goals
CREATE TABLE IF NOT EXISTS public.savings_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount DECIMAL(18, 4) NOT NULL,
    current_amount DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
    currency VARCHAR(10) NOT NULL,
    target_date DATE NOT NULL,
    linked_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    color VARCHAR(20) NOT NULL DEFAULT '#16A36A',
    icon VARCHAR(50) NOT NULL DEFAULT 'Target',
    notes TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Monthly Accounting Closings
CREATE TABLE IF NOT EXISTS public.monthly_closings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- YYYY-MM
    opening_balance DECIMAL(18, 4) NOT NULL,
    total_income DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
    total_expenses DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
    net_savings DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
    closing_balance DECIMAL(18, 4) NOT NULL,
    is_closed BOOLEAN NOT NULL DEFAULT true,
    closed_at TIMESTAMPTZ DEFAULT NOW(),
    carried_forward BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    UNIQUE(user_id, month)
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_closings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile"
    ON public.profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage their own preferences"
    ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own accounts"
    ON public.accounts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access system & custom categories"
    ON public.categories FOR ALL USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own transactions"
    ON public.transactions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own budgets"
    ON public.budgets FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own savings goals"
    ON public.savings_goals FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own monthly closings"
    ON public.monthly_closings FOR ALL USING (auth.uid() = user_id);
