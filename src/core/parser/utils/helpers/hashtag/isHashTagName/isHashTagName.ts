import { UNICODE_CODES } from '../../../constants';
import { isLetter, isNumber } from '../../other';

export const isHashTagName = (codePoint: CodePoint): boolean => (
  isLetter(codePoint) || isNumber(codePoint) || codePoint === UNICODE_CODES.LOWLINE
);
