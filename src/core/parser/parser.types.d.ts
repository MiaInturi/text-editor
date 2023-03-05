type CodePoint = number;
type Position = number;
type Index = number;
type ConsumeMatchFunction = (codePoint: CodePoint) => boolean;
type ParserHandler = (parser: import('./parser').Parser) => boolean;
