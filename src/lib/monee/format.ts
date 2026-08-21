import type { CurrencyCode, LanguageCode } from "./types";

export const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  VND: "₫",
  KRW: "₩",
};

export function formatAmount(value: number, currency: CurrencyCode = "VND"): string {
  const rounded = Math.round(value);
  const grouped = new Intl.NumberFormat(currency === "KRW" ? "ko-KR" : "vi-VN").format(
    Math.abs(rounded),
  );
  const sign = rounded < 0 ? "-" : "";
  return `${sign}${grouped} ${CURRENCY_SYMBOL[currency]}`;
}

export function formatSigned(value: number, currency: CurrencyCode = "VND"): string {
  if (value > 0) return `+${formatAmount(value, currency)}`;
  return formatAmount(value, currency);
}

export function formatCompact(value: number, currency: CurrencyCode = "VND"): string {
  const abs = Math.abs(value);
  const symbol = CURRENCY_SYMBOL[currency];
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B ${symbol}`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M ${symbol}`;
  if (abs >= 1_000) return `${Math.round(value / 1_000)}K ${symbol}`;
  return formatAmount(value, currency);
}

const VI_WEEKDAYS = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];
const KO_WEEKDAYS = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

const pad = (n: number) => String(n).padStart(2, "0");

export function toDateKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toMonthKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function formatLongDate(date: Date | string, lang: LanguageCode = "vi"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  if (lang === "ko") {
    return `${d.getFullYear()}. ${pad(d.getMonth() + 1)}. ${pad(d.getDate())} ${KO_WEEKDAYS[d.getDay()]}`;
  }
  return `${VI_WEEKDAYS[d.getDay()]}, ${day}`;
}

export function formatMonthLabel(
  year: number,
  month: number,
  lang: LanguageCode = "vi",
): string {
  return lang === "ko" ? `${year}년 ${month}월` : `Tháng ${month}/${year}`;
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function toLocalInputValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
