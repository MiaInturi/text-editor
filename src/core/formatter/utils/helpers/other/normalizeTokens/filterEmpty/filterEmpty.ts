export const filterEmpty = (tokens: Token[]): Token[] => (
  tokens.filter(({ value }) => value)
);
