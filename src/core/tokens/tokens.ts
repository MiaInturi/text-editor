export class Tokens {
  public static CreateTextToken(value: string, format?: TokenFormat): TextToken {
    return {
      type: 'text',
      format: format ?? 'default',
      value
    };
  }

  public static CreateNewLineToken(value: string): NewLineToken {
    return {
      type: 'newline',
      format: 'default',
      value
    };
  }

  public static CreateHashTagToken(value: string): HashTagToken {
    return {
      type: 'hashtag',
      format: 'default',
      value
    };
  }
}
