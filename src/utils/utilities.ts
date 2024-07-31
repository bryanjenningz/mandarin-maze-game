export const clamp = (lower: number, value: number, upper: number): number => {
  return Math.max(lower, Math.min(upper, value));
};

export const range = (lower: number, upper: number): number[] => {
  const result: number[] = [];
  for (let i = lower; i < upper; i += 1) result.push(i);
  return result;
};
