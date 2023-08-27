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

export const getStrAsciiSum = (str: string) =>
  [...str].reduce((sum, currentChar) => sum + (currentChar.codePointAt(0) ?? 0), 0);

interface GetRankingsParams<T> {
  items: T[];
  comparers: CompareFn<T>[];
  getRankingCriteria: (item: T) => number;
}

// Return rankings taking care of equally weighted item
export const getWithRankings = <T>({
  items,
  comparers,
  getRankingCriteria,
}: GetRankingsParams<T>): Array<{ ranking: number; data: T }> => {
  if (items.length === 0) {
    return [];
  }

  const sortedItems = sort(items, comparers);
  const grouppedItems: T[][] = [];

  for (const item of sortedItems) {
    if (grouppedItems.length === 0) {
      grouppedItems.push([item]);
      continue;
    }

    const currentWeight = getRankingCriteria(item);
    // eslint-disable-next-line unicorn/prefer-at
    const lastGroup = ensureDefined(grouppedItems[grouppedItems.length - 1]);
    const weightInLastGroup = getRankingCriteria(ensureDefined(lastGroup[0]));

    if (currentWeight === weightInLastGroup) {
      lastGroup.push(item);
    } else {
      grouppedItems.push([item]);
    }
  }

  const result: Array<{ ranking: number; data: T }> = [];

  let currentRanking = 1;
  for (const grouppedItem of grouppedItems) {
    for (const item of grouppedItem) {
      result.push({
        data: item,
        ranking: currentRanking,
      });
    }

    currentRanking += grouppedItem.length;
  }

  return result;
};
