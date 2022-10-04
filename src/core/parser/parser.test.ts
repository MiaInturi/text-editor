import { Parser } from './parser';

describe('Parser class: constructor, tell, seek', () => {
  test('Constructor throws error if position greater than text length', () => {
    expect(() => new Parser('', 3000)).toThrow(Error);
  });

  test('Constructor without position argument sets it to 0', () => {
    const text = 'text';
    const parser = new Parser(text);
    expect(parser.tell()).toEqual(0);
  });

  test('Constructor correctly sets non-zero position', () => {
    const text = 'text';
    const position = 1;
    const parser = new Parser(text, position);
    expect(parser.tell()).toEqual(position);
  });

  test('"seek" throws error if position greater than text length', () => {
    const parser = new Parser('');
    expect(() => parser.seek(3000)).toThrow(Error);
  });

  test('"seek" correctly sets position', () => {
    const text = 'text';
    const position = 1;
    const parser = new Parser(text);
    parser.seek(position);
    expect(parser.tell()).toEqual(position);
  });
});

describe('Parser class: add, get, flush tokens', () => {
  test('"flush" does not add tokens if text is not consuming', () => {
    const text = 'text';
    const parser = new Parser(text);
    parser.flushTokens();
    expect(parser.getTokens()).toStrictEqual([]);
  });

  test('"flush" correctly add text token if text is consuming', () => {
    const text = 'text';
    const parser = new Parser('text');
    const expectedTokens: Token[] = [
      {
        type: 'text',
        value: text.substring(0, 1)
      }
    ];

    parser.consumeText();
    parser.flushTokens();
    expect(parser.getTokens()).toStrictEqual(expectedTokens);
  });

  test('Text token flush before add new token', () => {
    const text = 'text';
    const parser = new Parser(text);
    const tokenForAdd: Token = {
      type: 'hashtag',
      value: '#hashtag'
    };
    const expectedTokens: Token[] = [
      {
        type: 'text',
        value: text.substring(0, 1)
      },
      {
        type: 'hashtag',
        value: '#hashtag'
      }
    ];

    parser.consumeText();
    parser.addToken(tokenForAdd);
    expect(parser.getTokens()).toStrictEqual(expectedTokens);
  });
});

describe('Parser class: consuming special symbols', () => {
  test('"consumeSpecialSymbol" failed if parser position in the end of a text', () => {
    const text = 'text';
    const textFirstSymbolCodePointMatch = text.codePointAt(0)!;
    const parser = new Parser(text, text.length);

    expect(parser.consumeSpecialSymbol(textFirstSymbolCodePointMatch)).toBe(false);
    expect(parser.tell()).toEqual(text.length);
  });

  test('"consumeSpecialSymbol" failed if argument and next symbol does not have match', () => {
    const text = 'text';
    const textSecondSymbolCodePointMatch = text.codePointAt(1)!;
    const textSecondSymbolCodePointMatchFn: ConsumeMatchFunction = (codePoint) => (
      codePoint === textSecondSymbolCodePointMatch
    );
    const parser = new Parser(text);

    expect(parser.consumeSpecialSymbol(textSecondSymbolCodePointMatch)).toBe(false);
    expect(parser.consumeSpecialSymbol(textSecondSymbolCodePointMatchFn)).toBe(false);
    expect(parser.tell()).toEqual(0);
  });

  test('"consumeSpecialSymbol" works successfully if argument and next symbol have match', () => {
    const text = 'text';
    const textFirstSymbolCodePointMatch = text.codePointAt(0)!;
    const textFirstSymbolCodePointMatchFn: ConsumeMatchFunction = (codePoint) => (
      codePoint === textFirstSymbolCodePointMatch
    );
    const parserForCodePointArg = new Parser(text);
    const parserForFnArg = new Parser(text);

    expect(parserForCodePointArg.consumeSpecialSymbol(textFirstSymbolCodePointMatch)).toBe(true);
    expect(parserForCodePointArg.tell()).toEqual(1);
    expect(parserForFnArg.consumeSpecialSymbol(textFirstSymbolCodePointMatchFn)).toBe(true);
    expect(parserForFnArg.tell()).toEqual(1);
  });

  test('"consumeSpecialSymbolWhile" failed if no symbols was consumed', () => {
    const text = 'text';
    const textFirstSymbolCodePointMatch = text.codePointAt(0)!;
    const parser = new Parser(text, text.length);

    expect(parser.consumeSpecialSymbolWhile(textFirstSymbolCodePointMatch)).toBe(false);
    expect(parser.tell()).toEqual(text.length);
  });

  test('"consumeSpecialSymbolWhile" works successfully if at least one symbols was consumed', () => {
    const text = 'text';
    const textFirstSymbolCodePointMatch = text.codePointAt(0)!;
    const textFirstSymbolCodePointMatchFn: ConsumeMatchFunction = (codePoint) => (
      codePoint === textFirstSymbolCodePointMatch
    );
    const parserForCodePointArg = new Parser(text);
    const parserForFnArg = new Parser(text);

    expect(parserForCodePointArg.consumeSpecialSymbolWhile(textFirstSymbolCodePointMatch)).toBe(true);
    expect(parserForCodePointArg.tell()).toEqual(1);
    expect(parserForFnArg.consumeSpecialSymbolWhile(textFirstSymbolCodePointMatchFn)).toBe(true);
    expect(parserForFnArg.tell()).toEqual(1);
  });
});

describe('Parser class: text word bound check', () => {
  test('"isTextWordBound" returns "true" if parser in the beginning of a text', () => {
    const text = 'text';
    const parser = new Parser(text);
    expect(parser.isTextWordBound()).toBe(true);
  });

  test('"isTextWordBound" returns "false" if parser is consuming text and prev symbol is not delimiter', () => {
    const text = 'text';
    const parser = new Parser(text);
    parser.consumeText();
    expect(parser.isTextWordBound()).toBe(false);
  });

  test('"isTextWordBound" returns "true" if parser is consuming text and prev symbol is delimiter', () => {
    const text = ' text with delimiter';
    const parser = new Parser(text);
    parser.consumeText();
    expect(parser.isTextWordBound()).toBe(true);
  });

  test('"isTextWordBound" returns "false" if text not consuming and last pushed token is not "newline"', () => {
    const text = 'text';
    const parser = new Parser(text, text.length);
    parser.addToken({ type: 'hashtag', value: '#hashtag' });
    expect(parser.isTextWordBound()).toBe(false);
  });

  test('"isTextWordBound" returns "true" if text not consuming and last pushed token is "newline"', () => {
    const text = 'text';
    const parser = new Parser(text);
    parser.addToken({ type: 'newline', value: '\n' });
    expect(parser.isTextWordBound()).toBe(true);
  });
});

describe('Parser class: consuming text', () => {
  test('"consumeText" does not trigger consuming if parser position cannot be increased', () => {
    const text = 'text';
    const parser = new Parser(text, text.length);
    parser.consumeText();
    expect(parser.isTextConsuming()).toBe(false);
  });

  test('"consumeText" trigger consuming if parser position can be increased', () => {
    const text = 'text';
    const parser = new Parser(text);
    parser.consumeText();
    expect(parser.isTextConsuming()).toBe(true);
  });
});
