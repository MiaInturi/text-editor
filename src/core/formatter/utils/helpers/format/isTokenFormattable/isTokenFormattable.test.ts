import { isTokenFormattable } from '@core/formatter/utils/helpers/format';
import { TOKEN_TYPE } from '@core/model/utils/constants';

describe('\'isTokenFormattable\' helper', () => {
  test('Should return true only for token that can be format', () => {
    type FormattableToken = Exclude<Token, NewLineToken>;
    const formattableTokens: FormattableToken[] = [
      { type: TOKEN_TYPE.TEXT, value: 'text', formats: new Set() },
      { type: TOKEN_TYPE.HASHTAG, value: '#text', formats: new Set() }
    ];
    formattableTokens.forEach((formattableToken) => {
      expect(isTokenFormattable(formattableToken)).toBe(true);
    });

    type NotFormattableToken = Exclude<Token, FormattableToken>;
    const notFormattableTokens: NotFormattableToken[] = [
      { type: TOKEN_TYPE.NEWLINE, value: '\n' }
    ];
    notFormattableTokens.forEach((notFormattableToken) => {
      expect(isTokenFormattable(notFormattableToken)).toBe(false);
    });
  });
});
