export const addUniqueValueIntoArray = <T>(arr: T[], value: T): T[] => (
  arr.includes(value) ? [...arr] : [...arr, value]
);
