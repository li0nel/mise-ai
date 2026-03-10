/** Unicode fraction map */
export const FRACTION_MAP: Record<string, number> = {
  "\u00BC": 0.25,
  "\u00BD": 0.5,
  "\u00BE": 0.75,
  "\u2153": 1 / 3,
  "\u2154": 2 / 3,
  "\u215B": 0.125,
  "\u215C": 0.375,
  "\u215D": 0.625,
  "\u215E": 0.875,
};

/** Parse a string amount into a number (handles fractions like "1 1/2", "½", etc.) */
export function parseAmount(amount: string): number | null {
  const trimmed = amount.trim();
  if (!trimmed) return null;

  // Check for unicode fractions
  for (const [char, value] of Object.entries(FRACTION_MAP)) {
    if (trimmed.includes(char)) {
      const prefix = trimmed.replace(char, "").trim();
      const whole = prefix ? parseFloat(prefix) : 0;
      if (!isNaN(whole)) return whole + value;
    }
  }

  // Handle "1 1/2" style mixed fractions
  const fractionMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (fractionMatch?.[1] && fractionMatch[2] && fractionMatch[3]) {
    return (
      parseInt(fractionMatch[1], 10) +
      parseInt(fractionMatch[2], 10) / parseInt(fractionMatch[3], 10)
    );
  }

  // Handle "1/2" style simple fractions
  const simpleFraction = trimmed.match(/^(\d+)\/(\d+)$/);
  if (simpleFraction?.[1] && simpleFraction[2]) {
    return parseInt(simpleFraction[1], 10) / parseInt(simpleFraction[2], 10);
  }

  const num = parseFloat(trimmed);
  return isNaN(num) ? null : num;
}

/** Format a number back to a human-readable amount */
export function formatAmount(value: number): string {
  // Round to 2 decimal places
  const rounded = Math.round(value * 100) / 100;

  // Check if it's a whole number
  if (rounded === Math.floor(rounded)) {
    return String(rounded);
  }

  // Common fractions
  const frac = rounded - Math.floor(rounded);
  const whole = Math.floor(rounded);
  const threshold = 0.04;

  const fractions: [number, string][] = [
    [0.25, "\u00BC"],
    [0.5, "\u00BD"],
    [0.75, "\u00BE"],
    [1 / 3, "\u2153"],
    [2 / 3, "\u2154"],
  ];

  for (const [fracValue, fracChar] of fractions) {
    if (Math.abs(frac - fracValue) < threshold) {
      return whole > 0 ? `${String(whole)} ${fracChar}` : fracChar;
    }
  }

  return String(rounded);
}

/** Scale an amount string proportionally */
export function scaleAmount(
  amount: string,
  originalServings: number,
  newServings: number,
): string {
  if (originalServings === newServings) return amount;

  const parsed = parseAmount(amount);
  if (parsed === null) return amount;

  const scaled = (parsed * newServings) / originalServings;
  return formatAmount(scaled);
}
