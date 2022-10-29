import { addUniqueValueIntoArray } from '@utils/helpers/array';

export const applyFormatToToken = (token: FormattableTokenBase, format: TokenFormat, deleteFormat: boolean = false): FormattableTokenBase => {
  return {
    ...token,
    formats: deleteFormat
      ? token.formats.filter((alreadyAppliedFormat) => alreadyAppliedFormat !== format)
      : addUniqueValueIntoArray(token.formats, format)
  };
};
