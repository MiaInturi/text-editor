import type { Parser } from '../parser';

export const parseText = (parser: Parser): boolean => {
  parser.consumeText();
  return true;
};
