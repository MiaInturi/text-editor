export class Tokens {
  public static createTextToken(value: string, format?: TokenFormat): TextToken {
    return {
      type: 'text',
      format: format ?? 'default',
      value
    };
  }

  public static createNewLineToken(value: string): NewLineToken {
    return {
      type: 'newline',
      format: 'default',
      value
    };
  }
}
