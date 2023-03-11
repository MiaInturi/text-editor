export class Model {
  public static CreateTextToken(value: string, formats?: Set<TokenFormat>): TextToken {
    return {
      type: 'text',
      value,
      formats: formats ?? new Set()
    };
  }

  public static CreateNewLineToken(value: NewLineTokenValue): NewLineToken {
    return {
      type: 'newline',
      value
    };
  }

  public static CreateHashTagToken(value: HashTagTokenValue, formats?: Set<TokenFormat>): HashTagToken {
    return {
      type: 'hashtag',
      value,
      formats: formats ?? new Set()
    };
  }

  private tokens;

  public constructor(tokens?: Token[]) {
    this.tokens = tokens ?? [];
  }

  public getTokens(): Token[] {
    return this.tokens;
  }

  public setTokens(tokens: Token[]): void {
    this.tokens = tokens;
  }

  public getToken(index: Index): Token | undefined {
    return this.tokens[index];
  }

  public pushToken(token: Token): void {
    this.tokens.push(token);
  }
}
