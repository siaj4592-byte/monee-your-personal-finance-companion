import type { Account, Category, MoneeData, Transaction } from "./types";

export const DATA_VERSION = 1;

const now = () => new Date().toISOString();

export function makeId(prefix = "id"): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}${rand}`;
}

export const DEFAULT_CATEGORY_PRESETS: Array<
  Pick<Category, "name" | "kind" | "icon" | "color">
> = [
  { name: "Ăn uống", kind: "expense", icon: "utensils", color: "chart-1" },
  { name: "Đi lại", kind: "expense", icon: "bus", color: "chart-2" },
  { name: "Sinh hoạt", kind: "expense", icon: "home", color: "chart-3" },
  { name: "Hóa đơn", kind: "expense", icon: "receipt", color: "chart-4" },
  { name: "Mua sắm", kind: "expense", icon: "shopping-bag", color: "chart-5" },
  { name: "Giải trí", kind: "expense", icon: "gamepad", color: "chart-2" },
  { name: "Sức khỏe", kind: "expense", icon: "heart", color: "chart-4" },
  { name: "Giáo dục", kind: "expense", icon: "book", color: "chart-3" },
  { name: "Khác", kind: "expense", icon: "ellipsis", color: "chart-5" },
  { name: "Lương", kind: "income", icon: "wallet", color: "chart-1" },
  { name: "Thưởng", kind: "income", icon: "gift", color: "chart-2" },
  { name: "Đầu tư", kind: "income", icon: "trending-up", color: "chart-3" },
  { name: "Khác", kind: "income", icon: "ellipsis", color: "chart-5" },
];

export function createSeedData(): MoneeData {
  const stamp = now();

  const categories: Category[] = DEFAULT_CATEGORY_PRESETS.map((preset, index) => ({
    id: `cat_${index}`,
    createdAt: stamp,
    ...preset,
  }));

  const accounts: Account[] = [
    {
      id: "acc_cash",
      name: "Tiền mặt",
      kind: "cash",
      currency: "VND",
      initialBalance: 3_000_000,
      isDebt: false,
      createdAt: stamp,
    },
    {
      id: "acc_vcb",
      name: "Vietcombank",
      kind: "bank",
      currency: "VND",
      initialBalance: 12_000_000,
      isDebt: false,
      createdAt: stamp,
    },
    {
      id: "acc_momo",
      name: "Ví điện tử",
      kind: "ewallet",
      currency: "VND",
      initialBalance: 500_000,
      isDebt: false,
      createdAt: stamp,
    },
  ];

  const salary = categories.find((c) => c.kind === "income" && c.name === "Lương")!;
  const food = categories.find((c) => c.kind === "expense" && c.name === "Ăn uống")!;

  const transactions: Transaction[] = [
    {
      id: "tx_1",
      type: "income",
      amount: 33_000_000,
      accountId: "acc_vcb",
      categoryId: salary.id,
      date: new Date(2026, 7, 18, 9, 30).toISOString(),
      note: "Lương chồng",
      includeInStats: true,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: "tx_2",
      type: "income",
      amount: 25_035_000,
      accountId: "acc_vcb",
      categoryId: salary.id,
      date: new Date(2026, 7, 2, 10, 0).toISOString(),
      note: "Lương chồng",
      includeInStats: true,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: "tx_3",
      type: "expense",
      amount: 1_035_000,
      accountId: "acc_cash",
      categoryId: food.id,
      date: new Date(2026, 7, 1, 19, 15).toISOString(),
      note: "Ốc / 우렁집",
      includeInStats: true,
      createdAt: stamp,
      updatedAt: stamp,
    },
  ];

  return {
    version: DATA_VERSION,
    accounts,
    categories,
    transactions,
    recurring: [],
    budgets: [{ id: "default", amount: 50_000_000 }],
    settings: { language: "vi", currency: "VND", krwToVndRate: 19 },
  };
}
