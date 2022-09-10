import { Tokens } from './tokens';

describe('Tokens class', () => {
  test('createTextToken without format', () => {
    const textToken = Tokens.createTextToken('value');
    const expectedTextToken: TextToken = {
      type: 'text',
      format: 'default',
      value: 'value'
    };

    expect(textToken).toStrictEqual(expectedTextToken);
  });

  test('createTextToken with bold format', () => {
    const textToken = Tokens.createTextToken('value', 'bold');
    const expectedTextToken: TextToken = {
      type: 'text',
      format: 'bold',
      value: 'value'
    };

    expect(textToken).toStrictEqual(expectedTextToken);
  });

  test('createTextToken with italic format', () => {
    const textToken = Tokens.createTextToken('value', 'italic');
    const expectedTextToken: TextToken = {
      type: 'text',
      format: 'italic',
      value: 'value'
    };

    expect(textToken).toStrictEqual(expectedTextToken);
  });

  test('createNewLineToken', () => {
    const newLineToken = Tokens.createNewLineToken('\n');
    const expectedNewLineToken: NewLineToken = {
      type: 'newline',
      format: 'default',
      value: '\n'
    };

    expect(newLineToken).toStrictEqual(expectedNewLineToken);
  });
});
