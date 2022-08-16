import { Parser } from './parser';
import { parseNewLine } from './kinds/newline';
import { parseText } from './kinds/text';

export const parse = (text: string): Token[] => {
  const parser = new Parser(text);
  const parseFunctions = [parseNewLine, parseText];
  return parser.parse(parseFunctions);
};
