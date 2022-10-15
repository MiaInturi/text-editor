interface Range {
  from: Position;
  to: Position;
}

interface RangeEdgeLocation {
  index: number;
  offset: number;
}

interface RangeLocation {
  start: RangeEdgeLocation;
  end: RangeEdgeLocation;
}

interface SplittedTokensByRangeLocation {
  splittedTokens: Token[];
  formattableSlice: { start: number; end: number; };
}
