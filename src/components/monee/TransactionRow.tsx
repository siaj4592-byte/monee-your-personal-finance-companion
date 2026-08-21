import { ArrowLeftRight } from "lucide-react";

import { formatAmount } from "@/lib/monee/format";
import { useMonee } from "@/lib/monee/store";
import type { Transaction } from "@/lib/monee/types";
import { categoryIcon, colorVar } from "./icons";

export function TransactionRow({
  tx,
  onClick,
}: {
  tx: Transaction;
  onClick?: () => void;
}) {
  const { data, t } = useMonee();
  const account = data.accounts.find((a) => a.id === tx.accountId);
  const toAccount = data.accounts.find((a) => a.id === tx.toAccountId);
  const category = data.categories.find((c) => c.id === tx.categoryId);
  const Icon = tx.type === "transfer" ? ArrowLeftRight : categoryIcon(category?.icon);

  const sign = tx.type === "income" ? "+" : tx.type === "expense" ? "-" : "";
  const amountClass =
    tx.type === "income"
      ? "text-income"
      : tx.type === "expense"
        ? "text-expense"
        : "text-foreground";

  const title =
    tx.type === "transfer"
      ? `${account?.name ?? "?"} → ${toAccount?.name ?? "?"}`
      : (category?.name ?? t("other"));

  return (
    <button
      type="button"
      onClick={onClick}
      className="press grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-2.5 text-left"
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl"
        style={{
          backgroundColor: `color-mix(in oklab, ${colorVar(category?.color)} 18%, transparent)`,
          color: colorVar(category?.color),
        }}
      >
        <Icon className="h-5 w-5" strokeWidth={1.9} />
      </span>

      <span className="min-w-0">
        <span className="block truncate text-[15px] font-semibold">{title}</span>
        {tx.note ? (
          <span className="block truncate text-[13px] text-muted-foreground">
            {tx.note}
          </span>
        ) : null}
      </span>

      <span className="shrink-0 text-right">
        <span className={`block text-[15px] font-bold tabular-nums ${amountClass}`}>
          {sign}
          {formatAmount(tx.amount, account?.currency ?? "VND")}
        </span>
        <span className="block text-[12px] text-muted-foreground">{account?.name}</span>
      </span>
    </button>
  );
}
