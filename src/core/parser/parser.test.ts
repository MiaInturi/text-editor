import { Model } from '@core/model/model';
import { Parser } from '@core/parser/parser';

describe('Parser class: constructor', () => {
  test('Parser with initial tokens should not be in consuming status if last token not text', () => {
    const parser = Parser.create('text', [Model.CreateNewLineToken('\n')]);
    expect(parser.getConsumeTextStatus().isTextConsuming).toBe(false);
  });

  test('Parser with initial tokens should be in consuming status if last token a text', () => {
    const parser = Parser.create('text', [Model.CreateTextToken('text')]);
    expect(parser.getConsumeTextStatus().isTextConsuming).toBe(true);
  });
});

describe('Parser class: consuming one symbol', () => {
  test('Should return false if next symbol does not exists', () => {
    const parser = Parser.create('');
    expect(parser.consumeSpecialSymbol(0)).toBe(false);
  });
  
  test('Should return true for matched number format code point', () => {
    const parser = Parser.create('\n');
    expect(parser.consumeSpecialSymbol('\n'.codePointAt(0)!)).toBe(true);
  });
  
  test('Should return false for not matched number format code point', () => {
    const parser = Parser.create('\n');
    expect(parser.consumeSpecialSymbol('\r'.codePointAt(0)!)).toBe(false);
  });
  
  test('Should return true for matched function format code point', () => {
    const parser = Parser.create('\n');
    const matchFunction = (codePoint: CodePoint): boolean => codePoint === '\n'.codePointAt(0);
    expect(parser.consumeSpecialSymbol(matchFunction)).toBe(true);
  });

  test('Should return false for not matched function format code point', () => {
    const parser = Parser.create('\n');
    const matchFunction = (codePoint: CodePoint): boolean => codePoint === '\r'.codePointAt(0);
    expect(parser.consumeSpecialSymbol(matchFunction)).toBe(false);
  });
});

describe('Parser class: consuming while symbols', () => {
  test('Should return true if at least one symbol was consumed by number format code point', () => {
    const parser = Parser.create('\n\r');
    expect(parser.consumeSpecialSymbolWhile('\n'.codePointAt(0)!)).toBe(true);
  });

  test('Should return false if no symbols was consumed by number format code point', () => {
    const parser = Parser.create('\n\r');
    expect(parser.consumeSpecialSymbolWhile('\r'.codePointAt(0)!)).toBe(false);
  });
});

describe('Parser class: consuming text', () => {
  test('Should set to true isTextConsuming flag if consuming successful', () => {
    const parser = Parser.create('text');
    parser.consumeText();
    expect(parser.getConsumeTextStatus().isTextConsuming).toBe(true);
  });

  test('Should not set isTextConsuming flag if consuming failure', () => {
    const parser = Parser.create('');
    parser.consumeText();
    expect(parser.getConsumeTextStatus().isTextConsuming).toBe(false);
  });
});

describe('Parser class: push tokens', () => {
  test('Should flush text token before push if text is consuming', () => {
    const parser = Parser.create('', [Model.CreateTextToken('text')]);
    parser.pushToken(Model.CreateNewLineToken('\n'));
    expect(parser.getTokens()).toStrictEqual([Model.CreateTextToken('text'), Model.CreateNewLineToken('\n')]);
  });
});
