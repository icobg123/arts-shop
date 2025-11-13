import { fetchAPI } from "./client";
import {
  ProductSchema,
  ProductListResponseSchema,
  CategoriesSchema,
  type Product,
  type ProductListResponse,
} from "@/lib/schemas/product.schema";
import type { GetProductsParams } from "@/types/api";

const BASE_URL = "https://dummyjson.com";

/**
 * Get products with optional filtering, pagination, search, and sorting
 *
 * @param params - Query parameters for filtering, pagination, and sorting
 * @returns Product list with pagination info
 */
export async function getProducts(
  params: GetProductsParams = {}
): Promise<ProductListResponse> {
  const { limit = 30, skip = 0, search, category, sortBy, order } = params;

  let url = `${BASE_URL}/products`;

  if (search) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(search)}`;
  } else if (category && category !== "all") {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}`;
  }

  // Add pagination parameters
  const separator = search ? "&" : "?";
  url += `${separator}limit=${limit}&skip=${skip}`;

  // Add sorting parameters if provided
  if (sortBy && sortBy.trim() !== "") {
    url += `&sortBy=${encodeURIComponent(sortBy)}&order=${order || "asc"}`;
  }

  return fetchAPI(url, ProductListResponseSchema);
}

/**
 * Get a single product by ID
 *
 * @param id - Product ID
 * @returns Product details with reviews
 */
export async function getProduct(id: number): Promise<Product> {
  const url = `${BASE_URL}/products/${id}`;
  return fetchAPI(url, ProductSchema);
}

/**
 * Get all available product categories
 *
 * @returns Array of category slugs
 */
export async function getCategories(): Promise<string[]> {
  const url = `${BASE_URL}/products/categories`;
  const categories = await fetchAPI(url, CategoriesSchema);
  // Extract slugs from category objects
  return categories.map((cat) => cat.slug);
}

/**
 * Get products by category
 *
 * @param category - Category name
 * @param limit - Number of products to return
 * @returns Product list
 */
export async function getProductsByCategory(
  category: string,
  limit = 20
): Promise<ProductListResponse> {
  const url = `${BASE_URL}/products/category/${encodeURIComponent(
    category
  )}?limit=${limit}`;
  return fetchAPI(url, ProductListResponseSchema);
}

/**
 * Generate product URL with category and product ID
 *
 * @param category - Category slug
 * @param productId - Product ID
 * @returns Product URL path
 */
export function getProductUrl(category: string, productId: number): string {
  return `/products/${encodeURIComponent(category)}/${productId}`;
}

/**
 * Get category URL
 *
 * @param category - Category slug
 * @returns Category URL path
 */
export function getCategoryUrl(category: string): string {
  return `/categories/${encodeURIComponent(category)}`;
}
