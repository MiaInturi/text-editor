import { applyFormatToToken } from '@core/formatter/utils/helpers/format';
import { TOKEN_FORMAT } from '@core/model/utils/constants';

describe('\'applyFormatToToken\' helper', () => {
  test('Correctly add format to token', () => {
    const format: TokenFormat = TOKEN_FORMAT.BOLD;
    const token: Token = { type: 'text', value: 'text', formats: [] };

    const expectedToken: Token = { type: 'text', value: 'text', formats: [format] };
    expect(applyFormatToToken(token, format)).toStrictEqual(expectedToken);
  });

  test('Does not add format to token if it already has that format', () => {
    const format: TokenFormat = TOKEN_FORMAT.BOLD;
    const token: Token = { type: 'text', value: 'text', formats: [format] };

    const expectedToken: Token = { type: 'text', value: 'text', formats: [format] };
    expect(applyFormatToToken(token, format)).toStrictEqual(expectedToken);
  });

  test('Correctly delete format from token', () => {
    const format: TokenFormat = TOKEN_FORMAT.BOLD;
    const token: Token = { type: 'text', value: 'text', formats: [format] };

    const expectedToken: Token = { type: 'text', value: 'text', formats: [] };
    expect(applyFormatToToken(token, format, true)).toStrictEqual(expectedToken);
  });

  test('Does not delete format from token if it has not that format', () => {
    const format: TokenFormat = TOKEN_FORMAT.ITALIC;
    const token: Token = { type: 'text', value: 'text', formats: [TOKEN_FORMAT.BOLD] };

    const expectedToken: Token = { type: 'text', value: 'text', formats: [TOKEN_FORMAT.BOLD] };
    expect(applyFormatToToken(token, format, true)).toStrictEqual(expectedToken);
  });
});
