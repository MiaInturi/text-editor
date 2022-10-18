import { TOKEN_TYPE } from '@core/model/utils/constants';

const isTokenFormatSplitted = (tokenType: TokenType): boolean => (
  tokenType === TOKEN_TYPE.TEXT
);

export const isTokenSplittableByPosition = (token: Token, position: Position): boolean => (
  position !== 0 && position !== token.value.length && isTokenFormatSplitted(token.type)
);
