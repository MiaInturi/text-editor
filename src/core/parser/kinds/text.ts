import type { Parser } from '../parser';

export const parseText = (parser: Parser): boolean => {
  parser.consumeText();
  parser.flush();
  return true;
};
