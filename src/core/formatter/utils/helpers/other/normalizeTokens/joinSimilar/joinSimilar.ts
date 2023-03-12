import { isTokenFormattable } from '~core/formatter/utils/helpers/format';
import { TOKEN_TYPE } from '~core/model/utils/constants';

export const joinSimilar = (tokens: Token[]): Token[] => (
  tokens.reduce((acc, currentToken) => {
    const prevToken = acc[acc.length - 1];

    const isPrevAndCurrentTokensHaveSuitableType = (
      prevToken
      && prevToken.type === TOKEN_TYPE.TEXT
      && prevToken.type === currentToken.type
    );
    const isPrevAndCurrentTokensHaveSameFormats = (
      prevToken
      && isTokenFormattable(prevToken)
      && isTokenFormattable(currentToken)
      && prevToken.formats.size === currentToken.formats.size
      && [...prevToken.formats].every((prevTokenFormat) => currentToken.formats.has(prevTokenFormat))
    );

    const canJoinPrevAndCurrentTokens = (
      isPrevAndCurrentTokensHaveSuitableType
      && isPrevAndCurrentTokensHaveSameFormats
    );
    if (canJoinPrevAndCurrentTokens) {
      prevToken.value += currentToken.value;
      return acc;
    }
    acc.push(currentToken);
    return acc;
  }, [] as Token[])
);
