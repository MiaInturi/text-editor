import type { Parser } from '@core/parser/parser';
import { Model } from '@core/model/model';
import { isHashTagName } from '@core/parser/utils/helpers/hashtag';
import { last } from '@utils/helpers/array';
import { UNICODE_CODES } from '@core/parser/utils/constants';
import { TOKEN_TYPE } from '@core/model/utils/constants';

const isHashTagBound = (parser: Parser): boolean => {
  if (parser.isTextWordBound()) return true;

  // ✅ important:
  // Hashtags can be concatenated
  if (!parser.isTextConsuming()) {
    const tokens = parser.getTokens();
    const lastTokenType = last(tokens)?.type;
    return lastTokenType === TOKEN_TYPE.HASHTAG;
  }

  return false;
};

const consumeHashTag = (parser: Parser): boolean => {
  if (isHashTagBound(parser)) {
    const isHashTagWasSuccessfullyConsumed = parser.consumeSpecialSymbol(UNICODE_CODES.HASHTAG);
    const isHashTagNameWasSuccessfullyConsumed = parser.consumeSpecialSymbolWhile(isHashTagName);
    return isHashTagWasSuccessfullyConsumed && isHashTagNameWasSuccessfullyConsumed;
  }
  return false;
};

export const parseHashTag = (parser: Parser): boolean => {
  const positionBeforeConsumeHashTag = parser.tell();
  if (consumeHashTag(parser)) {
    const positionAfterConsumeHashTag = parser.tell();
    const hashTagValue = parser.getTextFragment(positionBeforeConsumeHashTag, positionAfterConsumeHashTag);
    parser.addToken(Model.CreateHashTagToken(hashTagValue));
    return true;
  }
  // ✅ important:
  // Reset parser position for get already consumed text as common
  parser.seek(positionBeforeConsumeHashTag);
  return false;
};
