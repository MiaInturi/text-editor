import { Parser } from './parser';

export const parse = (text: string): Token[] => {
  const parser = new Parser(text);
  return parser.parse();
};
