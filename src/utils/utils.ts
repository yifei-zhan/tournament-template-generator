import assert from "assert";

export const ensureDefined = <T>(data: T | undefined): T => {
  assert(data);
  return data;
};

export type CompareFn<T> = (x: T, y: T) => number;

export function sort<T>(array: T[], comparers: CompareFn<T>[]): T[] {
  return array.sort((x, y) => comparers.reduce((prev, next) => prev || next(x, y), 0));
}

export function extractStrBetween(str: string, start: string, end: string): string {
  const startIndex = str.indexOf(start);
  return str.slice(startIndex + start.length + 1, str.lastIndexOf(end));
}

export function replaceOne(str: string, match: string, replaceTo: string): string {
  return str.replace(new RegExp(match), replaceTo);
}

interface ReplaceBetweenParams {
  str: string;
  start: string;
  end: string;
  replaceTo: string;
  replaceSearchingTerm?: boolean;
}
export function replaceBetween({
  str,
  start,
  end,
  replaceTo,
  replaceSearchingTerm,
}: ReplaceBetweenParams): string {
  // Comment: use [\s\S] instead of . to match any character including new line
  const regexStr = `(${start})([\\s\\S]*?)(${end})`;
  const replace = replaceSearchingTerm ? replaceTo : `$1${replaceTo}$3`;
  return str.replace(new RegExp(regexStr), replace);
}

export function insertAfter(str: string, match: string, strToBeAdded: string): string {
  if (!str.includes(match)) {
    return str;
  }

  const startIndex = str.indexOf(match) + match.length;
  const strBefore = str.slice(0, startIndex);
  const strAfter = str.slice(startIndex + 1);

  return `${strBefore}${strToBeAdded}${strAfter}`;
}

export function appendTo(str: string, strToBeAdded: string): string {
  return `${str}${strToBeAdded}`;
}

export const getStrAsciiSum = (str: string) =>
  [...str].reduce((sum, currentChar) => sum + (currentChar.codePointAt(0) ?? 0), 0);
