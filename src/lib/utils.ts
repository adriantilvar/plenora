import { twMerge } from "tailwind-merge";
import type { ClassValue } from "./types";

export const hasWindow = typeof window !== "undefined";

export function cx(...inputs: ClassValue[]): string {
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
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(cx(...inputs));
}

export function safeTry<T, E = Error>(operation: T): [T, null] | [null, E] {
  try {
    const result = operation;
    return [result, null];
  } catch (e: unknown) {
    return [null, e as E];
  }
}

export async function safeTryPromise<T, E = Error>(
  promise: Promise<T>,
): Promise<[T, null] | [null, E]> {
  try {
    const result = await promise;
    return [result, null];
  } catch (e: unknown) {
    return [null, e as E];
  }
}
