/**
 * Parse a CSS linear-gradient string and return the middle hex color
 * for use as a solid background approximation in React Native.
 *
 * Handles formats like "linear-gradient(160deg, #F5D76E 0%, #E89228 40%, #C8481C 100%)".
 */
export function parseGradientMiddleColor(gradient: string): string {
  const hexMatches = gradient.match(/#[0-9A-Fa-f]{6}/g);
  if (!hexMatches || hexMatches.length === 0) return "#888888";
  const midIndex = Math.floor(hexMatches.length / 2);
  return hexMatches[midIndex] ?? "#888888";
}
