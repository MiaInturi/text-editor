import { Model } from '@core/model/model';
import { Parser } from '@core/parser/parser';
import { parseHashTag } from './hashtag';

describe('Hashtag parse', () => {
  test('Failed parse hashtag when text does not has it', () => {
    const text = 'Text without hashtags';
    const parser = Parser.create(text);
    expect(parseHashTag(parser)).toBe(false);
  });

  test('Hashtag not be parsed if it without name', () => {
    const text = '#';
    const parser = Parser.create(text);
    expect(parseHashTag(parser)).toBe(false);
  });

  test('Successful parse hashtag', () => {
    const text = '#TextWithHashtag';
    const parser = Parser.create(text);
    const expectedTokens: Token[] = [Model.CreateHashTagToken('#TextWithHashtag')];

    expect(parseHashTag(parser)).toBe(true);
    expect(parser.getTokens()).toStrictEqual(expectedTokens);
  });

  test('Successful parse more than one hashtags in a row', () => {
    const text = '#Text#WithTwoHashtags';
    const parser = Parser.create(text);
    const expectedTokens: Token[] = [
      Model.CreateHashTagToken('#Text'),
      Model.CreateHashTagToken('#WithTwoHashtags')
    ];

    expect(parseHashTag(parser)).toBe(true);
    expect(parseHashTag(parser)).toBe(true);
    expect(parser.getTokens()).toStrictEqual(expectedTokens);
  });
});
