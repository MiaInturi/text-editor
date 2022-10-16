interface Range {
  from: Position;
  to: Position;
}

interface RangeEdgeLocation {
  index: Index;
  offset: number;
}

interface RangeLocation {
  start: RangeEdgeLocation;
  end: RangeEdgeLocation;
}

interface SplittedTokensByRangeLocation {
  splittedTokens: Token[];
  formattableSlice: { start: Index; end: Index; };
}
