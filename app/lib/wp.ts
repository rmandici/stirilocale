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
  publishedAt: string;
  image: string;
  images: string[];
  featured?: boolean;
  views: number;
  video?: string;
  hasVideo?: boolean;
};

// NOTE: nu ținem WP_BASE global (evită valori "stale" la HMR / serverless)


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

function decodeHtmlEntities(str: string) {
  return (str || "")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(html: string) {
  const text = (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return decodeHtmlEntities(text);
}

function detectHasVideo(html: string) {
  return /<iframe|<video|<source|youtube\.com|youtu\.be|vimeo\.com/i.test(html);
}

function firstCategoryFromEmbedded(p: WPPost): Category {
  const terms = p._embedded?.["wp:term"];
  if (Array.isArray(terms)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cats = terms.flat().filter((t: any) => t?.taxonomy === "category");
    if (cats?.length)
      return { id: cats[0].id, slug: cats[0].slug, name: cats[0].name };
  }
  return { slug: "general", name: "General" };
}

function featuredImageFromEmbedded(p: WPPost) {
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  return media?.source_url ?? "";
}

function wpHeaders() {
  // ajută pentru anumite protecții care tratează fetch-ul "fără UA" ca bot
  return {
    accept: "application/json",
    "user-agent":
      "Mozilla/5.0 (compatible; CallatisPressBot/1.0; +https://callatispress.ro)",
  };
}

function isJsonResponse(res: Response) {
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json");
}



export async function getWpCategories(): Promise<Map<number, Category>> {
  
  try {
    const WP_BASE = process.env.WP_BASE_URL;
if (!WP_BASE) return new Map();

const url = `${WP_BASE}/wp-json/wp/v2/categories?per_page=100`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: wpHeaders(),
    });
    if (!res.ok) return new Map();
    if (!isJsonResponse(res)) return new Map();

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
    const WP_BASE = process.env.WP_BASE_URL;
if (!WP_BASE) return [];

    const perPage = opts?.perPage ?? 20;

    let categoryId: number | null = null;
    if (opts?.categorySlug) {
      const catRes = await fetch(
        `${WP_BASE}/wp-json/wp/v2/categories?slug=${encodeURIComponent(
          opts.categorySlug
        )}`,
        { next: { revalidate: 300 }, headers: wpHeaders() }
      );
      if (catRes.ok && isJsonResponse(catRes)) {
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
    const res = await fetch(url, {
      next: { revalidate: 120 },
      headers: wpHeaders(),
    });
    if (!res.ok) return [];
    if (!isJsonResponse(res)) return [];

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

// lib/wp.ts
export type WpPostResult =
  | { kind: "ok"; post: Post }
  | { kind: "not_found" }
  | { kind: "error"; status?: number; message: string };

async function fetchJsonWithRetry(url: string, init: RequestInit, tries = 2) {
  let lastErr: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, init);
      return res;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export async function getWpPostBySlug(slug: string): Promise<WpPostResult> {
  try {
    const WP_BASE = process.env.WP_BASE_URL; // <-- citește fresh (evită HMR stale)
    if (!WP_BASE) return { kind: "error", message: "WP_BASE_URL missing" };

    const url = `${WP_BASE}/wp-json/wp/v2/posts?slug=${encodeURIComponent(
      slug
    )}&_embed=1`;

    // IMPORTANT: reducem spam-ul de requesturi la refresh
    // Revalidate mic = nu lovești WP la fiecare refresh, dar rămâne suficient de fresh.
    const res = await fetchJsonWithRetry(
      url,
      {
        next: { revalidate: 30 }, // <- anti-refresh-spam
        headers: wpHeaders(),
      },
      2
    );

    if (!res.ok) {
      // WP returnează 404 doar pentru endpoint/route, nu pentru “post inexistent”
      // (pentru post inexistent primești [] cu 200)
      if (res.status === 404) return { kind: "error", status: 404, message: "WP endpoint 404" };
      return { kind: "error", status: res.status, message: "WP non-OK" };
    }

    if (!isJsonResponse(res)) {
      return { kind: "error", status: res.status, message: "WP non-JSON" };
    }

    const arr = (await res.json()) as WPPost[];
    if (!Array.isArray(arr) || arr.length === 0) return { kind: "not_found" };

    const p = arr[0];
    const content = p.content?.rendered ?? "";
    const image = featuredImageFromEmbedded(p);
    const category = firstCategoryFromEmbedded(p);

    const post: Post = {
      id: String(p.id),
      slug: p.slug,
      title: stripHtml(p.title?.rendered ?? ""),
      excerpt: stripHtml(p.excerpt?.rendered ?? ""),
      content,
      hasVideo: detectHasVideo(content),
      category,
      publishedAt: p.date,
      image,
      images: image ? [image] : [],
      featured: false,
      views: 0,
      video: undefined,
    };

    return { kind: "ok", post };
  } catch (e) {
    return {
      kind: "error",
      message: e instanceof Error ? e.message : "WP fetch failed",
    };
  }
}

