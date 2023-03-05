import { Parser } from '@core/parser/parser';
import { parseText } from './text';

describe('Text parsing: consuming symbols', () => {
  test('Should always return true independent of consuming status', () => {
    const parser = Parser.create('');
    expect(parseText(parser)).toBe(true);
  });
});

describe('Text parsing: add token and change parser position', () => {
  test('Should not add text token independent of consuming status', () => {
    const parser = Parser.create('T');

    parseText(parser);

    expect(parser.getTokens()).toStrictEqual([]);
  });

  test('Should change parser position', () => {
    const parser = Parser.create('Text');
    const parserPositionBeforeParse = parser.tell();

    parseText(parser);

    expect(parser.tell()).not.toBe(parserPositionBeforeParse);
  });

  test('Should toggle to true isTextConsuming flag', () => {
    const parser = Parser.create('Text');

    parseText(parser);

    expect(parser.isTextConsuming()).toBe(true);
  });
});
