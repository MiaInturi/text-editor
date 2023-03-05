import { UTF16_UTIL } from '@core/parser/utils/constants';

export const resolvePrevCodePointUnitCount = (prevCodePoint: CodePoint): number => {
  const isPrevCodePointIsLowUnitOfSurrogatePair = prevCodePoint >= UTF16_UTIL.LOW_SURROGATE_MIN_VALUE && prevCodePoint <= UTF16_UTIL.LOW_SURROGATE_MAX_VALUE;
  return isPrevCodePointIsLowUnitOfSurrogatePair ? UTF16_UTIL.MAX_UNIT_COUNT : UTF16_UTIL.MIN_UNIT_COUNT;
};
