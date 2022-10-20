import type { Model } from '@core/model/model';
import { isTokenFormattable, isTokenSplittableByPosition, splitTokenByPosition } from '@core/formatter/utils/helpers/format';
import { resolveFormattableSliceShift, resolveRangeEdgeLocation, resolveTokensFullLength } from '@core/formatter/utils/helpers/shared';
import { addUniqueValueIntoArray, first, last } from '@utils/helpers/array';

export class Formatter {
  private readonly model: Model;

  public constructor(model: Model) {
    this.model = model;
  }

  public format(format: TokenFormat, range: Range): Token[] {
    if (!this.isRangeValidForFormatting(range)) throw new Error('Range \'to\' - \'from\' is invalid');

    const rangeLocation = this.resolveRangeLocation(range);
    const { splittedTokens, formattableSlice } = this.splitTokens(rangeLocation);

    const formattableTokens = splittedTokens.slice(formattableSlice.start, formattableSlice.end);
    const formattedTokens = this.applyFormatToTokens(formattableTokens, format);
    return this.insertFormattedTokens(formattedTokens, rangeLocation);
  }

  private isRangeValidForFormatting({ from, to }: Range): boolean {
    const tokens = this.model.getTokens();
    const tokensFullLength = resolveTokensFullLength(tokens);

    if (from >= to) return false;
    if (from > tokensFullLength || to > tokensFullLength) return false;
    return true;
  }

  private resolveRangeLocation({ from, to }: Range): RangeLocation {
    const tokens = this.model.getTokens();
    const startRangeEdgeLocation = resolveRangeEdgeLocation(tokens, from, false);
    const endRangeEdgeLocation = resolveRangeEdgeLocation(tokens, to, true);
    return { start: startRangeEdgeLocation, end: endRangeEdgeLocation };
  }

  private splitTokens({ start, end }: RangeLocation): SplittedTokensByRangeLocation {
    const tokensInRangeLocation = this.model.getTokens().slice(start.index, end.index + 1);
    const firstTokenInRangeLocation = first(tokensInRangeLocation)!;
    const lastTokenInRangeLocation = last(tokensInRangeLocation)!;

    const isFirstTokenSplittable = isTokenSplittableByPosition(firstTokenInRangeLocation, start.offset);
    const isLastTokenSplittable = isTokenSplittableByPosition(lastTokenInRangeLocation, end.offset);
    const firstTokenArrayRepresentation: SplittedTokenArrayRepresentation =
      isFirstTokenSplittable
        ? splitTokenByPosition(firstTokenInRangeLocation, start.offset)
        : [firstTokenInRangeLocation];
    const lastTokenArrayRepresentation: SplittedTokenArrayRepresentation =
      isLastTokenSplittable
        ? splitTokenByPosition(lastTokenInRangeLocation, end.offset)
        : [lastTokenInRangeLocation];

    // ✅ important:
    // 'formattableSlice' tells start to end indexes where need to apply format
    const splittedTokens = [...firstTokenArrayRepresentation, ...tokensInRangeLocation.slice(1, -1), ...lastTokenArrayRepresentation];
    const formattableSlice = { start: resolveFormattableSliceShift(firstTokenArrayRepresentation), end: splittedTokens.length - resolveFormattableSliceShift(lastTokenArrayRepresentation) };
    return { splittedTokens, formattableSlice };
  }

  private applyFormatToTokens(tokens: Token[], format: TokenFormat): Token[] {
    const isAllTokensAlreadyHaveFormat = tokens.every((token) => (
      !isTokenFormattable(token) || token.formats.includes(format)
    ));
    return tokens.map((token) => {
      if (!isTokenFormattable(token)) return token;
      return {
        ...token,
        formats: isAllTokensAlreadyHaveFormat
          ? token.formats.filter((alreadyAppliedFormat) => format !== alreadyAppliedFormat)
          : addUniqueValueIntoArray(token.formats, format)
      };
    });
  }

  private insertFormattedTokens(formattedTokens: Token[], { start, end }: RangeLocation): Token[] {
    const originalTokens = this.model.getTokens();
    const beforeFormattedTokens = originalTokens.slice(0, start.index);
    const afterFormattedTokens = originalTokens.slice(end.index + 1);
    return [...beforeFormattedTokens, ...formattedTokens, ...afterFormattedTokens];
  }
}
