export type ClassValue =
  | string
  | Record<string, boolean>
  | boolean
  | null
  | undefined;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Maybe<T> = NoInfer<T | undefined | null>;

export type NonEmptyArray<T> = [T, ...Array<T>];

type DuplicateElements<
  T extends unknown[],
  Seen = never,
  Duplicates = never,
> = T extends [infer First, ...infer Rest]
  ? First extends Seen
    ? DuplicateElements<Rest, Seen, Duplicates | First>
    : DuplicateElements<Rest, Seen | First, Duplicates>
  : Duplicates;

type UniqueElements<T extends unknown[]> = T[number];

declare const brand: unique symbol;

type ValidElements<T> = [T] & { [brand]: "ValidElements" };

export type UniqueArray<T extends unknown[]> =
  DuplicateElements<T> extends never ? T : ValidElements<UniqueElements<T>>;
