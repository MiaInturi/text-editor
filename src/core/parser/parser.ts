import { parseHashTag } from '@core/parser/handlers/hashtag/hashtag';
import { parseNewLine } from '@core/parser/handlers/newline/newline';
import { parseText } from '@core/parser/handlers/text/text';
import { Model } from '@core/model/model';
import { resolveNextCodePointUnitCount, resolvePrevCodePointUnitCount } from '@core/parser/utils/helpers/codePoint';
import { isDelimiter } from '@core/parser/utils/helpers/other';
import { last } from '@utils/helpers/array';
import { TOKEN_TYPE } from '@core/model/utils/constants';

// eslint-disable-next-line
interface IParser {
  create: (text: string) => Parser;
  parse: (text: string) => Token[];
}

export class Parser {
  private readonly text: string;
  private readonly tokens: Token[];
  private position: Position = 0;
  private textFragmentStartPos: Index = -1;
  private textFragmentEndPos: Index = -1;


  private constructor(text: string, initialTokens: Token[] = []) {
    // ✅ important:
    // Parsing process should be 'in action' if last token is common text
    const lastInitialToken = last(initialTokens);
    if (lastInitialToken?.type === TOKEN_TYPE.TEXT) {
      this.text = `${lastInitialToken.value}${text}`;
      this.tokens = initialTokens.slice(0, -1);
      this.textFragmentStartPos = 0;
      this.textFragmentEndPos = lastInitialToken.value.length;
      this.position = lastInitialToken.value.length;
    } else {
      this.text = text;
      this.tokens = initialTokens;
    }
  }

  public static create(text: string, initialTokens?: Token[]): Parser {
    return new Parser(text, initialTokens);
  }

  public static parse(text: string, initialTokens?: Token[]): Token[] {
    const parser = new Parser(text, initialTokens);
    const handlers = [parseHashTag, parseNewLine, parseText];
    return parser.parse(handlers);
  }


  parse(handlers: ParserHandler[]): Token[] {
    // ✅ important:
    // All functions should return 'boolean' for indicate of consume success/fail
    // array method 'some' will stop as soon as some of 'handlers' return true
    while (this.isHasNext()) {
      handlers.some((parseFunction) => parseFunction(this));
    }
    // ✅ important:
    // Need to flush before end of parse for handle case when text token in the end of 'text'
    this.flushTokens();
    return this.tokens;
  }


  tell(): Position {
    return this.position;
  }

  seek(position: Position): void {
    if (position > this.text.length) throw new Error('Position cannot be greater than text length');
    this.position = position;
  }

  checkNext(): CodePoint | undefined {
    // TODO handle emoji
    return this.text.codePointAt(this.position);
  }

  checkPrev(): CodePoint | undefined {
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

  isHasNext(): boolean {
    return this.position < this.text.length;
  }

  selectNext(): CodePoint | undefined {
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


  getTokens(): Token[] {
    return this.tokens;
  }

  pushToken(token: Token): void {
    // ✅ important:
    // Call 'flush' for save text and chronological order before add new token
    this.flushTokens();
    this.tokens.push(token);
  }

  flushTokens(): void {
    // ✅ important:
    // Need to push text token into 'tokens' only if we are in the middle of a parsing process
    // Because not text tokens push themselves
    if (!this.isTextConsuming()) return;

    const textForToken = this.text.substring(this.textFragmentStartPos, this.textFragmentEndPos);
    this.tokens.push(Model.CreateTextToken(textForToken));
    this.textFragmentStartPos = -1;
    this.textFragmentEndPos = -1;
  }


  consumeSpecialSymbol(codePointMatch: CodePoint | ConsumeMatchFunction): boolean {
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

  consumeSpecialSymbolWhile(codePointMatch: CodePoint | ConsumeMatchFunction): boolean {
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


  isTextWordBound(): boolean {
    if (!this.position) return true;
    if (this.isTextConsuming()) return isDelimiter(this.checkPrev()!);
    return last(this.tokens)?.type === TOKEN_TYPE.NEWLINE;
  }

  isTextConsuming(): boolean {
    return this.textFragmentStartPos !== this.textFragmentEndPos;
  }

  getTextFragment(from: Index, to: Index): string {
    return this.text.substring(from, to);
  }

  consumeText(): void {
    if (!this.isTextConsuming()) {
      this.textFragmentStartPos = this.position;
      this.textFragmentEndPos = this.position;
    }
    this.selectNext();
    this.textFragmentEndPos = this.position;
  }
}
