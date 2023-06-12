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
  const regexStr = `(${start})(.+?)(${end})`;
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
