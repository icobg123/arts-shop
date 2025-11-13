/**
 * API-related TypeScript types
 */

export interface APIError extends Error {
  statusCode: number;
  details?: unknown;
}

export interface GetProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
}
