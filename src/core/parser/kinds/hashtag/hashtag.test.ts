import { Parser } from '../../parser';
import { parseHashTag } from './hashtag';

describe('Hashtag parse', () => {
  test('Failed parse hashtag when text does not has it', () => {
    const text = 'Text without hashtags';
    const parser = new Parser(text);
    expect(parseHashTag(parser)).toBe(false);
  });

  test('Hashtag not be parsed if it present without name', () => {
    const text = '#';
    const parser = new Parser(text);
    expect(parseHashTag(parser)).toBe(false);
  });

  test('Successful parse hashtag', () => {
    const text = '#TextWithHashtag';
    const parser = new Parser(text);
    const expectedTokens: Token[] = [
      {
        type: 'hashtag',
        format: 'default',
        value: '#TextWithHashtag'
      }
    ];

    expect(parseHashTag(parser)).toBe(true);
    expect(parser.getTokens()).toStrictEqual(expectedTokens);
  });

  test('Successful parse more than one hashtags in a row', () => {
    const text = '#Text#WithTwoHashtags';
    const parser = new Parser(text);
    const expectedTokens: Token[] = [
      {
        type: 'hashtag',
        format: 'default',
        value: '#Text'
      },
      {
        type: 'hashtag',
        format: 'default',
        value: '#WithTwoHashtags'
      }
    ];

    expect(parseHashTag(parser)).toBe(true);
    expect(parseHashTag(parser)).toBe(true);
    expect(parser.getTokens()).toStrictEqual(expectedTokens);
  });
});
