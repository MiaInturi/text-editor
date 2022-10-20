import { resolveFormattableSliceShift } from '@core/formatter/utils/helpers/shared';

describe('\'resolveFormattableSliceShift\' helper', () =>  {
  test('Return 0 if array representation contain 1 token', () => {
    const tokenArrayRepresentation: SplittedTokenArrayRepresentation = [
      { type: 'text', value: 'text', formats: [] }
    ];
    expect(resolveFormattableSliceShift(tokenArrayRepresentation)).toEqual(0);
  });

  test('Return 0 if array representation contain 2 tokens', () => {
    const tokenArrayRepresentation: SplittedTokenArrayRepresentation = [
      { type: 'text', value: 'text', formats: [] },
      { type: 'text', value: 'text', formats: [] }
    ];
    expect(resolveFormattableSliceShift(tokenArrayRepresentation)).toEqual(1);
  });
});
