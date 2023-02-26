type TokenType = 'text' | 'newline' | 'hashtag';
type TokenFormat = 'bold' | 'italic';

interface TokenBase {
  type: TokenType;
  value: string;
}

interface FormattableTokenBase extends TokenBase {
  formats: Set<TokenFormat>;
}

interface TextToken extends FormattableTokenBase {
  type: Extract<TokenType, 'text'>;
}

interface NewLineToken extends TokenBase {
  type: Extract<TokenType, 'newline'>;
}

interface HashTagToken extends FormattableTokenBase {
  type: Extract<TokenType, 'hashtag'>;
}

type Token = TextToken | NewLineToken | HashTagToken;
