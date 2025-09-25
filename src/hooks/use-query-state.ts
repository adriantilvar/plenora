import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type z from "zod";
import type { Maybe, NonEmptyArray, UniqueArray } from "@/lib/types";

type UseQueryStateOptions = Partial<{
  /**
   * Fallback value when query parameter is missing, empty, or fails validation.
   *
   * @remarks
   * - used when schema validation fails and `onParseError` is `"fallback"` (default)
   * - without this, empty/invalid values remove the query parameter entirely
   */
  defaultValue: string;
  /**
   * Zod schema for validating query parameter values.
   *
   * @remarks
   * - must return a string to maintain URLSearchParams compatibility.
   *
   * @example
   * ```tsx
   * // Enum validation
   * schema: z.enum(['small', 'medium', 'large'])
   *
   * // Number coercion to string
   * schema: z.coerce.number().min(1).transform(String)
   *
   * // Custom validation
   * schema: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
   * ```
   */
  schema: z.ZodType<string>;
  /**
   * Behavior when schema validation fails (defaults to `"fallback"`).
   *
   * @remarks
   * - `"fallback"` - use `defaultValue` if provided, otherwise remove parameter
   * - `"remove"` - always remove the parameter on validation failure
   */
  onParseError: "fallback" | "remove";
}>;

/**
 * A hook to manage a single URL query parameter.
 *
 * @param key - The name of the query parameter to track
 * @param options - Configuration options with the shape of `UseQueryStateOptions`
 * @returns A tuple containing the current value and a setter function (client-side navigation)
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [page, setPage] = useQueryState('page');
 *
 * // With default value
 * const [sort, setSort] = useQueryState('sort', {
 *   defaultValue: 'name'
 * });
 *
 * // With validation schema
 * const [status, setStatus] = useQueryState('status', {
 *   defaultValue: 'active'
 *   schema: z.enum(['active', 'inactive']),
 * });
 *
 * // Setter usage
 * setStatus('inactive');
 * ```
 *
 * @remarks
 * - `queryState` will be `null` if no query parameter exists and no default is provided
 * - query parameter deduplication (e.g. `step=goal&step=persona`) is out of scope for this
 * hook; it happens to deduplicate query strings sometimes, but it's complete/reliable
 */
export function useQueryState<const K extends string>(
  key: K,
  options?: UseQueryStateOptions,
): [Maybe<string>, (value: string) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const _stableKey = useRef<K>(key);
  const _stableOptions = useRef<UseQueryStateOptions>(options);
  const _stableSearchParams = useRef<URLSearchParams>(null);

  const queryState = useMemo(
    () => searchParams.get(_stableKey.current),
    [searchParams],
  );

  const setQueryState = useCallback(
    (value: string) => {
      const existingSearchParams = _stableSearchParams.current?.toString();

      const urlSearchParams = createQueryState({
        updates: [_stableKey.current, value],
        searchParams: existingSearchParams ?? "",
        options: _stableOptions.current,
      });

      const newSearchParams = urlSearchParams.toString();
      if (newSearchParams === existingSearchParams) {
        return;
      }

      _stableSearchParams.current = urlSearchParams;
      router.replace(
        //@ts-expect-error triggered by typedRoutes; pathname always contains valid path
        `${pathname}?${newSearchParams}`,
      );
    },
    [router, pathname],
  );

  useEffect(() => {
    const isInitialMount = _stableSearchParams.current === null;
    if (isInitialMount) {
      _stableSearchParams.current = searchParams;
    }
    const value = searchParams.get(_stableKey.current) ?? "";

    if (
      shouldUpdateQueryState({
        key: _stableKey.current,
        value,
        options: _stableOptions.current,
        paramExists: searchParams.has(_stableKey.current),
        isInitialMount,
        previousSearchParams: _stableSearchParams.current,
      })
    ) {
      _stableSearchParams.current = searchParams;
      setQueryState(value);
    }
  }, [searchParams, setQueryState]);

  return [queryState, setQueryState] as const;
}

/**
 *  A hook to manage multiple URL query parameters.
 *
 * @param keys Array of unique query parameter names to track
 * @param options Per-key configuration options, each having the shape of `UseQueryStringOptions`
 * @returns A tuple containing an object of current values and a setter function (client-side navigation)
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [queries, setQuery] = useQueriesState(['sort', 'filter']);
 * // queries: { sort: string | null, filter: string | null }
 *
 * // With per-key options
 * const [queries, setQuery] = useQueriesState(['page', 'sort'], {
 *   page: { defaultValue: '1', schema: z.coerce.number().min(1).transform(String) },
 *   sort: { defaultValue: 'name' }
 * });
 *
 * // Setter usage
 * setQuery('page', '2');
 * ```
 *
 * @remarks
 * - updates are batched when multiple parameters change simultaneously
 * - duplicate keys in the array are not allowed
 * - query parameter deduplication (e.g. `step=goal&step=persona`) is out of scope for this
 * hook; it happens to deduplicate query strings sometimes, but it's complete/reliable
 */
export function useQueriesState<const K extends NonEmptyArray<string>>(
  keys: UniqueArray<K>,
  options?: Record<K[number], UseQueryStateOptions>,
): [Record<K[number], Maybe<string>>, (key: K[number], value: string) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const _stableKeys = useRef(keys as K[number][]);
  const _stableOptions = useRef(options);
  const _stableSearchParams = useRef<URLSearchParams>(null);
  const _paramUpdates = useRef<Array<[K[number], string]>>([]);

  const _updateSearchParams = useCallback(
    (updates: NonEmptyArray<[K[number], string]>) => {
      const existingSearchParams = _stableSearchParams.current?.toString();

      const urlSearchParams = createQueryState({
        updates,
        searchParams: existingSearchParams ?? "",
        options: _stableOptions.current,
      });

      const newSearchParams = urlSearchParams.toString();
      if (newSearchParams === existingSearchParams) {
        return;
      }

      _stableSearchParams.current = urlSearchParams;
      router.replace(
        //@ts-expect-error triggered by typedRoutes; pathname always contains valid path
        `${pathname}?${newSearchParams}`,
      );
    },
    [pathname, router],
  );

  useEffect(() => {
    const isInitialMount = _stableSearchParams.current === null;
    if (isInitialMount) {
      _stableSearchParams.current = searchParams;
    }

    for (let i = 0; i < _stableKeys.current.length; i++) {
      const key = _stableKeys.current[i];
      const value = searchParams.get(key) ?? "";

      if (
        shouldUpdateQueryState({
          key,
          value,
          options: _stableOptions.current?.[key],
          paramExists: searchParams.has(key),
          isInitialMount,
          previousSearchParams: _stableSearchParams.current,
        })
      ) {
        _paramUpdates.current.push([key, value]);
      }

      if (_paramUpdates.current.length > 0) {
        _stableSearchParams.current = searchParams;
        _updateSearchParams(
          _paramUpdates.current as NonEmptyArray<[K[number], string]>,
        );
        _paramUpdates.current = [];
      }
    }
  }, [searchParams, _updateSearchParams]);

  const queryStrings = useMemo(() => {
    const object = {} as Record<K[number], Maybe<string>>;

    _stableKeys.current.forEach((key) => {
      object[key] = searchParams.get(key);
    });

    return object;
  }, [searchParams]);

  const setQueryStrings = useCallback(
    (key: K[number], value: string) => _updateSearchParams([[key, value]]),
    [_updateSearchParams],
  );

  return [queryStrings, setQueryStrings] as const;
}

function shouldUpdateQueryState({
  key,
  value,
  options,
  paramExists,
  previousSearchParams,
  isInitialMount,
}: {
  key: string;
  value: string;
  options?: UseQueryStateOptions;
  paramExists: boolean;
  previousSearchParams: URLSearchParams | null;
  isInitialMount: boolean;
}): boolean {
  const hasOptions: boolean = !!options && !!Object.keys(options).length;

  if (!hasOptions && paramExists && !!value) return false;

  const hasDefaultValue: boolean = hasOptions && !!options?.defaultValue;
  const hasSchema: boolean = hasOptions && !!options?.schema;

  return (
    (isInitialMount && hasDefaultValue && value !== options?.defaultValue) ||
    (isInitialMount && !hasDefaultValue && hasSchema) ||
    (paramExists && !value) ||
    (!paramExists && hasDefaultValue) ||
    (hasSchema && value !== previousSearchParams?.get(key))
  );
}

function updateQueryState<Key extends string, Value extends string>(
  updates: [Key, Value],
  searchParams: URLSearchParams,
  options?: UseQueryStateOptions,
): void {
  const [key, value] = updates;
  if (!options) {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    return;
  }

  const { defaultValue, schema, onParseError = "fallback" } = options;
  const shouldFallback = onParseError === "fallback" && defaultValue;
  const shouldRemove = onParseError === "remove" || !defaultValue;

  if (schema) {
    const validationResult = schema.safeParse(value);

    if (validationResult.success) {
      searchParams.set(key, validationResult.data);
      return;
    }

    if (shouldFallback) {
      searchParams.set(key, defaultValue);
      return;
    }

    if (shouldRemove) {
      searchParams.delete(key);
      return;
    }
  }

  if (!value && shouldFallback) {
    searchParams.set(key, defaultValue);
    return;
  }

  if (!value && shouldRemove) {
    searchParams.delete(key);
    return;
  }

  if (value) {
    searchParams.set(key, value);
  }
}

type CreateQueryStateArgs<Key extends string, Value extends string> =
  | {
      updates: [Key, Value];
      searchParams: string;
      options?: UseQueryStateOptions;
    }
  | {
      updates: NonEmptyArray<[Key, Value]>;
      searchParams: string;
      options?: Record<Key, UseQueryStateOptions>;
    };

function createQueryState<Key extends string, Value extends string>({
  updates,
  searchParams,
  options,
}: CreateQueryStateArgs<Key, Value>): URLSearchParams {
  const urlSearchParams = new URLSearchParams(searchParams);

  if (Array.isArray(updates[0])) {
    for (let i = 0; i < updates.length; i++) {
      updateQueryState(
        updates[i] as [Key, Value],
        urlSearchParams,
        (options as Record<Key, UseQueryStateOptions>)?.[
          (updates[i] as [Key, Value])[0]
        ],
      );
    }
  } else {
    updateQueryState(
      updates as [Key, Value],
      urlSearchParams,
      options as UseQueryStateOptions,
    );
  }

  return urlSearchParams;
}
