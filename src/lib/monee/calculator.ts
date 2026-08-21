export type KeypadKey =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "00"
  | "back"
  | "+"
  | "-"
  | "*"
  | "/"
  | "AC"
  | "done";

export interface CalcState {
  /** Full expression string, e.g. "12000+3500". */
  expression: string;
}

const OPERATORS = ["+", "-", "*", "/"];

export function applyKey(expression: string, key: KeypadKey): string {
  if (key === "AC") return "";
  if (key === "back") return expression.slice(0, -1);
  if (OPERATORS.includes(key)) {
    if (!expression) return "";
    const last = expression.slice(-1);
    if (OPERATORS.includes(last)) return expression.slice(0, -1) + key;
    return expression + key;
  }
  if (key === "00") {
    if (!expression) return "";
    return expression + "00";
  }
  return expression + key;
}

/** Safe left-to-right evaluator with * / precedence. Returns 0 for invalid input. */
export function evaluate(expression: string): number {
  if (!expression) return 0;
  const cleaned = expression.replace(/[^0-9+\-*/.]/g, "").replace(/[+\-*/]+$/, "");
  if (!cleaned) return 0;

  const tokens = cleaned.match(/(\d+\.?\d*|[+\-*/])/g);
  if (!tokens) return 0;

  const stack: number[] = [];
  let pendingOp: string | null = null;

  for (const token of tokens) {
    if (OPERATORS.includes(token)) {
      pendingOp = token;
      continue;
    }
    let value = Number(token);
    if (!Number.isFinite(value)) return 0;
    if (pendingOp === "*" || pendingOp === "/") {
      const prev = stack.pop() ?? 0;
      value = pendingOp === "*" ? prev * value : value === 0 ? 0 : prev / value;
      stack.push(value);
    } else if (pendingOp === "-") {
      stack.push(-value);
    } else {
      stack.push(value);
    }
    pendingOp = null;
  }

  const total = stack.reduce((sum, n) => sum + n, 0);
  return Number.isFinite(total) ? total : 0;
}

export function hasPendingOperation(expression: string): boolean {
  return OPERATORS.some((op) => expression.slice(1).includes(op));
}
