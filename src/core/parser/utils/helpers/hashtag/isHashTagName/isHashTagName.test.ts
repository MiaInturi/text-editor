import { isHashTagName } from './isHashTagName';

describe('\'isHashTagName\' helper: allowed symbols', () => {
  test('Should return true for allowed symbols code points: letters, numbers, low line', () => {
    const correctSymbols = ['a', '1', '_'];
    correctSymbols.forEach((correctSymbol) => {
      const correctSymbolCodePoint = correctSymbol.codePointAt(0)!;
      expect(isHashTagName(correctSymbolCodePoint)).toBe(true);
    });
  });

  test('Should return false for not allowed symbols code points', () => {
    const incorrectSymbols = ['`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '"', ',', '.', ':'];
    incorrectSymbols.forEach((incorrectSymbol) => {
      const incorrectSymbolCodePoint = incorrectSymbol.codePointAt(0)!;
      expect(isHashTagName(incorrectSymbolCodePoint)).toBe(false);
    });
  });
});
