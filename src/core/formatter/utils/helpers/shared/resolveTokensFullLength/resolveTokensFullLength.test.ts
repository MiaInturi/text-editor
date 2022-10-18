import { resolveTokensFullLength } from '@core/formatter/utils/helpers/shared';

describe('\'resolveTokensFullLength\' helper', () => {
  test('Return correct full length of all tokens', () => {
    const firstValue = 'text1';
    const secondValue = 'text2';
    const tokens: Token[] = [
      { type: 'text', value: firstValue, formats: [] },
      { type: 'text', value: secondValue, formats: [] },
    ];
    const expectedFullLength = firstValue.length + secondValue.length;
    expect(resolveTokensFullLength(tokens)).toStrictEqual(expectedFullLength);
  });

  test('Return 0 for empty tokens collection', () => {
    const tokens: Token[] = [];
    const expectedFullLength = 0;
    expect(resolveTokensFullLength(tokens)).toStrictEqual(expectedFullLength);
  });
});
