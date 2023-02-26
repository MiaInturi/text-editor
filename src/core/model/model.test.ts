import { Model } from './model';
import { TOKEN_FORMAT, TOKEN_TYPE } from '@core/model/utils/constants';

describe('Model class: creating tokens', () => {
  test('Should create text token with/without format', () => {
    const value = 'text';
    const formats = new Set([TOKEN_FORMAT.BOLD]);

    const expectedTokenWithoutFormats: Token = { type: TOKEN_TYPE.TEXT, value, formats: new Set() };
    const expectedTokenWithFormats: Token = { type: TOKEN_TYPE.TEXT, value, formats };

    expect(Model.CreateTextToken(value)).toStrictEqual(expectedTokenWithoutFormats);
    expect(Model.CreateTextToken(value, formats)).toStrictEqual(expectedTokenWithFormats);
  });

  test('Should create text token new line token', () => {
    const value = '\r\n';
    const expectedToken: Token = { type: TOKEN_TYPE.NEWLINE, value };
    expect(Model.CreateNewLineToken(value)).toStrictEqual(expectedToken);
  });

  test('Should create hashtag token with/without format', () => {
    const value = '#hashtag';
    const formats = new Set([TOKEN_FORMAT.BOLD]);

    const expectedTokenWithoutFormats: Token = { type: TOKEN_TYPE.HASHTAG, value, formats: new Set() };
    const expectedTokenWithFormats: Token = { type: TOKEN_TYPE.HASHTAG, value, formats };

    expect(Model.CreateHashTagToken(value)).toStrictEqual(expectedTokenWithoutFormats);
    expect(Model.CreateHashTagToken(value, formats)).toStrictEqual(expectedTokenWithFormats);
  });
});
