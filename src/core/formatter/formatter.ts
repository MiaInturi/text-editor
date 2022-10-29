import type { Model } from '@core/model/model';
import { applyFormatToToken, isTokenFormattable, isTokenSplittable, splitTokenByPosition } from '@core/formatter/utils/helpers/format';
import { resolveRangeEdgeLocation, resolveTokensFullLength } from '@core/formatter/utils/helpers/shared';
import { first, last } from '@utils/helpers/array';

export class Formatter {
  private readonly model: Model;

  public constructor(model: Model) {
    this.model = model;
  }

  public format(format: TokenFormat, range: FormatRange): Token[] {
    if (!this.isRangeValidForFormatting(range)) throw new Error('Range \'to\' - \'from\' is invalid');

    const rangeLocation = this.resolveRangeLocation(range);
    const formattedTokens = this.setFormat(rangeLocation, format);
    return this.insertFormattedTokens(formattedTokens, rangeLocation);
  }

  private isRangeValidForFormatting({ from, to }: FormatRange): boolean {
    const tokens = this.model.getTokens();
    const tokensFullLength = resolveTokensFullLength(tokens);

    if (from >= to) return false;
    if (from > tokensFullLength || to > tokensFullLength) return false;
    return true;
  }

  private resolveRangeLocation({ from, to }: FormatRange): FormatRangeLocation {
    const tokens = this.model.getTokens();
    const startRangeEdgeLocation = resolveRangeEdgeLocation(tokens, from, false);
    const endRangeEdgeLocation = resolveRangeEdgeLocation(tokens, to, true);
    return { start: startRangeEdgeLocation, end: endRangeEdgeLocation };
  }

  private setFormat(rangeLocation: FormatRangeLocation, format: TokenFormat): Token[] {
    const { start, end } = rangeLocation;
    const isOnlyOneTokenInRange = start.index === end.index;
    return isOnlyOneTokenInRange ? this.setFormatToSingleToken(rangeLocation, format) : this.setFormatToMultipleTokens(rangeLocation, format);
  }

  private setFormatToSingleToken({ start, end }: FormatRangeLocation, format: TokenFormat): Token[] {
    // ✅ important:
    // If token not splittable call 'splitTokenByPosition' with edges offset for getting all token as 'formattable'
    const singleToken = this.model.getTokens()[start.index];
    const isSingleTokenSplittable = isTokenSplittable(singleToken);

    const calculatedStartOffset = isSingleTokenSplittable ? start.offset : 0;
    const calculatedEndOffset = isSingleTokenSplittable ? end.offset : singleToken.value.length;
    const [splittedStart, temporaryFormattable] = splitTokenByPosition(singleToken, calculatedStartOffset);
    const [formattable, splittedEnd] = splitTokenByPosition(temporaryFormattable, calculatedEndOffset - calculatedStartOffset);

    // ✅ important:
    // Filter tokens with empty value, because that tokens created when start or end on the edge of 'token'
    const formattedTokens = this.applyFormatToTokens([ formattable ], format);
    const splittedTokens = [splittedStart, ...formattedTokens, splittedEnd];
    return splittedTokens.filter((splittedToken) => splittedToken.value);
  }

  private setFormatToMultipleTokens({ start, end }: FormatRangeLocation, format: TokenFormat): Token[] {
    // ✅ important:
    // If token not splittable call 'splitTokenByPosition' with edges offset for getting all token as 'formattable'
    const tokensInRangeLocation = this.model.getTokens().slice(start.index, end.index + 1);
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
    const formattedTokens = this.applyFormatToTokens(formattableTokens, format);
    const splittedTokens = [splittedStart, ...formattedTokens, splittedEnd];
    return splittedTokens.filter((splittedToken) => splittedToken.value);
  }

  private applyFormatToTokens(tokens: Token[], format: TokenFormat): Token[] {
    const isNeedToDeleteFormat = tokens.every((token) => (
      !isTokenFormattable(token) || token.formats.includes(format)
    ));
    return tokens.map((token) => {
      if (!isTokenFormattable(token)) return token;
      return applyFormatToToken(token, format, isNeedToDeleteFormat);
    });
  }

  private insertFormattedTokens(formattedTokens: Token[], { start, end }: FormatRangeLocation): Token[] {
    const originalTokens = this.model.getTokens();
    const beforeFormattedTokens = originalTokens.slice(0, start.index);
    const afterFormattedTokens = originalTokens.slice(end.index + 1);
    return [...beforeFormattedTokens, ...formattedTokens, ...afterFormattedTokens];
  }
}
