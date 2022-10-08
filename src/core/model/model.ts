export class Model {
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

  public getToken(index: number): Token | undefined {
    return this.tokens[index];
  }

  public pushToken(token: Token): void {
    this.tokens.push(token);
  }


  public static CreateTextToken(value: string, formats?: TokenFormat[]): TextToken {
    return {
      type: 'text',
      value,
      ...(formats && { formats })
    };
  }

  public static CreateNewLineToken(value: string): NewLineToken {
    return {
      type: 'newline',
      value
    };
  }

  public static CreateHashTagToken(value: string, formats?: TokenFormat[]): HashTagToken {
    return {
      type: 'hashtag',
      value,
      ...(formats && { formats })
    };
  }
}
