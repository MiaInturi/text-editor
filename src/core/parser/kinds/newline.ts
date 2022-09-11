import type { Parser } from '../parser';

import { Tokens } from '../../tokens';
import { UNICODE_CODES } from '../utils/constants';

const consumeNewLine = (parser: Parser): boolean => {
  // ✅ important:
  // Consume '\r', '\r\n' as NewLine
  if (parser.consume(UNICODE_CODES.RETURN)) {
    parser.consume(UNICODE_CODES.NEWLINE);
    return true;
  }
  // ✅ important:
  // Consume '\n' as NewLine
  return parser.consume(UNICODE_CODES.NEWLINE);
};

export const parseNewLine = (parser: Parser & Object): boolean => {
  const positionBeforeConsumeNewLine = parser.tell();
  if (consumeNewLine(parser)) {
    const positionAfterConsumeNewLine = parser.tell();
    const textForToken = parser.getTextFragment(positionBeforeConsumeNewLine, positionAfterConsumeNewLine);
    const newLineToken = Tokens.createNewLineToken(textForToken);
    parser.push(newLineToken);
    return true;
  }
  return false;
};
