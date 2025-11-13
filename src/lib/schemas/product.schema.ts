import { z } from "zod";
import { ReviewSchema } from "./review.schema";

/**
 * Zod schema for product dimensions
 */
const DimensionsSchema = z.object({
  width: z.number(),
  height: z.number(),
  depth: z.number(),
});

/**
 * Zod schema for product metadata
 */
const MetaSchema = z.object({
  createdAt: z.string(), // ISO8601
  updatedAt: z.string(), // ISO8601
  barcode: z.string(),
  qrCode: z.string(),
});

/**
 * Zod schema for product validation from DummyJSON API
 * Includes all fields returned by the API
 */
export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number().positive(),
  discountPercentage: z.number().min(0).max(100),
  rating: z.number().min(0).max(5),
  stock: z.number().int().nonnegative(),
  tags: z.array(z.string()),
  brand: z.string().optional(),
  sku: z.string(),
  weight: z.number(),
  dimensions: DimensionsSchema,
  warrantyInformation: z.string(),
  shippingInformation: z.string(),
  availabilityStatus: z.string(),
  reviews: z.array(ReviewSchema).optional(),
  returnPolicy: z.string(),
  minimumOrderQuantity: z.number().int().positive(),
  meta: MetaSchema,
  thumbnail: z.string().url(),
  images: z.array(z.string().url()),
});

/**
 * Zod schema for product list response from DummyJSON API
 */
export const ProductListResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

/**
 * Zod schema for categories list
 */
export const CategoriesSchema = z.array(z.string());

// Export inferred types
export type Product = z.infer<typeof ProductSchema>;
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
export type Dimensions = z.infer<typeof DimensionsSchema>;
export type ProductMeta = z.infer<typeof MetaSchema>;
