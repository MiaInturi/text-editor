import { resolveRangeEdgeLocation } from '@core/formatter/utils/helpers/shared';

describe('\'resolveRangeEdgeLocation\' helper', () => {
  const firstValue = 'text1';
  const secondValue = 'text2';
  const tokens: Token[] = [
    { type: 'text', value: firstValue, formats: [] },
    { type: 'text', value: secondValue, formats: [] },
  ];

  test('Return correct index and offset for not edged position', () => {
    const targetPosition: Position = firstValue.length + (secondValue.length - 2);
    const expectedRangeEdgeLocation: FormatRangeEdgeLocation = { index: 1, offset: secondValue.length - 2 };
    expect(resolveRangeEdgeLocation(tokens, targetPosition, false)).toStrictEqual(expectedRangeEdgeLocation);
  });

  test('Return correct index and offset for edged position when \'isIncludeEndEdge\' is false', () => {
    const targetPosition: Position = firstValue.length;
    const expectedRangeEdgeLocation: FormatRangeEdgeLocation = { index: 1, offset: 0 };
    expect(resolveRangeEdgeLocation(tokens, targetPosition, false)).toStrictEqual(expectedRangeEdgeLocation);
  });

  test('Return correct index and offset for edged position when \'isIncludeEndEdge\' is true', () => {
    const targetPosition: Position = firstValue.length;
    const expectedRangeEdgeLocation: FormatRangeEdgeLocation = { index: 0, offset: firstValue.length };
    expect(resolveRangeEdgeLocation(tokens, targetPosition, true)).toStrictEqual(expectedRangeEdgeLocation);
  });
});
