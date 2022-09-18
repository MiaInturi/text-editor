import type { Parser } from '../parser';

import { Tokens } from '../../tokens';
import { UNICODE_CODES } from '../utils/constants';

const consumeNewLine = (parser: Parser): boolean => {
  // ✅ important:
  // Consume '\r', '\n', '\r\n' as NewLine
  if (parser.consume(UNICODE_CODES.RETURN)) {
    parser.consume(UNICODE_CODES.NEWLINE);
    return true;
  }
  return parser.consume(UNICODE_CODES.NEWLINE);
};

export const parseNewLine = (parser: Parser): boolean => {
  const positionBeforeConsumeNewLine = parser.tell();
  if (consumeNewLine(parser)) {
    const positionAfterConsumeNewLine = parser.tell();
    const newLineValue = parser.getTextFragment(positionBeforeConsumeNewLine, positionAfterConsumeNewLine);
    parser.addToken(Tokens.createNewLineToken(newLineValue));
    return true;
  }
  return false;
};
