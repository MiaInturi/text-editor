import { cloneToken } from '@core/model/utils/helpers/shared';
import { addUniqueValueIntoArray } from '@utils/helpers/array';

export const applyFormatToToken = (token: FormattableTokenBase, format: TokenFormat, deleteFormat: boolean = false): FormattableTokenBase => {
  return {
    ...cloneToken(token),
    formats: deleteFormat
      ? token.formats.filter((alreadyAppliedFormat) => alreadyAppliedFormat !== format)
      : addUniqueValueIntoArray(token.formats, format)
  };
};
