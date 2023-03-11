type TokenTypeConstants = {
  [key in Uppercase<TokenType>]: Extract<TokenType, Lowercase<key>>
};
export const TOKEN_TYPE: TokenTypeConstants = {
  TEXT: 'text',
  NEWLINE: 'newline',
  HASHTAG: 'hashtag'
};

type TokenFormatConstants = {
  [key in Uppercase<TokenFormat>]: Extract<TokenFormat, Lowercase<key>>;
};
export const TOKEN_FORMAT: TokenFormatConstants = {
  BOLD: 'bold',
  ITALIC: 'italic'
};
