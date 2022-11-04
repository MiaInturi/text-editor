import { Parser } from '@core/parser/parser';
import { parseText } from './text';

describe('Text parse', () => {
  test('Text parse always return "true"', () => {
    const text = 'text';
    const parser = Parser.create(text);
    expect(parseText(parser)).toBe(true);
  });

  test('Text parse consume only one symbol per time', () => {
    const text = 'Text with many symbols';
    const parser = Parser.create(text);
    parseText(parser);

    expect(parser.tell()).toBe(1);
    expect(parser.isTextConsuming()).toBe(true);
  });

  test('Text parse does not create tokens by himself', () => {
    const text = 'Common text';
    const parser = Parser.create(text);
    parseText(parser);
    parseText(parser);
    parseText(parser);

    expect(parser.getTokens()).toStrictEqual([]);
  });
});
