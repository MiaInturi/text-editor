import { Model } from '@core/model/model';
import { Parser } from '@core/parser/parser';
import { parseText } from './text';

describe('Text parse', () => {
  test('Text parse always return "true"', () => {
    const model = new Model();
    const text = 'text';
    const parser = new Parser(model, text);
    expect(parseText(parser)).toBe(true);
  });

  test('Text parse consume only one symbol per time', () => {
    const model = new Model();
    const text = 'Text with many symbols';
    const parser = new Parser(model, text);
    parseText(parser);

    expect(parser.tell()).toBe(1);
    expect(parser.isTextConsuming()).toBe(true);
  });

  test('Text parse does not create tokens by himself', () => {
    const model = new Model();
    const text = 'Common text';
    const parser = new Parser(model, text);
    parseText(parser);
    parseText(parser);
    parseText(parser);

    expect(model.getTokens()).toStrictEqual([]);
  });
});
