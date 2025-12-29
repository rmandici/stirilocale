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
    if (cats?.length) {
      return { id: cats[0].id, slug: cats[0].slug, name: cats[0].name };
    }
  }
  return { slug: "general", name: "General" };
}

function featuredImageFromEmbedded(p: WPPost) {
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return "";

  // 1) încearcă să alegi un url non-webp din sizes
  const sizes = media?.media_details?.sizes;
  if (sizes && typeof sizes === "object") {
    const candidates = Object.values(sizes)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((s: any) => s?.source_url)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((u: any) => typeof u === "string");

    const nonWebp = candidates.find(
      (u: string) => !u.toLowerCase().endsWith(".webp")
    );
    if (nonWebp) return nonWebp;
  }

  // 2) fallback pe source_url
  const url = media?.source_url ?? "";
  if (url.toLowerCase().endsWith(".webp")) {
    // MU-pluginul din WP creează deja fallback .jpg lângă .webp
    return url.replace(/\.webp$/i, ".jpg");
  }
  return url;
}

function wpHeaders() {
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

/**
 * Fetch cu retry + timeout ca să evităm blocaje / flapping când WP e lent.
 */
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  opts?: { tries?: number; timeoutMs?: number }
) {
  const tries = opts?.tries ?? 2;
  const timeoutMs = opts?.timeoutMs ?? 8000;

  let lastErr: unknown;

  for (let i = 0; i < tries; i++) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(t);
      return res;
    } catch (e) {
      clearTimeout(t);
      lastErr = e;
    }
  }

  throw lastErr;
}

export async function getWpCategories(): Promise<Map<number, Category>> {
  try {
    const WP_BASE = process.env.WP_BASE_URL;
    if (!WP_BASE) return new Map();

    const url = `${WP_BASE}/wp-json/wp/v2/categories?per_page=100`;

    const res = await fetchWithRetry(
      url,
      {
        next: { revalidate: 300 }, // 5 min
        headers: wpHeaders(),
      },
      { tries: 2, timeoutMs: 8000 }
    );

    if (!res.ok) return new Map();
    if (!isJsonResponse(res)) return new Map();

    const cats: WPCategory[] = await res.json();
    const map = new Map<number, Category>();
    for (const c of cats) {
      map.set(c.id, { id: c.id, slug: c.slug, name: c.name });
    }
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
      const catRes = await fetchWithRetry(
        `${WP_BASE}/wp-json/wp/v2/categories?slug=${encodeURIComponent(
          opts.categorySlug
        )}`,
        {
          next: { revalidate: 300 },
          headers: wpHeaders(),
        },
        { tries: 2, timeoutMs: 8000 }
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

    const res = await fetchWithRetry(
      url,
      {
        next: { revalidate: 60 }, // 60s = stabil + suficient de fresh
        headers: wpHeaders(),
      },
      { tries: 2, timeoutMs: 9000 }
    );

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

export type WpPostResult =
  | { kind: "ok"; post: Post }
  | { kind: "not_found" }
  | { kind: "error"; status?: number; message: string };

export async function getWpPostBySlug(
  slug: string,
  opts?: { revalidate?: number }
): Promise<WpPostResult> {
  try {
    const WP_BASE = process.env.WP_BASE_URL;
    if (!WP_BASE) return { kind: "error", message: "WP_BASE_URL missing" };

    const url = `${WP_BASE}/wp-json/wp/v2/posts?slug=${encodeURIComponent(
      slug
    )}&_embed=1`;

    const res = await fetchWithRetry(
      url,
      {
        next: { revalidate: opts?.revalidate ?? 60 }, // default 60s; metadata poate seta 10s
        headers: wpHeaders(),
      },
      { tries: 2, timeoutMs: 9000 }
    );

    if (!res.ok) {
      // La WP, pentru slug inexistent: 200 + [] (de obicei).
      // 404 aici e de obicei endpoint/proxy/DNS problem.
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
