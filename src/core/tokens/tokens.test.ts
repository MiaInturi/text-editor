import { Tokens } from './tokens';

describe('Tokens class: creating tokens', () => {
  test('Create Text Token without formats', () => {
    const text = 'text';
    const textToken = Tokens.CreateTextToken(text);
    const expectedTextToken: TextToken = {
      type: 'text',
      value: text
    };
    expect(textToken).toStrictEqual(expectedTextToken);
  });

  test('Create Text Token with formats', () => {
    const text = 'text';
    const formats: TokenFormat[] = ['bold', 'italic'];
    const textToken = Tokens.CreateTextToken(text, formats);
    const expectedTextToken: TextToken = {
      type: 'text',
      value: text,
      formats
    };
    expect(textToken).toStrictEqual(expectedTextToken);
  });

  test('Create NewLine Token without formats', () => {
    const newLine = '\n';
    const newLineToken = Tokens.CreateNewLineToken(newLine);
    const expectedNewLineToken: NewLineToken = {
      type: 'newline',
      value: newLine
    };
    expect(newLineToken).toStrictEqual(expectedNewLineToken);
  });

  test('Create HashTag Token without formats', () => {
    const hashTag = '#hashtag';
    const hashTagToken = Tokens.CreateHashTagToken(hashTag);
    const expectedHashTagToken: HashTagToken = {
      type: 'hashtag',
      value: hashTag
    };
    expect(hashTagToken).toStrictEqual(expectedHashTagToken);
  });

  test('Create HashTag Token with formats', () => {
    const hashTag = '#hashtag';
    const formats: TokenFormat[] = ['bold', 'italic'];
    const hashTagToken = Tokens.CreateHashTagToken(hashTag, formats);
    const expectedHashTagToken: HashTagToken = {
      type: 'hashtag',
      value: hashTag,
      formats
    };
    expect(hashTagToken).toStrictEqual(expectedHashTagToken);
  });
});
