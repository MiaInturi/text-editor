import { UTF16_UTIL } from '@core/parser/utils/constants';
import { resolvePrevCodePointUnitCount } from './resolvePrevCodePointUnitCount';

describe('\'resolvePrevCodePointUnitCount\'', () => {
  test('Should return UTF-16 min unit count for symbols which is not in special low surrogate range', () => {
    const codePointNotLowSurrogateLowerMin = UTF16_UTIL.LOW_SURROGATE_MIN_VALUE - 1;
    const codePointNotLowSurrogateGreaterMax = UTF16_UTIL.LOW_SURROGATE_MAX_VALUE + 1;

    expect(resolvePrevCodePointUnitCount(codePointNotLowSurrogateLowerMin)).toEqual(UTF16_UTIL.MIN_UNIT_COUNT);
    expect(resolvePrevCodePointUnitCount(codePointNotLowSurrogateGreaterMax)).toEqual(UTF16_UTIL.MIN_UNIT_COUNT);
  });

  test('Should return UTF-16 max unit count for symbols which is in special low surrogate range', () => {
    const codePointLowSurrogateEqualMin = UTF16_UTIL.LOW_SURROGATE_MIN_VALUE;
    const codePointLowSurrogateEqualMax = UTF16_UTIL.LOW_SURROGATE_MAX_VALUE;
    const codePointLowSurrogateInRange = UTF16_UTIL.LOW_SURROGATE_MIN_VALUE + (UTF16_UTIL.LOW_SURROGATE_MAX_VALUE - UTF16_UTIL.LOW_SURROGATE_MIN_VALUE - 1);

    expect(resolvePrevCodePointUnitCount(codePointLowSurrogateEqualMin)).toEqual(UTF16_UTIL.MAX_UNIT_COUNT);
    expect(resolvePrevCodePointUnitCount(codePointLowSurrogateEqualMax)).toEqual(UTF16_UTIL.MAX_UNIT_COUNT);
    expect(resolvePrevCodePointUnitCount(codePointLowSurrogateInRange)).toEqual(UTF16_UTIL.MAX_UNIT_COUNT);
  });
});
