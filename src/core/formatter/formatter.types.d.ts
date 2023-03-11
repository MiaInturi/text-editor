interface SelectionRange {
  from: Position;
  to: Position;
}

interface PositionLocationInTokens {
  index: Index;
  offset: number;
}

interface RangeLocationInTokens {
  start: PositionLocationInTokens;
  end: PositionLocationInTokens;
}
