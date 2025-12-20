// lib/wp.ts
export type Category = {
  id?: number | string;
  slug: string;
  name: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  author: string;
  publishedAt: string;
  image: string;
  images: string[];
  featured?: boolean;
  views: number;
  video?: string;
  hasVideo?: boolean;
};

const WP_BASE = process.env.WP_BASE_URL;

type WPRendered = { rendered: string };

type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  categories: number[];
  featured_media: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _embedded?: any;
};

type WPCategory = {
  id: number;
  slug: string;
  name: string;
};

function stripHtml(html: string) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function detectHasVideo(html: string) {
  return /<iframe|<video|<source|youtube\.com|youtu\.be|vimeo\.com/i.test(html);
}

function firstCategoryFromEmbedded(p: WPPost): Category {
  // WP poate avea wp:term -> categories/tags, în funcție de setup
  const terms = p._embedded?.["wp:term"];
  if (Array.isArray(terms)) {
    // de obicei [categories[], tags[]]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cats = terms.flat().filter((t: any) => t?.taxonomy === "category");
    if (cats?.length)
      return { id: cats[0].id, slug: cats[0].slug, name: cats[0].name };
  }
  return { slug: "general", name: "General" };
}

function featuredImageFromEmbedded(p: WPPost) {
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  // source_url e cel mai simplu
  const src = media?.source_url ?? "";
  return src;
}

function authorNameFromEmbedded(p: WPPost) {
  return p._embedded?.author?.[0]?.name ?? "Admin";
}

export async function getWpCategories(): Promise<Map<number, Category>> {
  try {
    if (!WP_BASE) return new Map();

    const url = `${WP_BASE}/wp-json/wp/v2/categories?per_page=100`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return new Map();

    const cats: WPCategory[] = await res.json();
    const map = new Map<number, Category>();
    for (const c of cats)
      map.set(c.id, { id: c.id, slug: c.slug, name: c.name });
    return map;
  } catch {
    return new Map();
  }
}

export async function getWpPosts(opts?: {
  perPage?: number;
  categorySlug?: string;
}) {
  try {
    if (!WP_BASE) return [];

    const perPage = opts?.perPage ?? 20;

    let categoryId: number | null = null;
    if (opts?.categorySlug) {
      const catRes = await fetch(
        `${WP_BASE}/wp-json/wp/v2/categories?slug=${encodeURIComponent(
          opts.categorySlug
        )}`,
        { next: { revalidate: 300 } }
      );
      if (catRes.ok) {
        const found: WPCategory[] = await catRes.json();
        categoryId = found?.[0]?.id ?? null;
      }
    }

    const qs = new URLSearchParams({
      per_page: String(perPage),
      _embed: "1",
    });
    if (categoryId) qs.set("categories", String(categoryId));

    const url = `${WP_BASE}/wp-json/wp/v2/posts?${qs.toString()}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];

    const wpPosts: WPPost[] = await res.json();

    return wpPosts.map((p, idx) => {
      const content = p.content?.rendered ?? "";
      const excerpt = stripHtml(p.excerpt?.rendered ?? "");
      const title = stripHtml(p.title?.rendered ?? "");

      const image = featuredImageFromEmbedded(p);
      const category = firstCategoryFromEmbedded(p);

      return {
        id: String(p.id),
        slug: p.slug,
        title,
        excerpt,
        content,
        hasVideo: detectHasVideo(content),
        category,
        author: authorNameFromEmbedded(p),
        publishedAt: p.date,
        image,
        images: image ? [image] : [],
        featured: idx === 0,
        views: 0,
        video: undefined,
      } satisfies Post;
    });
  } catch {
    return [];
  }
}

export async function getWpPostBySlug(slug: string) {
  try {
    if (!WP_BASE) return null;

    const url = `${WP_BASE}/wp-json/wp/v2/posts?slug=${encodeURIComponent(
      slug
    )}&_embed=1`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;

    const arr: WPPost[] = await res.json();
    if (!arr.length) return null;

    const p = arr[0];
    const content = p.content?.rendered ?? "";
    const image = featuredImageFromEmbedded(p);
    const category = firstCategoryFromEmbedded(p);

    return {
      id: String(p.id),
      slug: p.slug,
      title: stripHtml(p.title?.rendered ?? ""),
      excerpt: stripHtml(p.excerpt?.rendered ?? ""),
      content,
      hasVideo: detectHasVideo(content),
      category,
      author: authorNameFromEmbedded(p),
      publishedAt: p.date,
      image,
      images: image ? [image] : [],
      featured: false,
      views: 0,
      video: undefined,
    } satisfies Post;
  } catch {
    return null;
  }
}
