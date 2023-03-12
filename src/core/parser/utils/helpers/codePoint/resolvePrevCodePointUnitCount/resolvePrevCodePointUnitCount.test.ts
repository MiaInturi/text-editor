import { UTF16_UTIL } from '~core/parser/utils/constants';
import { resolvePrevCodePointUnitCount } from './resolvePrevCodePointUnitCount';

describe('\'resolvePrevCodePointUnitCount\' helper: unit count', () => {
  // ✅ important:
  // Understand the working principle: https://en.wikipedia.org/wiki/UTF-16

  test('Should return 1 for symbols whose code point not in low surrogate range', () => {
    const codePointLowerThanLowSurrogate = UTF16_UTIL.LOW_SURROGATE_MIN_VALUE - 1;
    const codePointGreaterThanLowSurrogate = UTF16_UTIL.LOW_SURROGATE_MAX_VALUE + 1;

    expect(resolvePrevCodePointUnitCount(codePointLowerThanLowSurrogate)).toBe(UTF16_UTIL.MIN_UNIT_COUNT);
    expect(resolvePrevCodePointUnitCount(codePointGreaterThanLowSurrogate)).toBe(UTF16_UTIL.MIN_UNIT_COUNT);
  });

  test('Should return 2 for symbols whose code point on the edge of low surrogate range', () => {
    const codePointEqualToMinLowSurrogate = UTF16_UTIL.LOW_SURROGATE_MIN_VALUE;
    const codePointEqualToMaxLowSurrogate = UTF16_UTIL.LOW_SURROGATE_MAX_VALUE;

    expect(resolvePrevCodePointUnitCount(codePointEqualToMinLowSurrogate)).toBe(UTF16_UTIL.MAX_UNIT_COUNT);
    expect(resolvePrevCodePointUnitCount(codePointEqualToMaxLowSurrogate)).toBe(UTF16_UTIL.MAX_UNIT_COUNT);
  });

  test('Should return 2 for symbols whose code point in low surrogate range', () => {
    const codePointInLowSurrogate = UTF16_UTIL.LOW_SURROGATE_MAX_VALUE - 1;
    expect(resolvePrevCodePointUnitCount(codePointInLowSurrogate)).toBe(UTF16_UTIL.MAX_UNIT_COUNT);
  });
});
