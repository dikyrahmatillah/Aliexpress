export async function getHotProducts(categoryId: number) {
  // Add caching options if needed
  // Next.js fetch with caching options
  try {
    const res = await fetch(
      `/api/aliexpress/hotproduct?categoryId=${categoryId}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error in getHotProducts:", error);
    throw error; // Re-throw to be caught by the caller
  }
}
