import { isLetter, isNumber } from '../shared';
import { UNICODE_CODES } from '../../constants';

export const isHashTagName = (codePoint: CodePoint): boolean => (
  isLetter(codePoint) || isNumber(codePoint) || codePoint === UNICODE_CODES.LOWLINE
);
