const isPositionReached = (targetPosition: Position, currentPosition: Position, includeEdge: boolean): boolean => (
  includeEdge ? (targetPosition <= currentPosition) : (targetPosition < currentPosition)
);

export const resolveRangeEdgeLocation = (tokens: Token[], targetPosition: Position, isIncludeEdge: boolean): RangeEdgeLocation => {
  let currentIndex = 0;
  let currentPosition = 0;

  while (true) {
    const token = tokens[currentIndex];
    currentPosition += token.value.length;

    if (isPositionReached(targetPosition, currentPosition, isIncludeEdge)) {
      const tokenRangeLocationIndex = currentIndex;
      const tokenRangeLocationOffset = targetPosition - (currentPosition - token.value.length);
      return { index: tokenRangeLocationIndex, offset: tokenRangeLocationOffset };
    }

    currentIndex += 1;
  }
};

