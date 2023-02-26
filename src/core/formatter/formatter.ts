import { applyFormatToToken, isTokenFormattable } from '@core/formatter/utils/helpers/format';
import { isTokenSplittable, normalizeTokens, resolvePositionLocationInTokens, splitTokenByPosition } from '@core/formatter/utils/helpers/other';
import { first, last } from '@utils/helpers/array';

export class Formatter {
  private constructor() {}

  public static applyFormat(originalTokens: Token[], range: SelectionRange, format: TokenFormat): Token[] {
    if (!Formatter.isRangeValid(originalTokens, range)) throw new Error(`Range ${range.from}-${range.to} is invalid`);

    const formatter = new Formatter();
    return formatter.applyFormat(originalTokens, range, format);
  }

  private static isRangeValid(originalTokens: Token[], range: SelectionRange): boolean {
    const tokensFullLength = originalTokens.reduce((acc, token) => acc + token.value.length, 0);

    if (range.from >= range.to) return false;
    if (range.from > tokensFullLength || range.to > tokensFullLength) return false;
    return true;
  }


  private applyFormat(originalTokens: Token[], range: SelectionRange, format: TokenFormat): Token[] {
    const rangeLocation = this.resolveRangeLocationInTokens(originalTokens, range);
    const splittedTokens = this.resolveSplittedTokens(originalTokens, format, rangeLocation);
    return this.insertSplittedTokens(originalTokens, splittedTokens, rangeLocation);
  }

  private resolveRangeLocationInTokens(tokens: Token[], range: SelectionRange): RangeLocationInTokens {
    const startRangeLocation = resolvePositionLocationInTokens(tokens, range.from, false);
    const endRangeLocation = resolvePositionLocationInTokens(tokens, range.to, true);
    return { start: startRangeLocation, end: endRangeLocation };
  }

  private resolveSplittedTokens(originalTokens: Token[], format: TokenFormat, rangeLocation: RangeLocationInTokens): Token[] {
    const isFormatSingle = rangeLocation.start.index === rangeLocation.end.index;
    return isFormatSingle
      ? this.resolveSplittedTokensSingle(originalTokens, format, rangeLocation)
      : this.resolveSplittedTokensMultiple(originalTokens, format, rangeLocation);
  }

  private resolveSplittedTokensSingle(originalTokens: Token[], format: TokenFormat, rangeLocation: RangeLocationInTokens): Token[] {
    const singleToken = originalTokens[rangeLocation.start.index];

    if (!isTokenFormattable(singleToken)) {
      return [singleToken];
    }
    if (!isTokenSplittable(singleToken)) {
      return this.applyFormatToTokens([singleToken], format);
    }

    const [splittedStart, tmp] = splitTokenByPosition(singleToken, rangeLocation.start.offset);
    const [formattable, splittedEnd] = splitTokenByPosition(tmp, rangeLocation.end.offset - rangeLocation.start.offset);

    const formattedTokens = this.applyFormatToTokens([formattable], format);
    return normalizeTokens([splittedStart, ...formattedTokens, splittedEnd]);
  }

  private resolveSplittedTokensMultiple(originalTokens: Token[], format: TokenFormat, rangeLocation: RangeLocationInTokens): Token[] {
    const tokensInRangeLocation = originalTokens.slice(rangeLocation.start.index, rangeLocation.end.index + 1);

    const firstToken = first(tokensInRangeLocation)!;
    const lastToken = last(tokensInRangeLocation)!;
    const isFirstTokenSplittable = isTokenSplittable(firstToken);
    const isLastTokenSplittable = isTokenSplittable(lastToken);

    if (!isFirstTokenSplittable && !isLastTokenSplittable) {
      return this.applyFormatToTokens(tokensInRangeLocation, format);
    }

    const startSplitPosition = isFirstTokenSplittable ? rangeLocation.start.offset : 0;
    const endSplitPosition = isLastTokenSplittable ? rangeLocation.end.offset : lastToken.value.length;
    const [splittedStart, formattableStart] = splitTokenByPosition(firstToken, startSplitPosition);
    const [formattableEnd, splittedEnd] = splitTokenByPosition(lastToken, endSplitPosition);

    const formattedTokens = this.applyFormatToTokens([formattableStart, ...tokensInRangeLocation.slice(1, -1), formattableEnd], format);
    return normalizeTokens([splittedStart, ...formattedTokens, splittedEnd]);
  }

  private applyFormatToTokens(tokens: Token[], format: TokenFormat): Token[] {
    const deleteFormat = tokens.every((token) => !isTokenFormattable(token) || token.formats.has(format));
    return tokens.map((token) => {
      if (!isTokenFormattable(token)) return token;
      return applyFormatToToken(token, format, deleteFormat);
    });
  }

  private insertSplittedTokens(originalTokens: Token[], splittedTokens: Token[], rangeLocation: RangeLocationInTokens): Token[] {
    const beforeSplittedTokens = originalTokens.slice(0, rangeLocation.start.index);
    const afterSplittedTokens = originalTokens.slice(rangeLocation.end.index + 1);
    return [...beforeSplittedTokens, ...splittedTokens, ...afterSplittedTokens];
  }
}
