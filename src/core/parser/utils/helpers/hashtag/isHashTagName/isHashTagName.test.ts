import { isHashTagName } from './isHashTagName';

describe('\'isHashTagName\' helper', () => {
  test('Should return \'true\' only for allowed symbols: letters, numbers and low lines', () => {
    const correctHashTagNameLetter = 'a'.codePointAt(0)!;
    const correctHashTagNameNumber = '1'.codePointAt(0)!;
    const correctHashTagNameLowLine = '_'.codePointAt(0)!;
    const incorrectHashTagNameSymbol = '!'.codePointAt(0)!;

    expect(isHashTagName(correctHashTagNameLetter)).toBe(true);
    expect(isHashTagName(correctHashTagNameNumber)).toBe(true);
    expect(isHashTagName(correctHashTagNameLowLine)).toBe(true);
    expect(isHashTagName(incorrectHashTagNameSymbol)).toBe(false);
  });
});
