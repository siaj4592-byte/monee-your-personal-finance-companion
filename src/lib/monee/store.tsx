import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { repository } from "./repository";
import { createSeedData, makeId } from "./seed";
import { translate, type TranslationKey } from "./i18n";
import type {
  Account,
  Category,
  MoneeData,
  RecurringRule,
  Settings,
  Transaction,
} from "./types";

interface MoneeContextValue {
  data: MoneeData;
  ready: boolean;
  t: (key: TranslationKey) => string;
  addTransaction: (
    tx: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ) => Transaction;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (account: Omit<Account, "id" | "createdAt">) => void;
  updateAccount: (id: string, patch: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  addCategory: (category: Omit<Category, "id" | "createdAt">) => void;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addRecurring: (rule: Omit<RecurringRule, "id" | "createdAt">) => void;
  updateRecurring: (id: string, patch: Partial<RecurringRule>) => void;
  deleteRecurring: (id: string) => void;
  setBudget: (id: string, amount: number) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetData: () => void;
}

const MoneeContext = createContext<MoneeContextValue | null>(null);

function advance(dateIso: string, frequency: RecurringRule["frequency"]): string {
  const d = new Date(dateIso);
  if (frequency === "daily") d.setDate(d.getDate() + 1);
  if (frequency === "weekly") d.setDate(d.getDate() + 7);
  if (frequency === "monthly") d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

/** Materialises due recurring rules into real transactions. */
function runRecurring(data: MoneeData): MoneeData {
  const nowMs = Date.now();
  let changed = false;
  const transactions = [...data.transactions];
  const recurring = data.recurring.map((rule) => {
    if (!rule.active) return rule;
    let next = rule.nextRun;
    let guard = 0;
    while (new Date(next).getTime() <= nowMs && guard < 120) {
      const stamp = new Date().toISOString();
      transactions.push({
        id: makeId("tx"),
        type: rule.type,
        amount: rule.amount,
        accountId: rule.accountId,
        toAccountId: rule.toAccountId,
        categoryId: rule.categoryId,
        date: next,
        note: rule.title,
        includeInStats: true,
        createdAt: stamp,
        updatedAt: stamp,
      });
      next = advance(next, rule.frequency);
      changed = true;
      guard += 1;
    }
    return next === rule.nextRun ? rule : { ...rule, nextRun: next };
  });
  return changed ? { ...data, transactions, recurring } : data;
}

export function MoneeProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<MoneeData>(() => createSeedData());
  const [ready, setReady] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    let cancelled = false;
    repository.load().then((loaded) => {
      if (cancelled) return;
      setData(runRecurring(loaded ?? createSeedData()));
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !dirty.current) return;
    void repository.save(data);
  }, [data, ready]);

  const mutate = useCallback((updater: (prev: MoneeData) => MoneeData) => {
    dirty.current = true;
    setData((prev) => updater(prev));
  }, []);

  const value = useMemo<MoneeContextValue>(() => {
    const stamp = () => new Date().toISOString();

    return {
      data,
      ready,
      t: (key) => translate(data.settings.language, key),
      addTransaction: (tx) => {
        const created: Transaction = {
          ...tx,
          id: makeId("tx"),
          createdAt: stamp(),
          updatedAt: stamp(),
        };
        mutate((prev) => ({ ...prev, transactions: [...prev.transactions, created] }));
        return created;
      },
      updateTransaction: (id, patch) =>
        mutate((prev) => ({
          ...prev,
          transactions: prev.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...patch, updatedAt: stamp() } : tx,
          ),
        })),
      deleteTransaction: (id) =>
        mutate((prev) => ({
          ...prev,
          transactions: prev.transactions.filter((tx) => tx.id !== id),
        })),
      addAccount: (account) =>
        mutate((prev) => ({
          ...prev,
          accounts: [
            ...prev.accounts,
            { ...account, id: makeId("acc"), createdAt: stamp() },
          ],
        })),
      updateAccount: (id, patch) =>
        mutate((prev) => ({
          ...prev,
          accounts: prev.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      deleteAccount: (id) =>
        mutate((prev) => ({
          ...prev,
          accounts: prev.accounts.filter((a) => a.id !== id),
          transactions: prev.transactions.filter(
            (tx) => tx.accountId !== id && tx.toAccountId !== id,
          ),
        })),
      addCategory: (category) =>
        mutate((prev) => ({
          ...prev,
          categories: [
            ...prev.categories,
            { ...category, id: makeId("cat"), createdAt: stamp() },
          ],
        })),
      updateCategory: (id, patch) =>
        mutate((prev) => ({
          ...prev,
          categories: prev.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteCategory: (id) =>
        mutate((prev) => ({
          ...prev,
          categories: prev.categories.filter((c) => c.id !== id),
          transactions: prev.transactions.map((tx) =>
            tx.categoryId === id ? { ...tx, categoryId: undefined } : tx,
          ),
        })),
      addRecurring: (rule) =>
        mutate((prev) => ({
          ...prev,
          recurring: [...prev.recurring, { ...rule, id: makeId("rec"), createdAt: stamp() }],
        })),
      updateRecurring: (id, patch) =>
        mutate((prev) => ({
          ...prev,
          recurring: prev.recurring.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),
      deleteRecurring: (id) =>
        mutate((prev) => ({
          ...prev,
          recurring: prev.recurring.filter((r) => r.id !== id),
        })),
      setBudget: (id, amount) =>
        mutate((prev) => ({
          ...prev,
          budgets: prev.budgets.some((b) => b.id === id)
            ? prev.budgets.map((b) => (b.id === id ? { ...b, amount } : b))
            : [...prev.budgets, { id, amount }],
        })),
      updateSettings: (patch) =>
        mutate((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } })),
      resetData: () => mutate(() => createSeedData()),
    };
  }, [data, ready, mutate]);

  return <MoneeContext.Provider value={value}>{children}</MoneeContext.Provider>;
}

export function useMonee(): MoneeContextValue {
  const ctx = useContext(MoneeContext);
  if (!ctx) throw new Error("useMonee must be used inside <MoneeProvider>");
  return ctx;
}
