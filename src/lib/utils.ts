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
