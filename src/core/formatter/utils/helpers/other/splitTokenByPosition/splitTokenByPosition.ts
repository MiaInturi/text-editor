import { cloneToken } from '~core/model/utils/helpers/other';

export const splitTokenByPosition = <T extends Token>(token: T, position: Position): [Token, Token] => {
  const beforePositionToken = { ...cloneToken(token), value: token.value.slice(0, position) };
  const afterPositionToken = { ...cloneToken(token), value: token.value.slice(position) };
  return [beforePositionToken, afterPositionToken];
};
