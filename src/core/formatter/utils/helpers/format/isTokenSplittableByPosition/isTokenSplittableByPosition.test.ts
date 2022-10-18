import { isTokenSplittableByPosition } from '@core/formatter/utils/helpers/format';

describe('\'isTokenSplittableByPosition\' helper', () => {
  test('Return false for edge position values', () => {
    const token: Token = { type: 'text', value: 'text', formats: [] };
    expect(isTokenSplittableByPosition(token, 0)).toBe(false);
    expect(isTokenSplittableByPosition(token, token.value.length)).toBe(false);
  });

  test('Return true only for token with splittable type', () => {
    const splittableToken: TextToken = { type: 'text', value: 'text', formats: [] };
    const notSplittableToken: NewLineToken = { type: 'newline', value: '\r\n' };
    const validPosition: Position = 1;
    expect(isTokenSplittableByPosition(splittableToken, validPosition)).toBe(true);
    expect(isTokenSplittableByPosition(notSplittableToken, validPosition)).toBe(false);
  });
});
