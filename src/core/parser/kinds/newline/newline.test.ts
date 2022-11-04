import { Model } from '@core/model/model';
import { Parser } from '@core/parser/parser';
import { parseNewLine } from './newline';

describe('Newline parse', () => {
  test('Failed parse newline when text does not has it', () => {
    const text = 'Text without newlines';
    const parser = Parser.create(text);
    expect(parseNewLine(parser)).toBe(false);
  });

  test('Successful parse newline ("return", "return + newline", "newline")', () => {
    const text = '\r\r\n\n';
    const parser = Parser.create(text);
    const expectedTokens: Token[] = [
      Model.CreateNewLineToken('\r'),
      Model.CreateNewLineToken('\r\n'),
      Model.CreateNewLineToken('\n')
    ];

    expect(parseNewLine(parser)).toBe(true);
    expect(parseNewLine(parser)).toBe(true);
    expect(parseNewLine(parser)).toBe(true);
    expect(parser.getTokens()).toStrictEqual(expectedTokens);
  });
});
