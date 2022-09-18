type TokenType = 'text' | 'newline' | 'hashtag';

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

interface HashTagToken extends Token {
  type: Extract<TokenType, 'hashtag'>;
  format: Extract<TokenFormat, 'default'>;
}
