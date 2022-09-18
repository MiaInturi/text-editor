import { Parser } from './parser';

describe('Parser class: "tell", "seek" methods', () => {
  test('"tell" return correct position', () => {
    const examplePosition = 3000;
    const parser = new Parser('', examplePosition);

    expect(parser.tell()).toBe(examplePosition);
  });

  test('"seek" correctly set position', () => {
    const parser = new Parser('');
    const examplePosition = 3000;
    parser.seek(examplePosition);

    expect(parser.tell()).toBe(examplePosition);
  });
});

describe('Parser class: "flush", "push" methods', () => {
  test('"flush" does not add token if text pending process not running', () => {
    const parser = new Parser('');
    parser.flushTokens();

    expect(parser.getTokens()).toHaveLength(0);
  });

  test('"flush" add token if text pending process is running', () => {
    const text = 'Hello\nWorld\n';
    const parser = new Parser(text);
    const expectedTokens: Token[] = [
      {
        type: 'text',
        format: 'default',
        value: 'H'
      }
    ];

    parser.consumeText();
    parser.flushTokens();

    expect(parser.getTokens()).toStrictEqual(expectedTokens);
  });

  test('"push" add token', () => {
    const parser = new Parser('');
    const token: TextToken = { type: 'text', format: 'default', value: 'value' };
    const expectedTokens: Token[] = [token];
    parser.addToken(token);

    expect(parser.getTokens()).toStrictEqual(expectedTokens);
  });

  test('"push" flushed text before add token', () => {
    const text = 'Hello\nWorld\n';
    const parser = new Parser(text);
    const token: NewLineToken = { type: 'newline', format: 'default', value: '\n' };
    const expectedTokens: Token[] = [
      {
        type: 'text',
        format: 'default',
        value: 'H'
      },
      token
    ];

    parser.consumeText();
    parser.addToken(token);

    expect(parser.getTokens()).toStrictEqual(expectedTokens);
  });
});

describe('Parser class: "consume", "consumeWhile" methods', () => {
  test('"consume" by code point', () => {
    const symbolCodePoint = 'H'.codePointAt(0) as CodePoint;

    const succeedConsumeText = 'Hello';
    const succeedParser = new Parser(succeedConsumeText);

    const failedConsumeText = 'World';
    const failedParser = new Parser(failedConsumeText);

    expect(succeedParser.consume(symbolCodePoint)).toBe(true);
    expect(succeedParser.tell()).toBe(1);
    expect(failedParser.consume(symbolCodePoint)).toBe(false);
    expect(failedParser.tell()).toBe(0);
  });

  test('"consume" by function', () => {
    const consumeMatchFunction: ConsumeMatchFunction = (codePoint) => (
      String.fromCodePoint(codePoint) === 'H'
    );

    const succeedConsumeText = 'Hello';
    const succeedParser = new Parser(succeedConsumeText);

    const failedConsumeText = 'World';
    const failedParser = new Parser(failedConsumeText);

    expect(succeedParser.consume(consumeMatchFunction)).toBe(true);
    expect(succeedParser.tell()).toBe(1);
    expect(failedParser.consume(consumeMatchFunction)).toBe(false);
    expect(failedParser.tell()).toBe(0);
  });

  test('"consumeWhile" by code point', () => {
    const symbolCodePoint = '\n'.codePointAt(0) as CodePoint;

    const succeedConsumeWhileText = '\n\n\n';
    const succeedParser = new Parser(succeedConsumeWhileText);

    const failedConsumeWhileText = '\r\n\r\n';
    const failedParser = new Parser(failedConsumeWhileText);

    expect(succeedParser.consumeWhile(symbolCodePoint)).toBe(true);
    expect(succeedParser.tell()).toBe(succeedConsumeWhileText.length);
    expect(failedParser.consumeWhile(symbolCodePoint)).toBe(false);
    expect(failedParser.tell()).toBe(0);
  });

  test('"consumeWhile" by function', () => {
    const consumeMatchFunction: ConsumeMatchFunction = (codePoint) => (
      String.fromCodePoint(codePoint) === '\n'
    );

    const succeedConsumeWhileText = '\n\n\n';
    const succeedParser = new Parser(succeedConsumeWhileText);

    const failedConsumeWhileText = '\r\n\r\n';
    const failedParser = new Parser(failedConsumeWhileText);

    expect(succeedParser.consumeWhile(consumeMatchFunction)).toBe(true);
    expect(succeedParser.tell()).toBe(succeedConsumeWhileText.length);
    expect(failedParser.consumeWhile(consumeMatchFunction)).toBe(false);
    expect(failedParser.tell()).toBe(0);
  });
});

describe('Parser class: "consumeText", "parse" method', () => {
  test('"consumeText" get first symbol from position', () => {
    const text = 'Hello\nWorld\n';
    const parser = new Parser(text);
    const expectedTokens: Token[] = [
      {
        type: 'text',
        format: 'default',
        value: 'H'
      }
    ];

    parser.consumeText();
    parser.flushTokens();

    expect(parser.getTokens()).toStrictEqual(expectedTokens);
  });


  test('"parse" text only with common symbols', () => {
    const text = 'Hello World: 你好世界';
    const parser = new Parser(text);
    const expectedTokens: Token[] = [
      {
        type: 'text',
        format: 'default',
        value: 'Hello World: 你好世界'
      }
    ];

    expect(parser.parse()).toStrictEqual(expectedTokens);
  });

  test('"parse" text only with new line symbols', () => {
    const text = '\n\r\r\n\n';
    const parser = new Parser(text);
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

    expect(parser.parse()).toStrictEqual(expectedTokens);
  });

  test('"parse" text with common and new line symbols', () => {
    const text = 'Hello\n\rWorld:\r\n你好世界\n';
    const parser = new Parser(text);
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

    expect(parser.parse()).toStrictEqual(expectedTokens);
  });
});
