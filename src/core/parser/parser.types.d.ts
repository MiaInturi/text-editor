type CodePoint = number;
type Position = number;
type Index = number;
type ConsumeMatchFunction = (codePoint: CodePoint) => boolean;
type ParseFunction = (parser: import('./parser').Parser) => boolean;
