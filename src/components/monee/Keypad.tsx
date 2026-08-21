import { Delete } from "lucide-react";

import { applyKey, type KeypadKey } from "@/lib/monee/calculator";

const LAYOUT: Array<Array<{ key: KeypadKey; label?: string; variant?: "op" | "done" }>> = [
  [
    { key: "1" },
    { key: "2" },
    { key: "3" },
    { key: "/", label: "÷", variant: "op" },
  ],
  [
    { key: "4" },
    { key: "5" },
    { key: "6" },
    { key: "*", label: "×", variant: "op" },
  ],
  [
    { key: "7" },
    { key: "8" },
    { key: "9" },
    { key: "-", label: "−", variant: "op" },
  ],
  [
    { key: "AC", label: "AC", variant: "op" },
    { key: "0" },
    { key: "00" },
    { key: "+", label: "+", variant: "op" },
  ],
];

export function Keypad({
  expression,
  onChange,
  onDone,
  doneLabel,
}: {
  expression: string;
  onChange: (next: string) => void;
  onDone: () => void;
  doneLabel: string;
}) {
  const press = (key: KeypadKey) => {
    if (navigator.vibrate) navigator.vibrate(6);
    onChange(applyKey(expression, key));
  };

  return (
    <div className="safe-bottom bg-surface px-3 pt-3 pb-3">
      <div className="grid grid-cols-4 gap-2">
        {LAYOUT.flatMap((row) =>
          row.map((cell) => (
            <button
              key={cell.key}
              type="button"
              onClick={() => press(cell.key)}
              className={`press h-13 rounded-2xl text-xl font-semibold shadow-[var(--shadow-card)] ${
                cell.variant === "op"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-card text-card-foreground"
              }`}
            >
              {cell.label ?? cell.key}
            </button>
          )),
        )}

        <button
          type="button"
          onClick={() => press("back")}
          aria-label="backspace"
          className="press col-span-2 grid h-13 place-items-center rounded-2xl bg-card shadow-[var(--shadow-card)]"
        >
          <Delete className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={onDone}
          className="press col-span-2 h-13 rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-[var(--shadow-float)]"
        >
          {doneLabel}
        </button>
      </div>
    </div>
  );
}
