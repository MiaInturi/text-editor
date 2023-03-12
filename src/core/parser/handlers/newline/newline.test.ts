import { Model } from '~core/model/model';
import { Parser } from '~core/parser/parser';
import { parseNewLine } from './newline';

describe('Newline parsing: consuming symbols', () => {
  test('Should parse allowed newline symbols', () => {
    const parser = Parser.create('\r\r\n\n');
    expect(parseNewLine(parser)).toBe(true);
    expect(parseNewLine(parser)).toBe(true);
    expect(parseNewLine(parser)).toBe(true);
  });

  test('Should not parse not allowed symbols', () => {
    const parser = Parser.create('TextWithoutNewline');
    expect(parseNewLine(parser)).toBe(false);
  });
});

describe('Newline parsing: add token', () => {
  test('Should add token if consuming successful', () => {
    const parser = Parser.create('\n');
    const expectedTokens: Token[] = [Model.CreateNewLineToken('\n')];

    parseNewLine(parser);

    expect(parser.getTokens()).toStrictEqual(expectedTokens);
  });

  test('Should not add token if consuming failure', () => {
    const parser = Parser.create('TextWithoutNewline');

    parseNewLine(parser);

    expect(parser.getTokens()).toStrictEqual([]);
  });
});
