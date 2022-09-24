type TokenType = 'text' | 'newline' | 'hashtag';

type TokenFormat = 'default' | 'bold' | 'italic';

interface TokenBase {
  type: TokenType;
  format: TokenFormat;
  value: string;
}

interface TextToken extends TokenBase {
  type: Extract<TokenType, 'text'>;
}

interface NewLineToken extends TokenBase {
  type: Extract<TokenType, 'newline'>;
  format: Extract<TokenFormat, 'default'>;
}

interface HashTagToken extends TokenBase {
  type: Extract<TokenType, 'hashtag'>;
  format: Extract<TokenFormat, 'default'>;
}

type Token = TextToken | NewLineToken | HashTagToken;
