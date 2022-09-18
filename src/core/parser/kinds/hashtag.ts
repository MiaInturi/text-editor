import type { Parser } from '../parser';
import { Tokens } from '../../tokens';
import { isHashTagName } from '../utils/helpers/hashtag';
import { last } from '../../../utils/helpers/array';
import { TOKEN_TYPE } from '../../tokens/utils/constants';
import { UNICODE_CODES } from '../utils/constants';

const isHashTagBound = (parser: Parser): boolean => {
  if (parser.isNewWordBound()) return true;

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
    return parser.consume(UNICODE_CODES.HASHTAG) && parser.consumeWhile(isHashTagName);
  }
  return false;
};

export const parseHashTag = (parser: Parser): boolean => {
  const positionBeforeConsumeHashTag = parser.tell();
  if (consumeHashTag(parser)) {
    const positionAfterConsumeHashTag = parser.tell();
    const hashTagValue = parser.getTextFragment(positionBeforeConsumeHashTag, positionAfterConsumeHashTag);
    parser.addToken(Tokens.createHashTagToken(hashTagValue));
    return true;
  }
  // ✅ important:
  // Reset parser position for get already consumed text as common
  parser.seek(positionBeforeConsumeHashTag);
  return false;
};
