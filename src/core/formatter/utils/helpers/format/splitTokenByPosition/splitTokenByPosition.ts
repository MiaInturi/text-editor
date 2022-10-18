export const splitTokenByPosition = (token: Token, position: Position): [Token, Token] => {
  const beforePositionToken: Token = { ...token, value: token.value.slice(0, position) };
  const afterPositionToken: Token = { ...token, value: token.value.slice(position) };
  return [beforePositionToken, afterPositionToken];
};
