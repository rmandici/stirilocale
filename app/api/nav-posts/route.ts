import { NextResponse } from "next/server";

// const WP_BASE = process.env.WP_BASE_URL;

type WPRendered = { rendered: string };

type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: WPRendered;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
    "wp:term"?: Array<
      Array<{ taxonomy?: string; slug?: string; name?: string }>
    >;
  };
};

type WPCategory = { id: number; slug: string; name: string };

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Strip HTML tags from a string, trim whitespace and return the result.
 * @param {string} html The string to strip HTML from.
 * @returns {string} The string with HTML stripped.
 */
/*******  4040caed-d9af-4c7a-b94d-495293d9d8b0  *******/
function stripHtml(html: string) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ro-RO");
  } catch {
    return "recent";
  }
}

function wpHeaders() {
  return {
    accept: "application/json",
    "user-agent":
      "Mozilla/5.0 (compatible; CallatisPressBot/1.0; +https://callatispress.ro)",
  };
}


export const revalidate = 60;

export async function GET(req: Request) {
  try {
    const WP_BASE = process.env.WP_BASE_URL;
if (!WP_BASE) return NextResponse.json([]);

    const { searchParams } = new URL(req.url);
    const categorySlug = (searchParams.get("category") || "").trim();
    const limit = Math.min(Number(searchParams.get("limit") || 6), 10);

    if (!categorySlug) return NextResponse.json([]);

    // 1) find category ID by slug
    const catRes = await fetch(
      `${WP_BASE}/wp-json/wp/v2/categories?slug=${encodeURIComponent(
        categorySlug
      )}`,
      { headers: wpHeaders(), next: { revalidate: 300 } } // categoria se schimbă rar

    );

    if (!catRes.ok) return NextResponse.json([]);

    const cats = (await catRes.json()) as WPCategory[];
    const catId = cats?.[0]?.id;
    if (!catId) return NextResponse.json([]);

    // 2) fetch posts
    const postsRes = await fetch(
      `${WP_BASE}/wp-json/wp/v2/posts?per_page=${limit}&categories=${catId}&_embed=1`,
      { headers: wpHeaders(), cache: "no-store" }
    );

    if (!postsRes.ok) return NextResponse.json([]);

    const wpPosts = (await postsRes.json()) as WPPost[];

    const out = wpPosts.map((p) => {
      const image = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";

      return {
        slug: p.slug,
        title: stripHtml(p.title?.rendered || ""),
        categorySlug,
        image: image || undefined,
        dateLabel: fmtDate(p.date),
      };
    });

    return NextResponse.json(out, {
  headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=300" },
});
  } catch {
    return NextResponse.json([]);
  }
}
