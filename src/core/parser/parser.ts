import type { ConsumeMatchFunction, ParseFunction } from './types/parser';

import { Tokens } from '../tokens/tokens';
import { UTF16_UTIL } from './utils/constants/unicode';
import { COMMON_TEXT_SYMBOLS_REGEXP } from './utils/constants/regexp';

export class Parser {
  private text: string;
  private position: number;

  private tokens: Token[] = [];
  private textFragmentStartPos: number = -1;
  private textFragmentEndPos: number = -1;

  public constructor(text: string, position: number = 0) {
    this.text = text;
    this.position = position;
  }

  /*
  Work with code points and position
   */
  public tell(): number {
    return this.position;
  }

  public seek(position: number): void {
    this.position = position;
  }

  private peek(): number | undefined {
    return this.text.codePointAt(this.position);
  }

  private next(): number | undefined {
    const isNextCodePointExists = this.hasNext();
    if (!isNextCodePointExists) return;

    const nextCodePoint = this.text.codePointAt(this.position);
    this.incrementPosition(nextCodePoint!);
    return nextCodePoint;
  }

  private hasNext(): boolean {
    return this.position < this.text.length;
  }

  private incrementPosition(codePoint: number): void {
    // TODO handle emoji
    // ✅ important:
    // Need to calculate units that needed for codePoint
    // because String.length property equals to units count in string
    const isCodePointNeedsMoreThanOneUnit = codePoint > UTF16_UTIL.UNIT_MAX_VALUE;
    this.position += isCodePointNeedsMoreThanOneUnit ? UTF16_UTIL.MAX_UNIT_COUNT : UTF16_UTIL.MIN_UNIT_COUNT;
  }
  
  /*
  Work with tokens
   */
  public flush(): void {
    // ✅ important:
    // Need to push text token into 'tokens' only if we are in the middle of a parsing process
    const isTextPending = this.textFragmentStartPos !== this.textFragmentEndPos;
    if (!isTextPending) return;

    const textForToken = this.text.substring(this.textFragmentStartPos, this.textFragmentEndPos);
    this.textFragmentStartPos = -1;
    this.textFragmentEndPos = -1;
    this.tokens.push(Tokens.createTextToken(textForToken));
  }

  public push(token: Token): void {
    // ✅ important:
    // Call 'flush' for save text state before add new token
    // TODO: мб flush не нужен будет?
    this.flush();
    this.tokens.push(token);
  }

  /*
  Work with consuming
   */
  public consume(codePointMatch: number | ConsumeMatchFunction): boolean {
    const codePoint = this.peek();
    if (!codePoint) return false;

    if (typeof codePointMatch === 'number' && codePoint === codePointMatch) {
      this.next();
      return true;
    }
    if (typeof codePointMatch === 'function' && codePointMatch(codePoint)) {
      this.next();
      return true;
    }

    return false;
  }

  public consumeWhile(codePointMatch: number | ConsumeMatchFunction): boolean {
    // ✅ important:
    // Return 'true' if at least one consume was successful
    const positionBeforeConsumeWhile = this.position;
    while (true) {
      const isConsumeSuccess = this.hasNext() && this.consume(codePointMatch);
      if (!isConsumeSuccess) break;
    }
    const positionAfterConsumeWhile = this.position;
    return positionBeforeConsumeWhile !== positionAfterConsumeWhile;
  }

  /*
  Work with text
   */
  public consumeText(): void {
    const isTextPending = this.textFragmentStartPos !== this.textFragmentEndPos;
    if (!isTextPending) {
      this.textFragmentStartPos = this.position;
      this.textFragmentEndPos = this.position;
    }

    const consumeTextMatchFn: ConsumeMatchFunction = (codePoint) => {
      const codePointSymbol = String.fromCodePoint(codePoint);
      return COMMON_TEXT_SYMBOLS_REGEXP.test(codePointSymbol);
    };
    this.consumeWhile(consumeTextMatchFn);
    this.textFragmentEndPos = this.position;
  }

  public getTextFragment(from: number, to: number): string {
    return this.text.substring(from, to);
  }

  public parse(parseFunctions: ParseFunction[]): Token[] {
    while (this.hasNext()) {
      // ✅ important:
      // All functions should return 'boolean' for indicate of consume success/fail
      // array method 'some' will stop as soon as some of 'parseFunctions' return 'true'
      parseFunctions.some((parseFunction) => parseFunction(this));
    }

    return this.tokens;
  }
}
