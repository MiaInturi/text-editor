type TokenType = 'text' | 'newline';

type TokenFormat = 'default' | 'bold' | 'italic';

interface Token {
  type: TokenType;
  format: TokenFormat;
  value: string;
}

interface TextToken extends Token {
  type: 'text';
}

interface NewLineToken extends Token {
  type: 'newline';
}
