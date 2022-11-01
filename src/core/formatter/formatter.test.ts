import { Model } from '@core/model/model';
import { Formatter } from '@core/formatter/formatter';
import { isTokenFormattable } from '@core/formatter/utils/helpers/format';
import { cloneToken } from '@core/model/utils/helpers/shared';
import { TOKEN_FORMAT } from '@core/model/utils/constants';

describe('Formatter class: format', () => {
  test('Format range should has \'from\' less than \'to\'', () => {
    const model = new Model();
    const formatter = new Formatter(model);
    const invalidRange: FormatRange = { from: 1, to: 0 };
    expect(() => formatter.format(TOKEN_FORMAT.BOLD, invalidRange)).toThrow(Error);
  });

  test('Format range should not be greater than tokens full length', () => {
    const model = new Model();
    const formatter = new Formatter(model);
    const invalidRange: FormatRange = { from: 0, to: 1 };
    expect(() => formatter.format(TOKEN_FORMAT.BOLD, invalidRange)).toThrow(Error);
  });

  test('Formattable splittable single token should split into three tokens and should get format', () => {
    const token: Token = { type: 'text', value: 'text', formats: [] };
    const formatter = new Formatter(new Model([token]));

    const format = TOKEN_FORMAT.BOLD;
    const range: FormatRange = { from: 1, to: 3 };
    const expectedTokens: Token[] = [
      { type: 'text', value: 't', formats: [] },
      { type: 'text', value: 'ex', formats: [format] },
      { type: 'text', value: 't', formats: [] }
    ];
    expect(formatter.format(format, range)).toStrictEqual(expectedTokens);
  });

  test('Formattable not splittable single token should not split and should get format', () => {
    const token: Token = { type: 'hashtag', value: '#hashtag', formats: [] };
    const formatter = new Formatter(new Model([token]));

    const format = TOKEN_FORMAT.BOLD;
    const range: FormatRange = { from: 1, to: 3 };
    const expectedTokens: Token[] = [{ ...cloneToken(token), formats: [format] }];
    expect(formatter.format(format, range)).toStrictEqual(expectedTokens);
  });

  test('Not formattable not splittable single token should not split and should not get format', () => {
    const token: Token = { type: 'newline', value: '\n' };
    const formatter = new Formatter(new Model([token]));

    const format = TOKEN_FORMAT.BOLD;
    const range: FormatRange = { from: 0, to: 1 };
    const expectedTokens: Token[] = [cloneToken(token)];
    expect(formatter.format(format, range)).toStrictEqual(expectedTokens);
  });

  test('Formattable splittable multiple tokens should split into four tokens and should get format', () => {
    const tokens: Token[] = [
      { type: 'text', value: 'text1', formats: [] },
      { type: 'text', value: 'text2', formats: [] },
      { type: 'text', value: 'text3', formats: [] }
    ];
    const formatter = new Formatter(new Model(tokens));

    const format = TOKEN_FORMAT.BOLD;
    const range: FormatRange = { from: 2, to: 12 };
    const expectedTokens: Token[] = [
      { type: 'text', value: 'te', formats: [] },
      { type: 'text', value: 'xt1', formats: [format] },
      { type: 'text', value: 'text2', formats: [format] },
      { type: 'text', value: 'te', formats: [format] },
      { type: 'text', value: 'xt3', formats: [] },
    ];
    expect(formatter.format(format, range)).toStrictEqual(expectedTokens);
  });

  test('Formattable splittable multiple tokens should not split and should get format', () => {
    const tokens: Token[] = [
      { type: 'hashtag', value: '#hashtag', formats: [] },
      { type: 'text', value: 'text', formats: [] },
      { type: 'hashtag', value: '#hashtag', formats: [] },
    ];
    const formatter = new Formatter(new Model(tokens));

    const format = TOKEN_FORMAT.BOLD;
    const range: FormatRange = { from: 2, to: 14 };
    const expectedTokens: Token[] = tokens.map((token) => ({ ...cloneToken(token), formats: [format] }));
    expect(formatter.format(format, range)).toStrictEqual(expectedTokens);
  });

  test('Not formattable not splittable multiple tokens should not split and should not get format', () => {
    const tokens: Token[] = [
      { type: 'newline', value: '\n' },
      { type: 'text', value: 'text', formats: [] },
      { type: 'newline', value: '\n' }
    ];
    const formatter = new Formatter(new Model(tokens));

    const format = TOKEN_FORMAT.BOLD;
    const range: FormatRange = { from: 0, to: 6 };
    const expectedTokens: Token[] = tokens.map((token) => isTokenFormattable(token) ? { ...cloneToken(token), formats: [format] } : cloneToken(token));
    expect(formatter.format(format, range)).toStrictEqual(expectedTokens);
  });

  test('Set format to tokens when all of them already have format or not formattable => delete format', () => {
    const format = TOKEN_FORMAT.BOLD;
    const tokens: Token[] = [
      { type: 'text', value: 'text1', formats: [format] },
      { type: 'text', value: 'text2', formats: [format] },
      { type: 'text', value: 'text3', formats: [format] }
    ];
    const formatter = new Formatter(new Model(tokens));

    const range: FormatRange = { from: 2, to: 12 };
    const expectedTokens: Token[] = [
      { type: 'text', value: 'te', formats: [format] },
      { type: 'text', value: 'xt1', formats: [] },
      { type: 'text', value: 'text2', formats: [] },
      { type: 'text', value: 'te', formats: [] },
      { type: 'text', value: 'xt3', formats: [format] },
    ];
    expect(formatter.format(format, range)).toStrictEqual(expectedTokens);
  });
});
