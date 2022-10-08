import type { Parser } from '@core/parser/parser';
import { Model } from '@core/model/model';
import { isHashTagName } from '@core/parser/utils/helpers/hashtag';
import { last } from '@utils/helpers/array';
import { UNICODE_CODES } from '@core/parser/utils/constants';
import { TOKEN_TYPE } from '@core/model/utils/constants';

const isHashTagBound = (parser: Parser, model: Model): boolean => {
  // ✅ important:
  // Hashtags can be concatenated
  if (parser.isTextWordBound()) return true;
  if (!parser.isTextConsuming()) return last(model.getTokens())?.type === TOKEN_TYPE.HASHTAG;

  return false;
};

const consumeHashTag = (parser: Parser, model: Model): boolean => {
  if (isHashTagBound(parser, model)) {
    const isHashTagWasSuccessfullyConsumed = parser.consumeSpecialSymbol(UNICODE_CODES.HASHTAG);
    const isHashTagNameWasSuccessfullyConsumed = parser.consumeSpecialSymbolWhile(isHashTagName);
    return isHashTagWasSuccessfullyConsumed && isHashTagNameWasSuccessfullyConsumed;
  }
  return false;
};

export const parseHashTag = (parser: Parser, model: Model): boolean => {
  const positionBeforeConsumeHashTag = parser.tell();
  if (consumeHashTag(parser, model)) {
    const positionAfterConsumeHashTag = parser.tell();
    const hashTagValue = parser.getTextFragment(positionBeforeConsumeHashTag, positionAfterConsumeHashTag);
    parser.pushToken(Model.CreateHashTagToken(hashTagValue));
    return true;
  }
  // ✅ important:
  // Reset parser position for get already consumed text as common
  parser.seek(positionBeforeConsumeHashTag);
  return false;
};
