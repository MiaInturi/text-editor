const isPositionReached = (
  targetPosition: Position,
  currentPosition: Position,
  isIncludeEndEdge: boolean
): boolean => (
  isIncludeEndEdge ? (targetPosition <= currentPosition) : (targetPosition < currentPosition)
);

export const resolvePositionLocationInTokens = (
  tokens: Token[],
  targetPosition: Position,
  isIncludeEndEdge: boolean
): PositionLocationInTokens => {
  let currentIndex = 0;
  let currentPosition = 0;

  while (true) {
    const token = tokens[currentIndex];
    currentPosition += token.value.length;

    if (isPositionReached(targetPosition, currentPosition, isIncludeEndEdge)) {
      const tokenRangeLocationIndex = currentIndex;
      const tokenRangeLocationOffset = targetPosition - (currentPosition - token.value.length);
      return { index: tokenRangeLocationIndex, offset: tokenRangeLocationOffset };
    }

    currentIndex += 1;
  }
};

