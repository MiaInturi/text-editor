import { parseHashTag } from '@core/parser/kinds/hashtag/hashtag';
import { parseNewLine } from '@core/parser/kinds/newline/newline';
import { parseText } from '@core/parser/kinds/text/text';
import { Model } from '@core/model/model';
import { resolveNextCodePointUnitCount, resolvePrevCodePointUnitCount } from '@core/parser/utils/helpers/unicode';
import { isDelimiter } from '@core/parser/utils/helpers/shared';
import { last } from '@utils/helpers/array';
import { TOKEN_TYPE } from '@core/model/utils/constants';

export class Parser {
  private readonly model: Model;
  private readonly text: string;
  private position: Position;

  private readonly parseFunctions = [parseHashTag, parseNewLine, parseText];
  private textFragmentStartPos: number = -1;
  private textFragmentEndPos: number = -1;

  public constructor(model: Model, text: string, position: Position = 0) {
    if (position > text.length) throw new Error('Position cannot be greater than text length');
    this.model = model;
    this.text = text;
    this.position = position;
  }

  /*
  Work with code points and position
   */
  public tell(): Position {
    return this.position;
  }

  public seek(position: Position): void {
    if (position > this.text.length) throw new Error('Position cannot be greater than text length');
    this.position = position;
  }

  private checkNext(): CodePoint | undefined {
    // TODO handle emoji
    return this.text.codePointAt(this.position);
  }

  private checkPrev(): CodePoint | undefined {
    const isPrevCodePointExists = this.position > 0;
    if (!isPrevCodePointExists) return;

    // TODO handle emoji
    // ✅ important:
    // If prev index code point in special range (from 0xDC00 to 0xDFFF)
    // then codePoint contains high and low surrogates
    const prevIndexCodePoint = this.text.codePointAt(this.position - 1)!;
    const positionShift = resolvePrevCodePointUnitCount(prevIndexCodePoint);
    return this.text.codePointAt(this.position - positionShift);
  }

  private isHasNext(): boolean {
    return this.position < this.text.length;
  }

  private selectNext(): CodePoint | undefined {
    const isNextCodePointExists = this.isHasNext();
    if (!isNextCodePointExists) return;

    // TODO handle emoji
    // ✅ important:
    // Calculate units that needed for codePoint
    // because String.length property equals to units count in string
    const nextCodePoint = this.text.codePointAt(this.position)!;
    const positionShift = resolveNextCodePointUnitCount(nextCodePoint);
    this.seek(this.position + positionShift);
    return nextCodePoint;
  }
  
  /*
  Work with tokens
   */
  public flushTokens(): void {
    // ✅ important:
    // Need to push text token into 'tokens' only if we are in the middle of a parsing process
    // Because not text tokens push themselves
    if (!this.isTextConsuming()) return;

    const textForToken = this.text.substring(this.textFragmentStartPos, this.textFragmentEndPos);
    this.textFragmentStartPos = -1;
    this.textFragmentEndPos = -1;
    this.model.pushToken(Model.CreateTextToken(textForToken));
  }

  public pushToken(token: Token): void {
    // ✅ important:
    // Call 'flush' for save text and chronological order before add new token
    this.flushTokens();
    this.model.pushToken(token);
  }

  /*
  Work with consuming special symbols
   */
  public consumeSpecialSymbol(codePointMatch: CodePoint | ConsumeMatchFunction): boolean {
    const codePoint = this.checkNext();
    if (!codePoint) return false;

    if (typeof codePointMatch === 'number' && codePoint === codePointMatch) {
      this.selectNext();
      return true;
    }
    if (typeof codePointMatch === 'function' && codePointMatch(codePoint)) {
      this.selectNext();
      return true;
    }

    return false;
  }

  public consumeSpecialSymbolWhile(codePointMatch: CodePoint | ConsumeMatchFunction): boolean {
    // ✅ important:
    // Return 'true' if at least one consume was successful
    const positionBeforeConsumeWhile = this.position;
    while (true) {
      const isConsumeSuccess = this.isHasNext() && this.consumeSpecialSymbol(codePointMatch);
      if (!isConsumeSuccess) break;
    }
    const positionAfterConsumeWhile = this.position;
    return positionBeforeConsumeWhile !== positionAfterConsumeWhile;
  }

  /*
  Work with text
   */
  public isTextWordBound(): boolean {
    if (!this.position) return true;
    if (this.isTextConsuming()) return isDelimiter(this.checkPrev() ?? NaN);

    return last(this.model.getTokens())?.type === TOKEN_TYPE.NEWLINE;
  }

  public isTextConsuming(): boolean {
    return this.textFragmentStartPos !== this.textFragmentEndPos;
  }

  public getTextFragment(from: number, to: number): string {
    return this.text.substring(from, to);
  }

  public consumeText(): void {
    if (!this.isTextConsuming()) {
      this.textFragmentStartPos = this.position;
      this.textFragmentEndPos = this.position;
    }
    this.selectNext();
    this.textFragmentEndPos = this.position;
  }

  public parse(): void {
    while (this.isHasNext()) {
      // ✅ important:
      // All functions should return 'boolean' for indicate of consume success/fail
      // array method 'some' will stop as soon as some of 'parseFunctions' return 'true'
      this.parseFunctions.some((parseFunction) => parseFunction(this, this.model));
    }
    // ✅ important:
    // Need to flush before end of parse for handle case when text token in the end 'text'
    this.flushTokens();
  }
}
