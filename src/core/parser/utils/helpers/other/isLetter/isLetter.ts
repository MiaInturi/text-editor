const isLatin = (codePoint: CodePoint): boolean => (
  (codePoint >= 65 && codePoint <= 90) || (codePoint >= 97 && codePoint <= 122)
);

const isGreekAndCoptic = (codePoint: CodePoint): boolean => (
  codePoint >= 880 && codePoint <= 1023
);

const isCyrillic = (codePoint: CodePoint): boolean => (
  codePoint >= 1024 && codePoint <= 1327
);

// TODO add rest of alphabets

export const isLetter = (codePoint: CodePoint): boolean => (
  isLatin(codePoint)
  || isGreekAndCoptic(codePoint)
  || isCyrillic(codePoint)
);

