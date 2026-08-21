import type { MoneeData } from "./types";
import { createSeedData, DATA_VERSION } from "./seed";

/**
 * Persistence boundary.
 *
 * The whole app talks to this interface only, so a cloud backend
 * (Lovable Cloud / Postgres + auth + sync) can be dropped in later by
 * providing another implementation without touching UI code.
 */
export interface MoneeRepository {
  load(): Promise<MoneeData | null>;
  save(data: MoneeData): Promise<void>;
  clear(): Promise<void>;
}

const STORAGE_KEY = "monee.data.v1";

export class LocalStorageRepository implements MoneeRepository {
  async load(): Promise<MoneeData | null> {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as MoneeData;
      return migrate(parsed);
    } catch {
      return null;
    }
  }

  async save(data: MoneeData): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* quota / private mode — ignore */
    }
  }

  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

function migrate(data: MoneeData): MoneeData {
  const seed = createSeedData();
  return {
    ...seed,
    ...data,
    version: DATA_VERSION,
    settings: { ...seed.settings, ...(data.settings ?? {}) },
    accounts: data.accounts ?? seed.accounts,
    categories: data.categories ?? seed.categories,
    transactions: data.transactions ?? [],
    recurring: data.recurring ?? [],
    budgets: data.budgets ?? seed.budgets,
  };
}

export const repository: MoneeRepository = new LocalStorageRepository();
