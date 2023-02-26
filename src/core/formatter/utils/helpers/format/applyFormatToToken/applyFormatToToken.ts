export const applyFormatToToken = <T extends FormattableTokenBase>(token: T, format: TokenFormat, deleteFormat: boolean = false): T => {
  if (deleteFormat) {
    token.formats.delete(format);
    return token;
  }
  token.formats.add(format);
  return token;
};
