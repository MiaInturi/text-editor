type CodePoint = number;
type ConsumeMatchFunction = (codePoint: CodePoint) => boolean;
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type ParseFunction = (parser: import('./parser').Parser) => boolean;
