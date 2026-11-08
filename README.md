# Monevia — Global Personal Finance & Expense Management Platform

> **Brand Tagline:** Your Money. Your Control.  
> **Bengali:** আপনার অর্থ। আপনার নিয়ন্ত্রণ।

Monevia is a world-class, multi-currency international personal finance and wealth management platform built with modern fintech architecture. Designed for individuals and households across the globe, it eliminates the single-currency and single-region limitations typical of traditional personal finance apps.

---

## 🌟 Key Architectural Pillars

### 1. Brand Identity & Design System
- **Centralized Brand Config:** Located in `src/branding/brandConfig.ts` for global consistency.
- **Brand Colors:**
  - **Navy:** `#142D4E` (Primary dark brand accent, sidebar, headers)
  - **Royal Blue:** `#3563E9` (Primary action buttons, active indicators)
  - **Emerald Green:** `#16A36A` (Income indicators, growth, surplus)
  - **Teal:** `#0F9D8A` (Secondary accent, multi-currency highlights)
  - **White:** `#FFFFFF` (Card surfaces, clean separation)
  - **Background:** `#F5F7FB` (Soft fintech grey canvas)
- **Scalable Geometric SVG Logo:** Minimalist geometric letter **M** integrated with an embedded emerald coin/vault accent. Includes light, dark, and navy themes, app icon (`app-icon.svg`), and favicon (`favicon.svg`).
- **Typography:** Inter for clean numbers and latin typography, and Noto Sans Bengali for authentic natural Bengali phrasing.

### 2. First-Time Onboarding Sequence
1. **Step 1: Language Selection** — English or বাংলা (Bangla). The entire UI adapts instantaneously upon selection.
2. **Step 2: Currency Selection** — Comprehensive ISO 4217 world currency directory with real-time formatting previews (e.g. `৳1,500.00`, `$1,500.00`, `₹1,500.00`, `€1,500.00`).
3. **Step 3: Country Selection (Optional)** — Worldwide ISO 3166 database. Suggests regional defaults for timezone, date format, and number locale, but **never forces or overwrites** your chosen currency.
4. **Step 4: Starting Balance** — Initial account name, type (Bank, Cash, Digital Wallet, Mobile Money, etc.), and opening balance.
5. **Step 5: Profile** — Full name, avatar selector, optional email.
6. **Step 6: Finish / Welcome** — Transition directly to the dashboard with permanent local-first persistence.

### 3. Independent Localization System
Language, country, currency, timezone, and number formatting are treated as separate, orthogonal settings. All combinations work independently:
- Bangladesh + বাংলা + BDT
- Bangladesh + English + USD
- United States + English + USD
- United States + English + BDT
- India + English + INR
- United Kingdom + English + GBP

All formatting relies on native `Intl.NumberFormat` and `Intl.DateTimeFormat`. Currency symbols are never hardcoded in UI strings.

### 4. Multi-Currency Financial Engine
- **Base Reporting Currency:** Converts all foreign transactions to the user's base currency for accurate net worth reporting.
- **Auditable Rate Snapshots:** Saves the applied exchange rate snapshot with each transaction; historical transactions are never silently mutated by future rate fluctuations.
- **Dual Display:** Displays both original transaction amount/currency and base currency equivalent side-by-side.
- **Flexible Rate Sources:** Baseline interbank conversion table for 150+ currencies, support for user manual overrides, and pending-state indicators when rates are missing.

### 5. Automated Double-Entry & Monthly Accounting
$$\text{Closing Balance} = \text{Opening Balance} + \text{Total Income} - \text{Total Expenses}$$
- **Neutral Transfers:** Internal account transfers (e.g. Bank to bKash) adjust individual account balances without inflating income or expense totals.
- **Month-End Reconciliation:** Generates official summaries, locks month snapshots, and automatically carries forward the closing balance as the opening balance of the subsequent month.

---

## 📁 Project Directory Structure

```
monevia/
├── public/
│   └── brand/
│       ├── favicon.svg
│       ├── app-icon.svg
│       ├── logo-horizontal-light.svg
│       └── logo-horizontal-dark.svg
├── src/
│   ├── branding/
│   │   ├── brandConfig.ts        # Centralized brand constants
│   │   └── Logo.tsx              # Dynamic geometric M + wallet SVG component
│   ├── types/
│   │   └── index.ts              # Financial data contracts & TypeScript models
│   ├── constants/
│   │   ├── currencies.ts         # ISO 4217 world currencies dataset
│   │   ├── countries.ts          # ISO 3166 world countries dataset
│   │   ├── categories.ts         # Default income & hierarchical expense categories
│   │   └── exchangeRates.ts      # Multi-currency baseline rate matrix
│   ├── i18n/
│   │   ├── index.ts              # Translation engine & lookup utilities
│   │   └── locales/
│   │       ├── en.ts             # English locale dictionary
│   │       └── bn.ts             # Bengali locale dictionary
│   ├── utils/
│   │   ├── formatting.ts         # Intl.NumberFormat & DateTimeFormat helpers
│   │   ├── currencyConverter.ts  # Exchange engine & conversion snapshots
│   │   ├── accounting.ts         # Monthly closing & carry-forward math
│   │   └── export.ts             # CSV & JSON backup/restore utilities
│   ├── db/
│   │   ├── indexedDb.ts          # Local-first IndexedDB storage repository
│   │   └── supabaseClient.ts     # Supabase client synchronization layer
│   ├── context/
│   │   └── FinanceContext.tsx    # Reactive state management provider
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx       # Navy desktop sidebar navigation
│   │   │   ├── Navbar.tsx        # Top navbar with quick action & pills
│   │   │   └── BottomNav.tsx     # Mobile bottom navigation + floating quick-add
│   │   └── modals/
│   │       ├── TransactionModal.tsx   # Add/Edit Income, Expense, Transfer
│   │       ├── BudgetModal.tsx        # Category budget modal
│   │       ├── SavingsGoalModal.tsx   # Savings goal creation & allocation
│   │       ├── AccountModal.tsx       # Financial accounts management
│   │       └── MonthlyClosingModal.tsx # Month-end reconciliation modal
│   ├── pages/
│   │   ├── onboarding/
│   │   │   └── OnboardingFlow.tsx    # 6-step wizard
│   │   ├── DashboardPage.tsx         # Executive dashboard & Recharts
│   │   ├── IncomePage.tsx            # Income tracker & category filtering
│   │   ├── ExpensesPage.tsx          # Hierarchical expense categories
│   │   ├── TransactionsPage.tsx      # Universal multi-currency ledger
│   │   ├── BudgetPage.tsx            # Category budgets & progress bars
│   │   ├── SavingsPage.tsx           # Savings targets & deposit/withdraw
│   │   ├── ReportsPage.tsx           # Analytics, breakdown & PDF printing
│   │   ├── CalendarPage.tsx          # Interactive cashflow calendar
│   │   ├── AccountsPage.tsx          # Account portfolio & transfers
│   │   └── SettingsPage.tsx          # Independent localization & backup
│   ├── App.tsx                       # App router & modal controller
│   ├── main.tsx                      # Vite React root
│   └── index.css                     # Tailwind CSS & design tokens
├── supabase/
│   └── schema.sql                    # Production PostgreSQL migration & RLS
├── .env.example                      # Environment variables template
├── package.json                      # Dependencies & build scripts
├── tailwind.config.js                # Custom brand colors & fonts
├── tsconfig.json                     # Strict TypeScript compiler options
└── vite.config.ts                    # Vite configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ or v22+ recommended)
- npm or pnpm

### 2. Installation
```bash
# Clone or navigate into monevia
cd monevia

# Install dependencies
npm install
```

### 3. Running Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser. Monevia will launch with the 6-step onboarding wizard.

### 4. Building for Production
```bash
npm run build
```
Creates an optimized production bundle in `dist/`.

---

## ☁️ Cloud & Database Integration (Supabase)

Monevia runs **100% locally** using IndexedDB out-of-the-box, guaranteeing full privacy and offline reliability.

To enable multi-device cloud synchronization via Supabase:
1. Create a project on [Supabase](https://supabase.com).
2. Execute the migration script provided in `supabase/schema.sql` in the Supabase SQL Editor.
3. Create a `.env` file from `.env.example`:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Restart the development server.
