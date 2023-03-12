import { UTF16_UTIL } from '~core/parser/utils/constants';
import { resolveNextCodePointUnitCount } from './resolveNextCodePointUnitCount';

describe('\'resolveNextCodePointUnitCount\' helper: unit count', () => {
  // ✅ important:
  // Understand the working principle: https://en.wikipedia.org/wiki/UTF-16

  test('Should return 1 for symbols whose code point lower than unit max value', () => {
    const codePointLowerThanUnit = UTF16_UTIL.UNIT_MAX_VALUE - 1;
    expect(resolveNextCodePointUnitCount(codePointLowerThanUnit)).toBe(UTF16_UTIL.MIN_UNIT_COUNT);
  });

  test('Should return 1 for symbols whose code equal to unit max value', () => {
    const codePointEqualToMaxUnit = UTF16_UTIL.UNIT_MAX_VALUE;
    expect(resolveNextCodePointUnitCount(codePointEqualToMaxUnit)).toBe(UTF16_UTIL.MIN_UNIT_COUNT);
  });

  test('Should return 2 for symbols whose code greater than unit max value', () => {
    const codePointGreaterThanUnit = UTF16_UTIL.UNIT_MAX_VALUE + 1;
    expect(resolveNextCodePointUnitCount(codePointGreaterThanUnit)).toBe(UTF16_UTIL.MAX_UNIT_COUNT);
  });
});
