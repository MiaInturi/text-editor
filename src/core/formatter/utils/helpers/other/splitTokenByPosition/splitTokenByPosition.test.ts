import { splitTokenByPosition } from '@core/formatter/utils/helpers/other';
import { TOKEN_FORMAT, TOKEN_TYPE } from '@core/model/utils/constants';

describe('\'splitTokenByPosition\' helper', () => {
  test('Should split token value by position (with saving other properties)', () => {
    const position: Position = 2;
    const tokenForSplit: Token = { type: TOKEN_TYPE.TEXT, value: 'text', formats: new Set([TOKEN_FORMAT.BOLD]) };
    const expectedFirstSplittedToken: Token = { type: TOKEN_TYPE.TEXT, value: 'te', formats: new Set([TOKEN_FORMAT.BOLD]) };
    const expectedSecondSplittedToken: Token = { type: TOKEN_TYPE.TEXT, value: 'xt', formats: new Set([TOKEN_FORMAT.BOLD]) };

    const [firstSplittedToken, secondSplittedToken] = splitTokenByPosition(tokenForSplit, position);
    expect(firstSplittedToken).toStrictEqual(expectedFirstSplittedToken);
    expect(secondSplittedToken).toStrictEqual(expectedSecondSplittedToken);
  });

  test('Should create token with empty value if split position on start/end of token', () => {
    const value = 'text';
    const tokenForSplit: Token = { type: TOKEN_TYPE.TEXT, value, formats: new Set([TOKEN_FORMAT.BOLD]) };
    const expectedEdgeSplittedToken: Token = { type: TOKEN_TYPE.TEXT, value: '', formats: new Set([TOKEN_FORMAT.BOLD]) };

    const [startEdgeSplittedToken] = splitTokenByPosition(tokenForSplit, 0);
    const [, endEdgeSplittedToken] = splitTokenByPosition(tokenForSplit, value.length);
    expect(startEdgeSplittedToken).toStrictEqual(expectedEdgeSplittedToken);
    expect(endEdgeSplittedToken).toStrictEqual(expectedEdgeSplittedToken);
  });
});
