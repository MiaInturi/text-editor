import { UNICODE_CODES } from '../../constants';

const isSpace = (codePoint: CodePoint): boolean => (
  codePoint === UNICODE_CODES.SPACE
  || codePoint === UNICODE_CODES.NBSP
  || codePoint === UNICODE_CODES.TAB
);

const isNewLine = (codePoint: CodePoint): boolean => (
  codePoint === UNICODE_CODES.NEWLINE
  || codePoint === UNICODE_CODES.RETURN
);

export const isDelimiter = (codePoint: CodePoint): boolean => (
  isSpace(codePoint) || isNewLine(codePoint)
);
