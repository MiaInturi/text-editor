import type { Parser } from '../../parser';
import { Tokens } from '../../../tokens';
import { isHashTagName } from '../../utils/helpers/hashtag';
import { last } from '../../../../utils/helpers/array';
import { TOKEN_TYPE } from '../../../tokens/utils/constants';
import { UNICODE_CODES } from '../../utils/constants';

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
    parser.addToken(Tokens.CreateHashTagToken(hashTagValue));
    return true;
  }
  // ✅ important:
  // Reset parser position for get already consumed text as common
  parser.seek(positionBeforeConsumeHashTag);
  return false;
};
