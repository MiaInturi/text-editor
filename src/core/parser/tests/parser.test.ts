import { parse } from '../index';

describe('parse function', () => {
  test('Text only with common symbols', () => {
    const text = 'Hello World: 你好世界';
    const expectedTokens: Token[] = [
      {
        type: 'text',
        format: 'default',
        value: 'Hello World: 你好世界'
      }
    ];

    expect(parse(text)).toStrictEqual(expectedTokens);
  });

  test('Text only with new line symbols', () => {
    const text = '\n\r\r\n\n';
    const expectedTokens: Token[] = [
      {
        type: 'newline',
        format: 'default',
        value: '\n'
      },
      {
        type: 'newline',
        format: 'default',
        value: '\r'
      },
      {
        type: 'newline',
        format: 'default',
        value: '\r\n'
      },
      {
        type: 'newline',
        format: 'default',
        value: '\n'
      }
    ];

    expect(parse(text)).toStrictEqual(expectedTokens);
  });

  test('Text with common and new line symbols', () => {
    const text = 'Hello\n\rWorld:\r\n你好世界\n';
    const expectedTokens: Token[] = [
      {
        type: 'text',
        format: 'default',
        value: 'Hello'
      },
      {
        type: 'newline',
        format: 'default',
        value: '\n'
      },
      {
        type: 'newline',
        format: 'default',
        value: '\r'
      },
      {
        type: 'text',
        format: 'default',
        value: 'World:'
      },
      {
        type: 'newline',
        format: 'default',
        value: '\r\n'
      },
      {
        type: 'text',
        format: 'default',
        value: '你好世界'
      },
      {
        type: 'newline',
        format: 'default',
        value: '\n'
      }
    ];

    expect(parse(text)).toStrictEqual(expectedTokens);
  });
});
