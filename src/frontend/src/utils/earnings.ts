export function computeAccruedEarnings(
  approvedTimestampNanos: number,
  durationDays: number,
  dailyProfit: number
): {
  startDate: Date;
  endDate: Date;
  daysElapsed: number;
  accruedEarnings: number;
} {
  const startDate = new Date(approvedTimestampNanos / 1000000);
  const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
  const now = new Date();

  const msElapsed = Math.min(now.getTime() - startDate.getTime(), endDate.getTime() - startDate.getTime());
  const daysElapsed = Math.floor(msElapsed / (24 * 60 * 60 * 1000));
  const cappedDays = Math.min(daysElapsed, durationDays);
  const accruedEarnings = cappedDays * dailyProfit;

  return {
    startDate,
    endDate,
    daysElapsed: cappedDays,
    accruedEarnings,
  };
}
