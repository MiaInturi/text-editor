import { filterEmpty } from '@core/formatter/utils/helpers/other/normalizeTokens/filterEmpty/filterEmpty';
import { TOKEN_TYPE } from '@core/model/utils/constants';

describe('\'filterEmpty\' helper', () => {
  test('Should filter tokens with empty value', () => {
    const filterableTokens: Token[] = [
      { type: TOKEN_TYPE.TEXT, value: 'text1', formats: new Set() },
      { type: TOKEN_TYPE.TEXT, value: '', formats: new Set() },
      { type: TOKEN_TYPE.TEXT, value: 'text2', formats: new Set() }
    ];
    const expectedTokens: Token[] = [
      { type: TOKEN_TYPE.TEXT, value: 'text1', formats: new Set() },
      { type: TOKEN_TYPE.TEXT, value: 'text2', formats: new Set() }
    ];
    expect(filterEmpty(filterableTokens)).toStrictEqual(expectedTokens);
  });
});
