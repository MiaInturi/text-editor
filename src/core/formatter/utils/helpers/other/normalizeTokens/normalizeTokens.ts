import { filterEmpty } from '~core/formatter/utils/helpers/other/normalizeTokens/filterEmpty/filterEmpty';
import { joinSimilar } from '~core/formatter/utils/helpers/other/normalizeTokens/joinSimilar/joinSimilar';

export const normalizeTokens = (tokens: Token[]): Token[] => (
  joinSimilar(filterEmpty(tokens))
);
