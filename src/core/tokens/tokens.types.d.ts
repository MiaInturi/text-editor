type TokenType = 'text' | 'newline';

type TokenFormat = 'default' | 'bold' | 'italic';

interface Token {
  type: TokenType;
  format: TokenFormat;
  value: string;
}

interface TextToken extends Token {
  type: Extract<TokenType, 'text'>;
}

interface NewLineToken extends Token {
  type: Extract<TokenType, 'newline'>;
  format: Extract<TokenFormat, 'default'>;
}
