import { TOKEN_FORMAT, TOKEN_TYPE } from '~core/model/utils/constants';
import { cloneToken } from '~core/model/utils/helpers/other';

describe('\'cloneToken\' helper', () => {
  test('Should deep clone token', () => {
    const token: Token = { type: TOKEN_TYPE.TEXT, value: 'text', formats: new Set([TOKEN_FORMAT.BOLD]) };
    const clonedToken: Token = cloneToken(token);

    expect(token).toStrictEqual(clonedToken);
    expect(token === clonedToken).toBe(false);
    expect(token.formats === clonedToken.formats).toBe(false);
  });
});
