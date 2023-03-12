import type { Parser } from '~core/parser/parser';

export const parseText = (parser: Parser): boolean => {
  parser.consumeText();
  return true;
};
