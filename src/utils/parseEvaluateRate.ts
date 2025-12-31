export function parseEvaluateRate(
  rate?: string | number | null
): number | undefined {
  if (rate == null) return undefined;

  if (typeof rate === "number") return +rate;

  const s = String(rate).trim();

  const pctMatch = s.match(/([\d.]+)\s*%/);
  if (pctMatch) {
    const pct = parseFloat(pctMatch[1]);
    if (Number.isNaN(pct)) return undefined;
    return +((pct / 100) * 5).toFixed(1);
  }

  const num = parseFloat(s);
  return Number.isNaN(num) ? undefined : num;
}
