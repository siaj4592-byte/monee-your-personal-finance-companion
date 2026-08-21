import type { Account, MoneeData, Transaction } from "./types";
import { toDateKey, toMonthKey } from "./format";

export function accountBalance(data: MoneeData, accountId: string): number {
  const account = data.accounts.find((a) => a.id === accountId);
  if (!account) return 0;
  let balance = account.initialBalance;
  for (const tx of data.transactions) {
    if (tx.type === "income" && tx.accountId === accountId) balance += tx.amount;
    if (tx.type === "expense" && tx.accountId === accountId) balance -= tx.amount;
    if (tx.type === "transfer") {
      if (tx.accountId === accountId) balance -= tx.amount;
      if (tx.toAccountId === accountId) balance += tx.amount;
    }
  }
  return balance;
}

export function toBase(data: MoneeData, amount: number, account?: Account): number {
  if (!account) return amount;
  if (account.currency === data.settings.currency) return amount;
  const inVnd = account.currency === "KRW" ? amount * data.settings.krwToVndRate : amount;
  if (data.settings.currency === "KRW") return inVnd / data.settings.krwToVndRate;
  return inVnd;
}

export function netWorth(data: MoneeData) {
  let assets = 0;
  let debt = 0;
  for (const account of data.accounts) {
    if (account.archived) continue;
    const balance = toBase(data, accountBalance(data, account.id), account);
    if (account.isDebt) debt += Math.abs(balance);
    else assets += balance;
  }
  return { assets, debt, net: assets - debt };
}

export function inPeriod(tx: Transaction, period: { year: number; month?: number }) {
  const d = new Date(tx.date);
  if (d.getFullYear() !== period.year) return false;
  if (period.month != null && d.getMonth() + 1 !== period.month) return false;
  return true;
}

export function periodTotals(data: MoneeData, period: { year: number; month?: number }) {
  let income = 0;
  let expense = 0;
  for (const tx of data.transactions) {
    if (!tx.includeInStats || tx.type === "transfer") continue;
    if (!inPeriod(tx, period)) continue;
    const account = data.accounts.find((a) => a.id === tx.accountId);
    const value = toBase(data, tx.amount, account);
    if (tx.type === "income") income += value;
    else expense += value;
  }
  return { income, expense, balance: income - expense };
}

export function groupByDate(transactions: Transaction[]) {
  const map = new Map<string, Transaction[]>();
  for (const tx of [...transactions].sort((a, b) => b.date.localeCompare(a.date))) {
    const key = toDateKey(tx.date);
    const list = map.get(key);
    if (list) list.push(tx);
    else map.set(key, [tx]);
  }
  return [...map.entries()];
}

export function dailyExpense(data: MoneeData, period: { year: number; month?: number }) {
  const map = new Map<string, number>();
  for (const tx of data.transactions) {
    if (tx.type !== "expense" || !tx.includeInStats) continue;
    if (!inPeriod(tx, period)) continue;
    const account = data.accounts.find((a) => a.id === tx.accountId);
    const key = toDateKey(tx.date);
    map.set(key, (map.get(key) ?? 0) + toBase(data, tx.amount, account));
  }
  return map;
}

export function byCategory(
  data: MoneeData,
  period: { year: number; month?: number },
  kind: "expense" | "income",
) {
  const map = new Map<string, number>();
  for (const tx of data.transactions) {
    if (tx.type !== kind || !tx.includeInStats) continue;
    if (!inPeriod(tx, period)) continue;
    const account = data.accounts.find((a) => a.id === tx.accountId);
    const key = tx.categoryId ?? "none";
    map.set(key, (map.get(key) ?? 0) + toBase(data, tx.amount, account));
  }
  return [...map.entries()]
    .map(([categoryId, value]) => ({
      categoryId,
      value,
      category: data.categories.find((c) => c.id === categoryId),
    }))
    .sort((a, b) => b.value - a.value);
}

export function budgetFor(data: MoneeData, year: number, month: number): number {
  const key = toMonthKey(new Date(year, month - 1, 1));
  return (
    data.budgets.find((b) => b.id === key)?.amount ??
    data.budgets.find((b) => b.id === "default")?.amount ??
    0
  );
}
