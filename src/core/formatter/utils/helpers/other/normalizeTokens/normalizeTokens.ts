import { joinSimilar } from '@core/formatter/utils/helpers/other/normalizeTokens/joinSimilar/joinSimilar';
import { filterEmpty } from '@core/formatter/utils/helpers/other/normalizeTokens/filterEmpty/filterEmpty';

export const normalizeTokens = (tokens: Token[]): Token[] => (
  joinSimilar(filterEmpty(tokens))
);
