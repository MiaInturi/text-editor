import { normalizeTokens } from '~core/formatter/utils/helpers/other';
import { TOKEN_FORMAT, TOKEN_TYPE } from '~core/model/utils/constants';

describe('\'normalizeTokens\' helper', () => {
  test('Should filter empty and join similar tokens', () => {
    const normalizableTokens: Token[] = [
      { type: TOKEN_TYPE.TEXT, value: 'text1', formats: new Set([TOKEN_FORMAT.BOLD]) },
      { type: TOKEN_TYPE.TEXT, value: 'text2', formats: new Set([TOKEN_FORMAT.BOLD]) },
      { type: TOKEN_TYPE.TEXT, value: '', formats: new Set() },
      { type: TOKEN_TYPE.NEWLINE, value: '\n' }
    ];
    const expectedTokens: Token[] = [
      { type: TOKEN_TYPE.TEXT, value: 'text1text2', formats: new Set([TOKEN_FORMAT.BOLD]) },
      { type: TOKEN_TYPE.NEWLINE, value: '\n' }
    ];
    expect(normalizeTokens(normalizableTokens)).toStrictEqual(expectedTokens);
  });
});
