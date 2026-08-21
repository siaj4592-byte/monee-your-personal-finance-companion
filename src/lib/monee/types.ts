export type CurrencyCode = "VND" | "KRW";
export type LanguageCode = "vi" | "ko";

export type AccountKind = "cash" | "bank" | "ewallet" | "credit" | "savings" | "other";

export interface Account {
  id: string;
  name: string;
  kind: AccountKind;
  currency: CurrencyCode;
  initialBalance: number;
  /** Liability accounts (credit cards, loans) count as debt in net worth. */
  isDebt: boolean;
  archived?: boolean;
  createdAt: string;
}

export type CategoryKind = "expense" | "income";

export interface Category {
  id: string;
  name: string;
  kind: CategoryKind;
  icon: string;
  color: string;
  createdAt: string;
}

export type TransactionType = "expense" | "income" | "transfer";

export interface Transaction {
  id: string;
  type: TransactionType;
  /** Positive number, expressed in the currency of `accountId`. */
  amount: number;
  accountId: string;
  toAccountId?: string;
  categoryId?: string;
  /** ISO string with local date + time. */
  date: string;
  note?: string;
  includeInStats: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RecurringFrequency = "daily" | "weekly" | "monthly";

export interface RecurringRule {
  id: string;
  title: string;
  type: TransactionType;
  amount: number;
  accountId: string;
  toAccountId?: string;
  categoryId?: string;
  frequency: RecurringFrequency;
  /** ISO date of the next occurrence to generate. */
  nextRun: string;
  active: boolean;
  createdAt: string;
}

export interface Budget {
  /** "YYYY-MM" or "default" for the recurring monthly budget. */
  id: string;
  amount: number;
}

export interface Settings {
  language: LanguageCode;
  currency: CurrencyCode;
  /** Approximate KRW -> VND conversion used for aggregated totals. */
  krwToVndRate: number;
}

export interface MoneeData {
  version: number;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  recurring: RecurringRule[];
  budgets: Budget[];
  settings: Settings;
}
