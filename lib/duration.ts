/** Parse duration strings like "5 min", "2 minutes", "1 hr", "1.5 hrs" to seconds */
export function parseDurationToSeconds(duration: string): number {
  const normalized = duration.toLowerCase().trim();
  let total = 0;

  // Match hours
  const hrMatch = normalized.match(/([\d.]+)\s*(?:hrs?|hours?)/);
  if (hrMatch?.[1]) {
    total += parseFloat(hrMatch[1]) * 3600;
  }

  // Match minutes
  const minMatch = normalized.match(/([\d.]+)\s*(?:mins?|minutes?)/);
  if (minMatch?.[1]) {
    total += parseFloat(minMatch[1]) * 60;
  }

  // If nothing matched, try bare number as minutes
  if (total === 0) {
    const bareMatch = normalized.match(/^([\d.]+)$/);
    if (bareMatch?.[1]) {
      total = parseFloat(bareMatch[1]) * 60;
    }
  }

  return Math.round(total);
}

export function formatRemaining(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")} remaining`;
}
