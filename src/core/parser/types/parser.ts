import type { Parser } from '../parser';

export type ConsumeMatchFunction = (codePoint: number) => boolean;
export type ParseFunction = (parser: Parser) => boolean;
