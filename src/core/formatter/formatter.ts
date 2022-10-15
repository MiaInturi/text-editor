import type { Model } from '@core/model/model';
import { isTokenFormattable, isTokenSplittableByPosition, splitTokenByPosition } from '@core/formatter/utils/helpers/format';
import { resolveRangeEdgeLocation, resolveTokensFullLength } from '@core/formatter/utils/helpers/shared';
import { addUniqueValueIntoArray, first, last } from '@utils/helpers/array';

export class Formatter {
  private readonly model: Model;

  public constructor(model: Model) {
    this.model = model;
  }

  public format(format: TokenFormat, range: Range): void {
    if (!this.isRangeValidForFormatting(range)) return;

    const rangeLocation = this.resolveRangeLocation(range);
    const { splittedTokens, formattableSlice } = this.splitTokens(rangeLocation);

    const formattableTokens = splittedTokens.slice(formattableSlice.start, formattableSlice.end);
    const formattedTokens = this.applyFormatToTokens(formattableTokens, format);
    this.insertFormattedTokens(formattedTokens, rangeLocation);
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
    const firstTokenArrayRepresentation = isFirstTokenSplittable ? splitTokenByPosition(firstTokenInRangeLocation, start.offset) : [firstTokenInRangeLocation];
    const lastTokenArrayRepresentation = isLastTokenSplittable ? splitTokenByPosition(lastTokenInRangeLocation, end.offset) : [lastTokenInRangeLocation];

    // ✅ important:
    // 'formattableSlice' tells start to end indexes where need to apply format
    const splittedTokens = [
      ...firstTokenArrayRepresentation,
      ...tokensInRangeLocation.slice(1, -1),
      ...lastTokenArrayRepresentation
    ];
    const formattableSlice = {
      start: isFirstTokenSplittable ? 1 : 0,
      end: isLastTokenSplittable ? splittedTokens.length - 1 : splittedTokens.length
    };
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

  private insertFormattedTokens(tokens: Token[], { start, end }: RangeLocation): void {
    const originalTokens = this.model.getTokens();
    const beforeFormattedTokens = originalTokens.slice(0, start.index);
    const afterFormattedTokens = originalTokens.slice(end.index + 1);
    this.model.setTokens( [...beforeFormattedTokens, ...tokens, ...afterFormattedTokens]);
  }
}
