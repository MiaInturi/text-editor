export class Tokens {
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
