import { Model } from '~core/model/model';
import { TOKEN_TYPE } from '~core/model/utils/constants';
import type { Parser } from '~core/parser/parser';
import { UNICODE_CODES } from '~core/parser/utils/constants';
import { isHashTagName } from '~core/parser/utils/helpers/hashtag';
import { last } from '~utils/helpers/array';

const isHashTagBound = (parser: Parser): boolean => {
  // ✅ important:
  // Hashtags can be concatenated
  const consumeTextStatus = parser.getConsumeTextStatus();
  if (consumeTextStatus.isTextWordBound) return true;
  if (!consumeTextStatus.isTextConsuming) return last(parser.getTokens())?.type === TOKEN_TYPE.HASHTAG;
  return false;
};

const consumeHashTag = (parser: Parser): boolean => {
  if (isHashTagBound(parser)) {
    const isHashTagSymbolWasSuccessfullyConsumed = parser.consumeSpecialSymbol(UNICODE_CODES.HASHTAG);
    if (!isHashTagSymbolWasSuccessfullyConsumed) return false;
    const isHashTagNameWasSuccessfullyConsumed = parser.consumeSpecialSymbolWhile(isHashTagName);
    return isHashTagNameWasSuccessfullyConsumed;
  }
  return false;
};

export const parseHashTag = (parser: Parser): boolean => {
  const positionBeforeConsumeHashTag = parser.tell();
  if (consumeHashTag(parser)) {
    const positionAfterConsumeHashTag = parser.tell();
    const hashTagValue = parser.getTextFragment(positionBeforeConsumeHashTag, positionAfterConsumeHashTag);
    parser.pushToken(Model.CreateHashTagToken(hashTagValue as HashTagTokenValue));
    return true;
  }
  parser.seek(positionBeforeConsumeHashTag);
  return false;
};
