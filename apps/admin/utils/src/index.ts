export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function buildTournamentCode(prefix = "FFX") {
  const entropy = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${entropy}`;
}

export function formatMoney(value: number | string, currency = "INR") {
  const numeric = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(numeric);
}

export function scoreBattleRoyale(kills: number, placement: number) {
  const placementPoints: Record<number, number> = {
    1: 15,
    2: 12,
    3: 10,
    4: 8,
    5: 6
  };
  return kills * 2 + (placementPoints[placement] ?? Math.max(0, 6 - placement));
}

export function calculatePrizeDistribution(prizePool: number, winners: number) {
  if (winners <= 1) return [{ rank: 1, amount: prizePool }];
  const weights = Array.from({ length: winners }, (_, index) => winners - index);
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  return weights.map((weight, index) => ({
    rank: index + 1,
    amount: Math.round((prizePool * weight) / totalWeight)
  }));
}

export function fingerprintRiskScore(input: {
  emulatorDetected?: boolean;
  duplicateUid?: boolean;
  multiAccountDeviceCount?: number;
  failedPayments?: number;
}) {
  let score = 0;
  if (input.emulatorDetected) score += 35;
  if (input.duplicateUid) score += 45;
  if ((input.multiAccountDeviceCount ?? 0) > 2) score += 30;
  if ((input.failedPayments ?? 0) >= 3) score += 20;
  return Math.min(score, 100);
}

export function roomReleaseAt(matchStart: Date, minutesBefore = 10) {
  return new Date(matchStart.getTime() - minutesBefore * 60 * 1000);
}
