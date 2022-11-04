import { Model } from '@core/model/model';
import { Parser } from '@core/parser/parser';

describe('Parser class: parse', function () {
  test('Empty text parsing should return empty tokens', () => {
    const text = '';
    const expectedTokens: Token[] = [];
    expect(Parser.parse(text)).toStrictEqual(expectedTokens);
  });

  test('All kinds of newlines should parse correctly', () => {
    const text = 'common text \r\n\n\r';
    const expectedTokens: Token[] = [
      Model.CreateTextToken('common text '),
      Model.CreateNewLineToken('\r\n'),
      Model.CreateNewLineToken('\n'),
      Model.CreateNewLineToken('\r')
    ];
    expect(Parser.parse(text)).toStrictEqual(expectedTokens);
  });

  test('Hashtag should parsed separated from other words', () => {
    const text = 'common#text\n#hashtag1#hashtag2';
    const expectedTokens: Token[] = [
      Model.CreateTextToken('common#text'),
      Model.CreateNewLineToken('\n'),
      Model.CreateHashTagToken('#hashtag1'),
      Model.CreateHashTagToken('#hashtag2')
    ];
    expect(Parser.parse(text)).toStrictEqual(expectedTokens);
  });

  test('Standalone hashtag symbol should be a common text', () => {
    const text = '#';
    const expectedTokens: Token[] = [Model.CreateTextToken('#')];
    expect(Parser.parse(text)).toStrictEqual(expectedTokens);
  });
});
