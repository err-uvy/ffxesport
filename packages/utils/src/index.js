"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
exports.buildTournamentCode = buildTournamentCode;
exports.formatMoney = formatMoney;
exports.scoreBattleRoyale = scoreBattleRoyale;
exports.calculatePrizeDistribution = calculatePrizeDistribution;
exports.fingerprintRiskScore = fingerprintRiskScore;
exports.roomReleaseAt = roomReleaseAt;
function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}
function buildTournamentCode(prefix = "FFX") {
    const entropy = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `${prefix}-${entropy}`;
}
function formatMoney(value, currency = "INR") {
    const numeric = typeof value === "string" ? Number(value) : value;
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
    }).format(numeric);
}
function scoreBattleRoyale(kills, placement) {
    const placementPoints = {
        1: 15,
        2: 12,
        3: 10,
        4: 8,
        5: 6
    };
    return kills * 2 + (placementPoints[placement] ?? Math.max(0, 6 - placement));
}
function calculatePrizeDistribution(prizePool, winners) {
    if (winners <= 1)
        return [{ rank: 1, amount: prizePool }];
    const weights = Array.from({ length: winners }, (_, index) => winners - index);
    const totalWeight = weights.reduce((sum, value) => sum + value, 0);
    return weights.map((weight, index) => ({
        rank: index + 1,
        amount: Math.round((prizePool * weight) / totalWeight)
    }));
}
function fingerprintRiskScore(input) {
    let score = 0;
    if (input.emulatorDetected)
        score += 35;
    if (input.duplicateUid)
        score += 45;
    if ((input.multiAccountDeviceCount ?? 0) > 2)
        score += 30;
    if ((input.failedPayments ?? 0) >= 3)
        score += 20;
    return Math.min(score, 100);
}
function roomReleaseAt(matchStart, minutesBefore = 10) {
    return new Date(matchStart.getTime() - minutesBefore * 60 * 1000);
}
