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

type NewLineTokenValue = '\r' | '\n' | '\r\n';
interface NewLineToken extends TokenBase {
  type: Extract<TokenType, 'newline'>;
  value: NewLineTokenValue;
}

type HashTagTokenValue = `#${string}`;
interface HashTagToken extends FormattableTokenBase {
  type: Extract<TokenType, 'hashtag'>;
  value: HashTagTokenValue;
}

type Token = TextToken | NewLineToken | HashTagToken;
