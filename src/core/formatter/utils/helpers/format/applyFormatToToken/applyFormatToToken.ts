export const applyFormatToToken = (token: FormattableTokenBase, format: TokenFormat, deleteFormat: boolean = false): FormattableTokenBase => {
  if (deleteFormat) {
    token.formats.delete(format);
    return token;
  }
  token.formats.add(format);
  return token;
};
