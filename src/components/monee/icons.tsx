import {
  Banknote,
  Book,
  Bus,
  CreditCard,
  Ellipsis,
  Gamepad2,
  Gift,
  Heart,
  Home,
  PiggyBank,
  Plane,
  Receipt,
  ShoppingBag,
  Smartphone,
  TrendingUp,
  Utensils,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  bus: Bus,
  home: Home,
  receipt: Receipt,
  "shopping-bag": ShoppingBag,
  gamepad: Gamepad2,
  heart: Heart,
  book: Book,
  ellipsis: Ellipsis,
  wallet: Wallet,
  gift: Gift,
  "trending-up": TrendingUp,
  plane: Plane,
  phone: Smartphone,
  piggy: PiggyBank,
  card: CreditCard,
  cash: Banknote,
};

export const ICON_KEYS = Object.keys(CATEGORY_ICONS);

export const COLOR_KEYS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];

export function categoryIcon(name?: string): LucideIcon {
  return CATEGORY_ICONS[name ?? "ellipsis"] ?? Ellipsis;
}

export function colorVar(color?: string): string {
  return `var(--${color && COLOR_KEYS.includes(color) ? color : "chart-1"})`;
}
