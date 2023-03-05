import type { Parser } from '@core/parser/parser';
import { Model } from '@core/model/model';
import { UNICODE_CODES } from '@core/parser/utils/constants';

const consumeNewLine = (parser: Parser): boolean => {
  // ✅ important:
  // Consume '\r', '\n', '\r\n' as NewLine
  if (parser.consumeSpecialSymbol(UNICODE_CODES.RETURN)) {
    parser.consumeSpecialSymbol(UNICODE_CODES.NEWLINE);
    return true;
  }
  return parser.consumeSpecialSymbol(UNICODE_CODES.NEWLINE);
};

export const parseNewLine = (parser: Parser): boolean => {
  const positionBeforeConsumeNewLine = parser.tell();
  if (consumeNewLine(parser)) {
    const positionAfterConsumeNewLine = parser.tell();
    const newLineValue = parser.getTextFragment(positionBeforeConsumeNewLine, positionAfterConsumeNewLine);
    parser.pushToken(Model.CreateNewLineToken(newLineValue as NewLineTokenValue));
    return true;
  }
  return false;
};
