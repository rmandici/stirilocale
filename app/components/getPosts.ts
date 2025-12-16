import { posts } from "../data/posts";

// Ajustează aici dacă structura ta e diferită
export function getLatestPostsByCategory(categorySlug: string, limit = 6) {
  return (
    posts
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((p: any) => p.categorySlug === categorySlug)
      .slice(0, limit)
  );
}
