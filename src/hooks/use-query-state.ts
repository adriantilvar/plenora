import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import type z from "zod";

type UseQueryStringOptions = Partial<{
  /**
   * Used as a fallback if:
   * - query string does not exist or the query string value is empty
   * - schema parsing fails and `onParseError` is set to `fallback` (default)
   *
   * Note:
   * If the query string value is empty value and `defaultValue` is not provided, query string gets removed
   */
  defaultValue: string;
  /**
   * Schema used to validate query string value. Must be of a string type to keep `URLSeachParams` flat.
   */
  schema: z.ZodType<string>;
  /**
   * On schema parse failure:
   * - `fallback` -> if `defaultValue` provided, set query string to it; otherwise remove query string
   * - `remove` -> remove query string
   */
  onParseError: "fallback" | "remove";
}>;

// TODO: Overload with array for multiple query strings
export const useQueryString = (
  key: string,
  options?: UseQueryStringOptions,
) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.get(key);
  const hasQueryString = searchParams.has(key);

  const {
    defaultValue = null,
    schema,
    onParseError = "fallback",
  } = options ?? {};

  const createQueryString = useCallback(
    (key: string, value: string) => {
      if (!value) {
        return getSearchParamsWithRemovedValue({ searchParams, key });
      }

      if (schema) {
        const result = schema.safeParse(value);

        if (result.success) {
          return getSearchParamsWithUpdatedValue({
            searchParams,
            key,
            value: result.data,
          });
        }

        if (onParseError === "fallback") {
          return defaultValue
            ? getSearchParamsWithUpdatedValue({
                searchParams,
                key,
                value: defaultValue,
              })
            : getSearchParamsWithRemovedValue({ searchParams, key });
        }

        if (onParseError === "remove") {
          return getSearchParamsWithRemovedValue({ searchParams, key });
        }
      }

      return getSearchParamsWithUpdatedValue({
        searchParams,
        key,
        value,
      });
    },
    [searchParams, defaultValue, onParseError, schema],
  );

  const setQueryString = useCallback(
    (value: string) => {
      router.replace(
        //@ts-expect-error triggered by typedRoutes; pathname always contains valid path
        `${pathname}?${createQueryString(key, value)}`,
      );
    },
    [key, router, pathname, createQueryString],
  );

  useEffect(() => {
    if ((hasQueryString && !queryString) || (!hasQueryString && defaultValue)) {
      setQueryString(defaultValue ?? "");
    }
  }, [defaultValue, hasQueryString, queryString, setQueryString]);

  return [queryString, setQueryString] as const;
};

function getSearchParamsWithUpdatedValue({
  searchParams,
  key,
  value,
}: {
  searchParams: URLSearchParams;
  key: string;
  value: string;
}): string {
  const params = new URLSearchParams(searchParams.toString());
  params.set(key, value);

  return params.toString();
}

function getSearchParamsWithRemovedValue({
  searchParams,
  key,
}: {
  searchParams: URLSearchParams;
  key: string;
}): string {
  const params = new URLSearchParams(searchParams.toString());
  params.delete(key);

  return params.toString();
}
