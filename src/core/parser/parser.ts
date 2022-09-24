import { Tokens } from '../tokens';
import { parseHashTag } from './kinds/hashtag/hashtag';
import { parseNewLine } from './kinds/newline/newline';
import { parseText } from './kinds/text/text';
import { isDelimiter } from './utils/helpers/shared';
import { last } from '../../utils/helpers/array';
import { UTF16_UTIL } from './utils/constants';
import { TOKEN_TYPE } from '../tokens/utils/constants';

export class Parser {
  private readonly text: string;
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

  private peekNext(): CodePoint | undefined {
    // TODO handle emoji
    return this.text.codePointAt(this.position);
  }

  private peekPrev(): CodePoint | undefined {
    // TODO handle emoji
    const isPrevCodePointExists = this.position > 0;
    if (!isPrevCodePointExists) return;

    // ✅ important:
    // If prev index code point in special range (from 0xDC00 to 0xDFFF)
    // then codePoint contains high and low surrogates
    const prevIndexCodePoint = this.text.codePointAt(this.position - 1)!;
    const isPrevIndexCodePointContainsHighAndLowSurrogates = (
      prevIndexCodePoint >= UTF16_UTIL.LOW_SURROGATE_MIN_VALUE
      && prevIndexCodePoint <= UTF16_UTIL.LOW_SURROGATE_MAX_VALUE
    );

    const positionShift = isPrevIndexCodePointContainsHighAndLowSurrogates ? UTF16_UTIL.MAX_UNIT_COUNT : UTF16_UTIL.MIN_UNIT_COUNT;
    return this.text.codePointAt(this.position - positionShift);
  }

  private next(): CodePoint | undefined {
    const isNextCodePointExists = this.hasNext();
    if (!isNextCodePointExists) return;

    const nextCodePoint = this.text.codePointAt(this.position)!;
    this.incrementPosition(nextCodePoint);
    return nextCodePoint;
  }

  private hasNext(): boolean {
    return this.position < this.text.length;
  }

  private incrementPosition(codePoint: CodePoint): void {
    // TODO handle emoji
    // ✅ important:
    // Calculate units that needed for codePoint
    // because String.length property equals to units count in string
    const isCodePointContainsHighAndLowSurrogates = codePoint > UTF16_UTIL.UNIT_MAX_VALUE;
    const positionShift = isCodePointContainsHighAndLowSurrogates ? UTF16_UTIL.MAX_UNIT_COUNT : UTF16_UTIL.MIN_UNIT_COUNT;
    this.seek(this.position + positionShift);
  }

  /*
  Work with near position symbols
   */
  public isNewWordBound(): boolean {
    if (!this.position) return true;
    if (this.isTextConsuming()) return isDelimiter(this.peekPrev() ?? NaN);

    const lastTokenType = last(this.tokens)?.type;
    return lastTokenType === TOKEN_TYPE.NEWLINE;
  }
  
  /*
  Work with tokens
   */
  public addToken(token: Token): void {
    // ✅ important:
    // Call 'flush' for save text and chronological order before add new token
    this.flushTokens();
    this.tokens.push(token);
  }

  public flushTokens(): void {
    // ✅ important:
    // Need to push text token into 'tokens' only if we are in the middle of a parsing process
    if (!this.isTextConsuming()) return;

    const textForToken = this.text.substring(this.textFragmentStartPos, this.textFragmentEndPos);
    this.textFragmentStartPos = -1;
    this.textFragmentEndPos = -1;
    this.tokens.push(Tokens.createTextToken(textForToken));
  }

  public getTokens(): Token[] {
    return this.tokens;
  }

  /*
  Work with consuming
   */
  public consume(codePointMatch: CodePoint | ConsumeMatchFunction): boolean {
    const codePoint = this.peekNext();
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

  public consumeWhile(codePointMatch: CodePoint | ConsumeMatchFunction): boolean {
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
  public getTextFragment(from: number, to: number): string {
    return this.text.substring(from, to);
  }

  public isTextConsuming(): boolean {
    return this.textFragmentStartPos !== this.textFragmentEndPos;
  }

  public consumeText(): void {
    if (!this.isTextConsuming()) {
      this.textFragmentStartPos = this.position;
      this.textFragmentEndPos = this.position;
    }
    this.next();
    this.textFragmentEndPos = this.position;
  }

  public parse(): Token[] {
    const parseFunctions = [parseHashTag, parseNewLine, parseText];
    while (this.hasNext()) {
      // ✅ important:
      // All functions should return 'boolean' for indicate of consume success/fail
      // array method 'some' will stop as soon as some of 'parseFunctions' return 'true'
      parseFunctions.some((parseFunction) => parseFunction(this));
    }
    // ✅ important:
    // Need to flush before end of parse for handle case when text token in the end 'text'
    this.flushTokens();
    return this.tokens;
  }
}
