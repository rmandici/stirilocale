const WP = process.env.WORDPRESS_URL!;

function stripTags(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCategory(wpPost: any) {
  const cats = wpPost?._embedded?.["wp:term"]?.[0] ?? [];
  const first = cats[0];
  return {
    slug: first?.slug ?? "general",
    name: first?.name ?? "General",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getFeaturedImage(wpPost: any) {
  return wpPost?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";
}

export type FrontPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: { slug: string; name: string };
  author: string;
  publishedAt: string;
  image: string;
  images: string[];
  featured?: boolean;
  views: number;
  video?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapWpPost(p: any): FrontPost {
  return {
    id: String(p.id),
    slug: p.slug,
    title: p.title?.rendered ?? "",
    excerpt: stripTags(p.excerpt?.rendered ?? ""),
    content: p.content?.rendered ?? "",
    category: getCategory(p),
    author: p?._embedded?.author?.[0]?.name ?? "Redacția",
    publishedAt: new Date(p.date).toISOString(),
    image: getFeaturedImage(p),
    images: Array.isArray(p.images) ? p.images : [],
    featured: !!p.featured,
    views: Number.isFinite(p.views) ? p.views : 0,
    video: p.video || undefined,
  };
}

export async function getPosts(): Promise<FrontPost[]> {
  const res = await fetch(`${WP}/wp-json/wp/v2/posts?per_page=50&_embed=1`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Nu pot citi postările din WordPress");
  const data = await res.json();
  return data.map(mapWpPost);
}

export async function getPostBySlug(slug: string): Promise<FrontPost | null> {
  const res = await fetch(
    `${WP}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Nu pot citi articolul din WordPress");
  const arr = await res.json();
  return arr?.[0] ? mapWpPost(arr[0]) : null;
}
