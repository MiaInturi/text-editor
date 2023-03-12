import { isTokenFormattable } from '~core/formatter/utils/helpers/format';

export const cloneToken = <T extends Token>(token: T): T => {
  return isTokenFormattable(token) ? { ...token, formats: new Set(token.formats) } : { ...token };
};
