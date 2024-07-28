export const clamp = (lower: number, value: number, upper: number): number => {
  return Math.max(lower, Math.min(upper, value));
};
