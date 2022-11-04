import { cloneToken } from '@core/model/utils/helpers/shared';

export const splitTokenByPosition = (token: Token, position: Position): [Token, Token] => {
  const beforePositionToken: Token = { ...cloneToken(token), value: token.value.slice(0, position) };
  const afterPositionToken: Token = { ...cloneToken(token), value: token.value.slice(position) };
  return [beforePositionToken, afterPositionToken];
};
