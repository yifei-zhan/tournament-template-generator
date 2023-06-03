export type CompareFn<T> = (x: T, y: T) => number;

export function sort<T>(array: T[], comparers: CompareFn<T>[]): T[] {
  return array.sort((x, y) => comparers.reduce((prev, next) => prev || next(x, y), 0));
}