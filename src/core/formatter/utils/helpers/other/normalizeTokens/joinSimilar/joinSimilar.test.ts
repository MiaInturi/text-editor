import { joinSimilar } from '~core/formatter/utils/helpers/other/normalizeTokens/joinSimilar/joinSimilar';
import { TOKEN_FORMAT, TOKEN_TYPE } from '~core/model/utils/constants';

describe('\'joinSimilar\' helper', () => {
  test('Should join tokens only with same type (\'text\') and equal formats', () => {
    const joinableTokens: Token[] = [
      { type: TOKEN_TYPE.TEXT, value: 'text1', formats: new Set([TOKEN_FORMAT.BOLD]) },
      { type: TOKEN_TYPE.TEXT, value: 'text2', formats: new Set([TOKEN_FORMAT.BOLD]) }
    ];
    const expectedJoinableTokens: Token[] = [
      { type: TOKEN_TYPE.TEXT, value: 'text1text2', formats: new Set([TOKEN_FORMAT.BOLD]) }
    ];
    expect(joinSimilar(joinableTokens)).toStrictEqual(expectedJoinableTokens);

    const notJoinableTokens: Token[] = [
      { type: TOKEN_TYPE.HASHTAG, value: '#hashtag', formats: new Set() },
      { type: TOKEN_TYPE.TEXT, value: 'text1', formats: new Set() },
      { type: TOKEN_TYPE.TEXT, value: 'text2', formats: new Set([TOKEN_FORMAT.BOLD]) }
    ];
    const expectedNotJoinableTokens: Token[] = [
      { type: TOKEN_TYPE.HASHTAG, value: '#hashtag', formats: new Set() },
      { type: TOKEN_TYPE.TEXT, value: 'text1', formats: new Set() },
      { type: TOKEN_TYPE.TEXT, value: 'text2', formats: new Set([TOKEN_FORMAT.BOLD]) }
    ];
    expect(joinSimilar(notJoinableTokens)).toStrictEqual(expectedNotJoinableTokens);
  });
});
