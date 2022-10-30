import { TOKEN_TYPE } from '@core/model/utils/constants';

export const isTokenSplittable = (token: Token): boolean => (
  token.type === TOKEN_TYPE.TEXT
);
