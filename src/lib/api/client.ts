import { z } from "zod";
import type { APIError } from "@/types/api";

/**
 * Custom API Error class
 */
export class APIErrorClass extends Error implements APIError {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Generic fetch API function with Zod validation and error handling
 *
 * @param url - The URL to fetch from
 * @param schema - Zod schema for runtime validation
 * @returns Validated and type-safe data
 * @throws {APIErrorClass} For API errors, network errors, or validation errors
 */
export async function fetchAPI<T>(
  url: string,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;

      if (response.status === 404) {
        errorMessage = "Resource not found";
      } else if (response.status >= 500) {
        errorMessage = "Server error, please try again later";
      } else if (response.status === 429) {
        errorMessage = "Too many requests, please try again later";
      }

      throw new APIErrorClass(response.status, errorMessage);
    }

    const data = await response.json();

    // Runtime validation with Zod
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Invalid API response:", error);
      throw new APIErrorClass(
        500,
        "Invalid data format received from API",
        error
      );
    }

    if (error instanceof APIErrorClass) {
      throw error;
    }

    // Network error or other unknown error
    console.error("Network error:", error);
    throw new APIErrorClass(0, "Network error, please check your connection");
  }
}
