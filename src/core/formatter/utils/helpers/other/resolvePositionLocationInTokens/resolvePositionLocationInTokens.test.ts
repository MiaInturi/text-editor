import { resolvePositionLocationInTokens } from '~core/formatter/utils/helpers/other';
import { TOKEN_TYPE } from '~core/model/utils/constants';

describe('\'resolvePositionLocationInTokens\' helper', () => {
  const firstValue = 'text1';
  const secondValue = 'text2';
  const tokens: Token[] = [
    { type: TOKEN_TYPE.TEXT, value: firstValue, formats: new Set() },
    { type: TOKEN_TYPE.TEXT, value: secondValue, formats: new Set() }
  ];

  test('Should return correct index and offset for not edge position', () => {
    const position: Position = firstValue.length + (secondValue.length - 2);
    const expectedPositionLocation: PositionLocationInTokens = { index: 1, offset: secondValue.length - 2 };
    expect(resolvePositionLocationInTokens(tokens, position, false)).toStrictEqual(expectedPositionLocation);
  });

  test('Should return correct index and offset for edge position', () => {
    const position: Position = firstValue.length;
    const expectedPositionLocationExcludeEndEdge: PositionLocationInTokens = { index: 1, offset: 0 };
    const expectedPositionLocationIncludeEndEdge: PositionLocationInTokens = { index: 0, offset: firstValue.length };
    expect(resolvePositionLocationInTokens(tokens, position, false)).toStrictEqual(expectedPositionLocationExcludeEndEdge);
    expect(resolvePositionLocationInTokens(tokens, position, true)).toStrictEqual(expectedPositionLocationIncludeEndEdge);
  });
});
