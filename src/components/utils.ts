export const classNames = (...classes: (string | false | null)[]): string => {
  return classes.filter(Boolean).join(" ");
};
