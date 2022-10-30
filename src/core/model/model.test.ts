import { Model } from './model';

describe('Model class: creating tokens', () => {
  test('Create Text Token without formats', () => {
    const text = 'text';
    const textToken = Model.CreateTextToken(text);
    const expectedTextToken: TextToken = {
      type: 'text',
      value: text,
      formats: []
    };
    expect(textToken).toStrictEqual(expectedTextToken);
  });

  test('Create Text Token with formats', () => {
    const text = 'text';
    const formats: TokenFormat[] = ['bold', 'italic'];
    const textToken = Model.CreateTextToken(text, formats);
    const expectedTextToken: TextToken = {
      type: 'text',
      value: text,
      formats
    };
    expect(textToken).toStrictEqual(expectedTextToken);
  });

  test('Create NewLine Token without formats', () => {
    const newLine = '\n';
    const newLineToken = Model.CreateNewLineToken(newLine);
    const expectedNewLineToken: NewLineToken = {
      type: 'newline',
      value: newLine
    };
    expect(newLineToken).toStrictEqual(expectedNewLineToken);
  });

  test('Create HashTag Token without formats', () => {
    const hashTag = '#hashtag';
    const hashTagToken = Model.CreateHashTagToken(hashTag);
    const expectedHashTagToken: HashTagToken = {
      type: 'hashtag',
      value: hashTag,
      formats: []
    };
    expect(hashTagToken).toStrictEqual(expectedHashTagToken);
  });

  test('Create HashTag Token with formats', () => {
    const hashTag = '#hashtag';
    const formats: TokenFormat[] = ['bold', 'italic'];
    const hashTagToken = Model.CreateHashTagToken(hashTag, formats);
    const expectedHashTagToken: HashTagToken = {
      type: 'hashtag',
      value: hashTag,
      formats
    };
    expect(hashTagToken).toStrictEqual(expectedHashTagToken);
  });
});

describe('Model class: getting and setting tokens', () => {
  test('Constructor should can to get tokens array as first argument', () => {
    const modelWithoutTokens = new Model();
    expect(modelWithoutTokens.getTokens()).toStrictEqual([]);

    const tokens: Token[] = [
      Model.CreateTextToken('text'),
      Model.CreateNewLineToken('\n'),
      Model.CreateHashTagToken('#hashtag')
    ];
    const modelWithTokens = new Model(tokens);
    expect(modelWithTokens.getTokens()).toStrictEqual(tokens);
  });

  test('Get token by existed / not existed index', () => {
    const tokens: Token[] = [
      Model.CreateTextToken('text'),
      Model.CreateNewLineToken('\n'),
      Model.CreateHashTagToken('#hashtag')
    ];
    const model = new Model(tokens);

    const existedIndex = 0;
    const notExistedIndex = tokens.length;
    expect(model.getToken(existedIndex)).toStrictEqual(tokens[existedIndex]);
    expect(model.getToken(notExistedIndex)).toBeUndefined();
  });
});
