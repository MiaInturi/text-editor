import { Model } from '@core/model/model';
import { Parser } from '@core/parser/parser';
import { parseHashTag } from './hashtag';

describe('Hashtag parsing: consuming symbols', () => {
  test('Should parse hashtag at the beginning of text', () => {
    const parser = Parser.create('#TextWithHashtag');
    expect(parseHashTag(parser)).toBe(true);
  });

  test('Should parse hashtag after delimiter (space, tab, etc.)', () => {
    const parser = Parser.create('#TextWithHashtag', [Model.CreateTextToken('TextWithDelimiter ')]);
    expect(parseHashTag(parser)).toBe(true);
  });

  test('Should parse hashtag after newline', () => {
    const parser = Parser.create('#TextWithHashtag', [Model.CreateNewLineToken('\n')]);
    expect(parseHashTag(parser)).toBe(true);
  });

  test('Should parse hashtags in row', () => {
    const parser = Parser.create('#TextWithHashtag', [Model.CreateHashTagToken('#TextWithHashtag')]);
    expect(parseHashTag(parser)).toBe(true);
  });

  test('Should not parse standalone hashtag', () => {
    const parser = Parser.create('#');
    expect(parseHashTag(parser)).toBe(false);
  });

  test('Should not parse hashtag in the middle of a word', () => {
    const parser = Parser.create('#TextWithHashtag', [Model.CreateTextToken('TextWithoutDelimiter')]);
    expect(parseHashTag(parser)).toBe(false);
  });
});

describe('Hashtag parsing: add token and change parser position', () => {
  test('Should add hashtag token if consuming successful', () => {
    const parser = Parser.create('#TextWithHashtag');
    const expectedTokens: Token[] = [Model.CreateHashTagToken('#TextWithHashtag')];

    parseHashTag(parser);

    expect(parser.getTokens()).toStrictEqual(expectedTokens);
  });

  test('Should not add hashtag token if consuming failure', () => {
    const parser = Parser.create('TextWithoutHashtag');

    parseHashTag(parser);

    expect(parser.getTokens()).toStrictEqual([]);
  });

  test('Should change parser position if consuming successful', () => {
    const parser = Parser.create('#TextWithHashtag');
    const parserPositionBeforeParse = parser.tell();

    parseHashTag(parser);

    expect(parser.tell()).not.toBe(parserPositionBeforeParse);
  });

  test('Should not change parser position if consuming failure', () => {
    const parser = Parser.create('TextWithoutHashtag');
    const parserPositionBeforeParse = parser.tell();

    parseHashTag(parser);

    expect(parser.tell()).toBe(parserPositionBeforeParse);
  });
});
