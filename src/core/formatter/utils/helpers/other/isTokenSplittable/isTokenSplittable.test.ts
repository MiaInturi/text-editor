import { isTokenSplittable } from '@core/formatter/utils/helpers/other';
import { TOKEN_TYPE } from '@core/model/utils/constants';

describe('\'isTokenSplittable\' helper', () => {
  test('Should return true only for token that value can be split', () => {
    type SplittableToken = Extract<Token, TextToken>;
    const splittableTokens: SplittableToken[] = [
      { type: TOKEN_TYPE.TEXT, value: 'text', formats: new Set() }
    ];
    splittableTokens.forEach((splittableToken) => {
      expect(isTokenSplittable(splittableToken)).toBe(true);
    });

    type NotSplittableToken = Exclude<Token, SplittableToken>;
    const notSplittableTokens: NotSplittableToken[] = [
      { type: TOKEN_TYPE.NEWLINE, value: '\n' },
      { type: TOKEN_TYPE.HASHTAG, value: '#hashtag', formats: new Set() }
    ];
    notSplittableTokens.forEach((notSplittableToken) => {
      expect(isTokenSplittable(notSplittableToken)).toBe(false);
    });
  });
});
