import { Model } from '@core/model/model';
import { Parser } from '@core/parser/parser';
import { parseNewLine } from './newline';

describe('Newline parse', () => {
  test('Failed parse newline when text does not has it', () => {
    const model = new Model();
    const text = 'Text without newlines';
    const parser = new Parser(model, text);
    expect(parseNewLine(parser)).toBe(false);
  });

  test('Successful parse newline ("return", "return + newline", "newline")', () => {
    const model = new Model();
    const text = '\r\r\n\n';
    const parser = new Parser(model, text);
    const expectedTokens: Token[] = [
      { type: 'newline', value: '\r' },
      { type: 'newline', value: '\r\n' },
      { type: 'newline', value: '\n' }
    ];

    expect(parseNewLine(parser)).toBe(true);
    expect(parseNewLine(parser)).toBe(true);
    expect(parseNewLine(parser)).toBe(true);
    expect(model.getTokens()).toStrictEqual(expectedTokens);
  });
});
