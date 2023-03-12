import { applyFormatToToken } from '~core/formatter/utils/helpers/format';
import { TOKEN_FORMAT, TOKEN_TYPE } from '~core/model/utils/constants';

describe('\'applyFormatToToken\' helper', () => {
  test('Should add format to token if it does not contain it', () => {
    const token: Token = { type: TOKEN_TYPE.TEXT, value: 'text', formats: new Set() };
    const expectedToken: Token = { ...token, formats: new Set([TOKEN_FORMAT.BOLD]) };
    expect(applyFormatToToken(token, TOKEN_FORMAT.BOLD)).toStrictEqual(expectedToken);
  });

  test('Should not add format to token if it already has it', () => {
    const token: Token = { type: TOKEN_TYPE.TEXT, value: 'text', formats: new Set([TOKEN_FORMAT.BOLD]) };
    const expectedToken: Token = { ...token, formats: new Set([TOKEN_FORMAT.BOLD]) };
    expect(applyFormatToToken(token, TOKEN_FORMAT.BOLD)).toStrictEqual(expectedToken);
  });

  test('Should delete format from token if \'deleteFormat=true\'', () => {
    const token: Token = { type: TOKEN_TYPE.TEXT, value: 'text', formats: new Set([TOKEN_FORMAT.BOLD]) };
    const expectedToken: Token = { ...token, formats: new Set() };
    expect(applyFormatToToken(token, TOKEN_FORMAT.BOLD, true)).toStrictEqual(expectedToken);
  });
});
