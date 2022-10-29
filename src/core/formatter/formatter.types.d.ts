interface FormatRange {
  from: Position;
  to: Position;
}

interface FormatRangeEdgeLocation {
  index: Index;
  offset: number;
}

interface FormatRangeLocation {
  start: FormatRangeEdgeLocation;
  end: FormatRangeEdgeLocation;
}
