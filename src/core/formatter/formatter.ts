import { applyFormatToToken, isTokenFormattable, isTokenSplittable, splitTokenByPosition } from '@core/formatter/utils/helpers/format';
import { resolveRangeEdgeLocation, resolveTokensFullLength } from '@core/formatter/utils/helpers/shared';
import { first, last } from '@utils/helpers/array';

export class Formatter {
  private constructor() {}

  public static create(): Formatter {
    const formatter = new Formatter();
    return formatter;
  }

  public static applyFormat(originalTokens: Token[], range: FormatRange, format: TokenFormat): Token[] {
    if (!Formatter.isRangeValid(originalTokens, range)) throw new Error('Range \'to\' - \'from\' is invalid');

    const formatter = new Formatter();
    return formatter.applyFormat(originalTokens, range, format);
  }

  private static isRangeValid(originalTokens: Token[], { from, to }: FormatRange): boolean {
    const tokensFullLength = resolveTokensFullLength(originalTokens);

    if (from >= to) return false;
    if (from > tokensFullLength || to > tokensFullLength) return false;
    return true;
  }


  applyFormat(originalTokens: Token[], range: FormatRange, format: TokenFormat): Token[] {
    const rangeLocation = this.resolveRangeLocation(originalTokens, range);
    const formattedTokens = this.resolveSplittedTokens(originalTokens, format, rangeLocation);
    return this.insertSplittedTokens(originalTokens, formattedTokens, rangeLocation);
  }

  resolveRangeLocation(tokens: Token[], { from, to }: FormatRange): FormatRangeLocation {
    const startRangeLocation = resolveRangeEdgeLocation(tokens, from, false);
    const endRangeLocation = resolveRangeEdgeLocation(tokens, to, true);
    return { start: startRangeLocation, end: endRangeLocation };
  }

  resolveSplittedTokens(originalTokens: Token[], format: TokenFormat, rangeLocation: FormatRangeLocation): Token[] {
    const { start, end } = rangeLocation;
    return start.index === end.index
      ? this.resolveSplittedTokensBySingle(originalTokens, format, rangeLocation)
      : this.resolveSplittedTokensByMultiple(originalTokens, format, rangeLocation);
  }

  resolveSplittedTokensBySingle(originalTokens: Token[], format: TokenFormat, { start, end }: FormatRangeLocation): Token[] {
    // ✅ important:
    // If token not splittable call 'splitTokenByPosition' with edges offset for getting all token as 'formattable'
    const singleToken = originalTokens[start.index];
    const isSingleTokenSplittable = isTokenSplittable(singleToken);

    const calculatedStartOffset = isSingleTokenSplittable ? start.offset : 0;
    const calculatedEndOffset = isSingleTokenSplittable ? end.offset : singleToken.value.length;
    const [splittedStart, temporaryFormattable] = splitTokenByPosition(singleToken, calculatedStartOffset);
    const [formattable, splittedEnd] = splitTokenByPosition(temporaryFormattable, calculatedEndOffset - calculatedStartOffset);

    // ✅ important:
    // Filter tokens with empty value, because that tokens created when start or end on the edge of 'token'
    const formattedTokens = this.resolveFormattedTokens([formattable], format);
    const splittedTokens = [splittedStart, ...formattedTokens, splittedEnd];
    return splittedTokens.filter((splittedToken) => splittedToken.value);
  }

  resolveSplittedTokensByMultiple(originalTokens: Token[], format: TokenFormat, { start, end }: FormatRangeLocation): Token[] {
    // ✅ important:
    // If token not splittable call 'splitTokenByPosition' with edges offset for getting all token as 'formattable'
    const tokensInRangeLocation = originalTokens.slice(start.index, end.index + 1);
    const firstToken = first(tokensInRangeLocation)!;
    const lastToken = last(tokensInRangeLocation)!;
    const isFirstTokenSplittable = isTokenSplittable(firstToken);
    const isLastTokenSplittable = isTokenSplittable(lastToken);

    const calculatedStartOffset = isFirstTokenSplittable ? start.offset : 0;
    const calculatedEndOffset = isLastTokenSplittable ? end.offset : lastToken.value.length;
    const [splittedStart, formattableStart] = splitTokenByPosition(firstToken, calculatedStartOffset);
    const [formattableEnd, splittedEnd] = splitTokenByPosition(lastToken, calculatedEndOffset);

    // ✅ important:
    // Filter tokens with empty value, because that tokens created when start or end on the edge of 'token'
    const formattableTokens = [formattableStart, ...tokensInRangeLocation.slice(1, -1), formattableEnd];
    const formattedTokens = this.resolveFormattedTokens(formattableTokens, format);
    const splittedTokens = [splittedStart, ...formattedTokens, splittedEnd];
    return splittedTokens.filter((splittedToken) => splittedToken.value);
  }

  resolveFormattedTokens(tokens: Token[], format: TokenFormat): Token[] {
    const isNeedToDeleteFormat = tokens.every((token) => (
      !isTokenFormattable(token) || token.formats.includes(format)
    ));
    return tokens.map((token) => {
      if (!isTokenFormattable(token)) return token;
      return applyFormatToToken(token, format, isNeedToDeleteFormat);
    });
  }

  insertSplittedTokens(originalTokens: Token[], splittedTokens: Token[], { start, end }: FormatRangeLocation): Token[] {
    const beforeSplittedTokens = originalTokens.slice(0, start.index);
    const afterSplittedTokens = originalTokens.slice(end.index + 1);
    return [...beforeSplittedTokens, ...splittedTokens, ...afterSplittedTokens];
  }
}
