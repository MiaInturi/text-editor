import { isTokenFormattable } from '@core/formatter/utils/helpers/format';

describe('\'isTokenFormattable\' helper', () => {
  test('For formattable tokens return true, for not not formattable tokens return false', () => {
    const formattableToken: TextToken = { type: 'text', value: 'text', formats: [] };
    const notFormattableToken: NewLineToken = { type: 'newline', value: '\n' };
    expect(isTokenFormattable(formattableToken)).toBe(true);
    expect(isTokenFormattable(notFormattableToken)).toBe(false);
  });
});
