import { UTF16_UTIL } from '@core/parser/utils/constants';
import { resolveNextCodePointUnitCount } from './resolveNextCodePointUnitCount';

describe('\'resolveNextCodePointUnitCount\' helper', () => {
  test('Should return UTF-16 min unit count for symbols which code point lower or equal to one unit max value', () => {
    const codePointForUnitLowerMax = UTF16_UTIL.UNIT_MAX_VALUE - 1;
    const codePointForUnitEqualMax = UTF16_UTIL.UNIT_MAX_VALUE;
    expect(resolveNextCodePointUnitCount(codePointForUnitLowerMax)).toEqual(UTF16_UTIL.MIN_UNIT_COUNT);
    expect(resolveNextCodePointUnitCount(codePointForUnitEqualMax)).toEqual(UTF16_UTIL.MIN_UNIT_COUNT);
  });

  test('Should return UTF-16 max unit count for symbols which code point greater than one unit max value', () => {
    const codePointForUnitGreaterMax = UTF16_UTIL.UNIT_MAX_VALUE + 1;
    expect(resolveNextCodePointUnitCount(codePointForUnitGreaterMax)).toEqual(UTF16_UTIL.MAX_UNIT_COUNT);
  });
});
