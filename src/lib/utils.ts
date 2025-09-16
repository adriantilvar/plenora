import { twMerge } from "tailwind-merge";
import type { ClassValue } from "./types";

export const safeTry = <T, E = Error>(operation: T): [T, null] | [null, E] => {
  try {
    const result = operation;
    return [result, null];
  } catch (e: unknown) {
    return [null, e as E];
  }
};

export const safeTryPromise = async <T, E = Error>(
  promise: Promise<T>,
): Promise<[T, null] | [null, E]> => {
  try {
    const result = await promise;
    return [result, null];
  } catch (e: unknown) {
    return [null, e as E];
  }
};

export const cx = (...inputs: ClassValue[]): string => {
  let result = "";

  for (const input of inputs) {
    if (!input || typeof input === "boolean") continue;

    if (typeof input === "string") {
      result += `${input} `;
      continue;
    }

    for (const [key, value] of Object.entries(input)) {
      if (value) result += `${key} `;
    }
  }

  return result.trimEnd();
};

export const cn = (...inputs: ClassValue[]) => twMerge(cx(...inputs));
