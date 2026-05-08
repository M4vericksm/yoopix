export function splitEqual(totalCents: number, count: number) {
  if (count <= 0) return [];
  const equal = Math.floor(totalCents / count);
  const remainder = totalCents - equal * count;
  return Array.from({ length: count }, (_, i) => ({
    amount: i === count - 1 ? equal + remainder : equal,
  }));
}

export function validateCustom(totalCents: number, amounts: number[]) {
  const sum = amounts.reduce((a, b) => a + b, 0);
  return {
    valid: sum === totalCents,
    diff: totalCents - sum,
  };
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}
