"use server";

import { revalidatePath } from "next/cache";

/**
 * Revalidates the cache for all pages under the root layout.
 * This purges the server-side "use cache" and client-side Router Cache,
 * ensuring any database modifications reflect instantly on the storefront.
 */
export async function revalidateProductCache() {
  try {
    revalidatePath("/", "layout");
    console.log("Successfully revalidated product cache for layout '/'");
  } catch (error) {
    console.error("Failed to revalidate product cache:", error);
  }
}
