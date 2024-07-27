export const range = (lower: number, upper: number): number[] => {
  const result: number[] = [];
  for (let i = lower; i < upper; i += 1) result.push(i);
  return result;
};
