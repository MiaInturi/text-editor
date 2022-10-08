type TokenType = 'text' | 'newline' | 'hashtag';
type TokenFormat = 'bold' | 'italic';

interface TokenBase {
  type: TokenType;
  value: string;
  formats?: TokenFormat[];
}

interface TextToken extends TokenBase {
  type: Extract<TokenType, 'text'>;
}

interface NewLineToken extends Omit<TokenBase, 'formats'> {
  type: Extract<TokenType, 'newline'>;
}

interface HashTagToken extends TokenBase {
  type: Extract<TokenType, 'hashtag'>;
}

type Token = TextToken | NewLineToken | HashTagToken;
