import { UTF16_UTIL } from '~core/parser/utils/constants';

export const resolveNextCodePointUnitCount = (nextCodePoint: CodePoint): number => {
  const isNextCodePointIsSurrogatePair = nextCodePoint > UTF16_UTIL.UNIT_MAX_VALUE;
  return isNextCodePointIsSurrogatePair ? UTF16_UTIL.MAX_UNIT_COUNT : UTF16_UTIL.MIN_UNIT_COUNT;
};
