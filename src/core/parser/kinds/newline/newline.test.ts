import { Parser } from '@core/parser/parser';
import { parseNewLine } from './newline';

describe('Newline parse', () => {
  test('Failed parse newline when text does not has it', () => {
    const text = 'Text without newlines';
    const parser = new Parser(text);
    expect(parseNewLine(parser)).toBe(false);
  });

  test('Successful parse newline ("return", "return + newline", "newline")', () => {
    const text = '\r\r\n\n';
    const parser = new Parser(text);
    const expectedTokens: Token[] = [
      {
        type: 'newline',
        value: '\r'
      },
      {
        type: 'newline',
        value: '\r\n'
      },
      {
        type: 'newline',
        value: '\n'
      }
    ];

    expect(parseNewLine(parser)).toBe(true);
    expect(parseNewLine(parser)).toBe(true);
    expect(parseNewLine(parser)).toBe(true);
    expect(parser.getTokens()).toStrictEqual(expectedTokens);
  });
});
