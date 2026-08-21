import { ChevronLeft, ChevronRight } from "lucide-react";

import { formatMonthLabel } from "@/lib/monee/format";
import { useMonee } from "@/lib/monee/store";

export function MonthSelector({
  year,
  month,
  onChange,
  yearOnly = false,
}: {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
  yearOnly?: boolean;
}) {
  const { data } = useMonee();
  const lang = data.settings.language;

  const shift = (delta: number) => {
    if (yearOnly) {
      onChange(year + delta, month);
      return;
    }
    const d = new Date(year, month - 1 + delta, 1);
    onChange(d.getFullYear(), d.getMonth() + 1);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="previous"
        onClick={() => shift(-1)}
        className="press grid h-8 w-8 place-items-center rounded-full bg-secondary text-secondary-foreground"
      >
        <ChevronLeft className="h-4.5 w-4.5" />
      </button>
      <span className="min-w-36 text-center text-lg font-bold tracking-tight">
        {yearOnly
          ? lang === "ko"
            ? `${year}년`
            : `Năm ${year}`
          : formatMonthLabel(year, month, lang)}
      </span>
      <button
        type="button"
        aria-label="next"
        onClick={() => shift(1)}
        className="press grid h-8 w-8 place-items-center rounded-full bg-secondary text-secondary-foreground"
      >
        <ChevronRight className="h-4.5 w-4.5" />
      </button>
    </div>
  );
}
