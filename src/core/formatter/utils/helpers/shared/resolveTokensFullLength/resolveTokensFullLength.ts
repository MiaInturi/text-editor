export const resolveTokensFullLength = (tokens: Token[]): number => (
  tokens.reduce((acc, token) => acc + token.value.length, 0)
);
