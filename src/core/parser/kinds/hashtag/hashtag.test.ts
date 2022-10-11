import { Model } from '@core/model/model';
import { Parser } from '@core/parser/parser';
import { parseHashTag } from './hashtag';

describe('Hashtag parse', () => {
  test('Failed parse hashtag when text does not has it', () => {
    const model = new Model();
    const text = 'Text without hashtags';
    const parser = new Parser(model, text);
    expect(parseHashTag(parser, model)).toBe(false);
  });

  test('Hashtag not be parsed if it without name', () => {
    const model = new Model();
    const text = '#';
    const parser = new Parser(model, text);
    expect(parseHashTag(parser, model)).toBe(false);
  });

  test('Successful parse hashtag', () => {
    const model = new Model();
    const text = '#TextWithHashtag';
    const parser = new Parser(model, text);
    const expectedTokens: Token[] = [Model.CreateHashTagToken('#TextWithHashtag')];

    expect(parseHashTag(parser, model)).toBe(true);
    expect(model.getTokens()).toStrictEqual(expectedTokens);
  });

  test('Successful parse more than one hashtags in a row', () => {
    const model = new Model();
    const text = '#Text#WithTwoHashtags';
    const parser = new Parser(model, text);
    const expectedTokens: Token[] = [Model.CreateHashTagToken('#Text'), Model.CreateHashTagToken('#WithTwoHashtags')];

    expect(parseHashTag(parser, model)).toBe(true);
    expect(parseHashTag(parser, model)).toBe(true);
    expect(model.getTokens()).toStrictEqual(expectedTokens);
  });
});
