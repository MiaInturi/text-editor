import { cloneToken } from '@core/model/utils/helpers/shared';
import { TOKEN_FORMAT } from '@core/model/utils/constants';

describe('\'cloneToken\' helper', () => {
  test('Cloned not formattable token should not be equal by link', () => {
    const token: Token = { type: 'newline', value: '\n' };
    const clonedToken = cloneToken(token);

    expect(token === clonedToken).toBe(false);

    expect(token.type).toEqual(clonedToken.type);
    expect(token.value).toEqual(clonedToken.value);
  });

  test('Cloned formattable token and formats should not be equal by link', () => {
    const token: Token = { type: 'text', value: 'text', formats: [TOKEN_FORMAT.BOLD] };
    const clonedToken = cloneToken(token);

    expect(token === clonedToken).toBe(false);
    expect(token.formats === clonedToken.formats).toBe(false);

    expect(token.type).toEqual(clonedToken.type);
    expect(token.value).toEqual(clonedToken.value);
    expect(token.formats).toStrictEqual(clonedToken.formats);
  });
});
