import { Formatter } from '@core/formatter/formatter';
import { TOKEN_FORMAT, TOKEN_TYPE } from '@core/model/utils/constants';

describe('Formatter class: validation', () => {
  test('Selection range should has \'from\' less than \'to\'', () => {
    expect(() => Formatter.applyFormat([], { from: 1, to: 0 }, TOKEN_FORMAT.BOLD)).toThrow(Error);
    expect(() => Formatter.applyFormat([], { from: 1, to: 1 }, TOKEN_FORMAT.BOLD)).toThrow(Error);
  });

  test('Selection range should not be greater than tokens full length', () => {
    const tokens: Token[] = [{ type: TOKEN_TYPE.TEXT, value: 'text', formats: new Set() }];
    const invalidRange: SelectionRange = { from: 0, to: 5 };
    expect(() => Formatter.applyFormat(tokens, invalidRange, TOKEN_FORMAT.BOLD)).toThrow(Error);
  });
});

describe('Formatter class: format single token', () => {
  test('Should not change not formattable token', () => {
    const tokens: Token[] = [{ type: TOKEN_TYPE.NEWLINE, value: '\r\n' }];
    expect(Formatter.applyFormat(tokens, { from: 0, to: 1 }, TOKEN_FORMAT.BOLD)).toStrictEqual(tokens);
  });

  test('Should apply format to full value for not splittable token', () => {
    const tokens: Token[] = [{ type: TOKEN_TYPE.HASHTAG, value: '#hashtag', formats: new Set() }];
    const expectedTokens: Token[] = [{ type: TOKEN_TYPE.HASHTAG, value: '#hashtag', formats: new Set([TOKEN_FORMAT.BOLD]) }];
    expect(Formatter.applyFormat(tokens, { from: 0, to: 1 }, TOKEN_FORMAT.BOLD)).toStrictEqual(expectedTokens);
  });

  test('Should apply format only to value in range for splittable token', () => {
    const tokens: Token[] = [{ type: TOKEN_TYPE.TEXT, value: 'text', formats: new Set() }];
    const expectedTokens: Token[] = [
      { type: TOKEN_TYPE.TEXT, value: 't', formats: new Set() },
      { type: TOKEN_TYPE.TEXT, value: 'ex', formats: new Set([TOKEN_FORMAT.BOLD]) },
      { type: TOKEN_TYPE.TEXT, value: 't', formats: new Set() }
    ];
    expect(Formatter.applyFormat(tokens, { from: 1, to: 3 }, TOKEN_FORMAT.BOLD)).toStrictEqual(expectedTokens);
  });
});

describe('Formatter class: format multiple tokens', () => {
  test('Should apply format to full value for not splittable edge tokens', () => {
    const tokens: Token[] = [
      { type: TOKEN_TYPE.HASHTAG, value: '#hashtag1', formats: new Set() },
      { type: TOKEN_TYPE.HASHTAG, value: '#hashtag2', formats: new Set() },
      { type: TOKEN_TYPE.HASHTAG, value: '#hashtag3', formats: new Set() }
    ];
    const expectedTokens: Token[] = [
      { type: TOKEN_TYPE.HASHTAG, value: '#hashtag1', formats: new Set([TOKEN_FORMAT.BOLD]) },
      { type: TOKEN_TYPE.HASHTAG, value: '#hashtag2', formats: new Set([TOKEN_FORMAT.BOLD]) },
      { type: TOKEN_TYPE.HASHTAG, value: '#hashtag3', formats: new Set([TOKEN_FORMAT.BOLD]) }
    ];
    expect(Formatter.applyFormat(tokens, { from: 1, to: 20 }, TOKEN_FORMAT.BOLD)).toStrictEqual(expectedTokens);
  });

  test('Should apply format of to value in range for splittable edge tokens and normalize them', () => {
    const tokens: Token[] = [
      { type: TOKEN_TYPE.TEXT, value: '#text1', formats: new Set() },
      { type: TOKEN_TYPE.TEXT, value: '#text2', formats: new Set() },
      { type: TOKEN_TYPE.TEXT, value: '#text3', formats: new Set() }
    ];
    const expectedTokens: Token[] = [
      { type: TOKEN_TYPE.TEXT, value: '#te', formats: new Set() },
      { type: TOKEN_TYPE.TEXT, value: 'xt1#text2#te', formats: new Set([TOKEN_FORMAT.BOLD]) },
      { type: TOKEN_TYPE.TEXT, value: 'xt3', formats: new Set() }
    ];
    expect(Formatter.applyFormat(tokens, { from: 3, to: 15 }, TOKEN_FORMAT.BOLD)).toStrictEqual(expectedTokens);
  });

  test('Should delete format from all tokens in range if all of them already have that format', () => {
    const tokens: Token[] = [
      { type: TOKEN_TYPE.TEXT, value: '#text1', formats: new Set([TOKEN_FORMAT.BOLD]) },
      { type: TOKEN_TYPE.TEXT, value: '#text2', formats: new Set([TOKEN_FORMAT.BOLD]) },
      { type: TOKEN_TYPE.TEXT, value: '#text3', formats: new Set([TOKEN_FORMAT.BOLD]) }
    ];
    const expectedTokens: Token[] = [
      { type: TOKEN_TYPE.TEXT, value: '#te', formats: new Set([TOKEN_FORMAT.BOLD]) },
      { type: TOKEN_TYPE.TEXT, value: 'xt1#text2#te', formats: new Set() },
      { type: TOKEN_TYPE.TEXT, value: 'xt3', formats: new Set([TOKEN_FORMAT.BOLD]) }
    ];
    expect(Formatter.applyFormat(tokens, { from: 3, to: 15 }, TOKEN_FORMAT.BOLD)).toStrictEqual(expectedTokens);
  });
});
