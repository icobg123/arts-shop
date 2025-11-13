import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
} from "nuqs/server";

/**
 * Shared search params parser configuration for products pages
 * This ensures consistent parsing across server and client components
 */
export const productsSearchParamsCache = createSearchParamsCache({
  search: parseAsString.withDefault(""),
  category: parseAsString.withDefault("all"),
  page: parseAsInteger.withDefault(1),
  sortBy: parseAsString.withDefault(""),
  order: parseAsString.withDefault("asc"),
});

/**
 * Export individual parsers for use with useQueryStates in client components
 */
export const productsSearchParams = {
  search: parseAsString.withDefault(""),
  category: parseAsString.withDefault("all"),
  page: parseAsInteger.withDefault(1),
  sortBy: parseAsString.withDefault(""),
  order: parseAsString.withDefault("asc"),
};
