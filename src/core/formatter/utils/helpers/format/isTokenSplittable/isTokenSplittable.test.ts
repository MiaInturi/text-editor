import { isTokenSplittable } from '@core/formatter/utils/helpers/format';

describe('\'isTokenSplittable\' helper', () => {
  test('Return true only for token with splittable type', () => {
    const splittableToken: TextToken = { type: 'text', value: 'text', formats: [] };
    const notSplittableToken: NewLineToken = { type: 'newline', value: '\r\n' };
    expect(isTokenSplittable(splittableToken)).toBe(true);
    expect(isTokenSplittable(notSplittableToken)).toBe(false);
  });
});
