type FormattableSliceShift = 0 | 1;

export const resolveFormattableSliceShift = (tokenArrayRepresentation: SplittedTokenArrayRepresentation): FormattableSliceShift => {
  if (tokenArrayRepresentation.length === 1) return 0;
  if (tokenArrayRepresentation.length === 2) return 1;
  throw new Error('Incorrect token array representation for resolving formattable slice shift');
};
