export const isTokenFormattable = (token: TokenBase | FormattableTokenBase): token is FormattableTokenBase => (
  Object.prototype.hasOwnProperty.call(token, 'formats')
);
