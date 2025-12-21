import { NextResponse } from "next/server";

const WP_BASE = process.env.WP_BASE_URL;

type WPRendered = { rendered: string };
type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: WPRendered;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _embedded?: any;
};

type WPCategory = { id: number; slug: string; name: string };

function stripHtml(html: string) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wpHeaders() {
  return {
    accept: "application/json",
    "user-agent":
      "Mozilla/5.0 (compatible; CallatisPressBot/1.0; +https://callatispress.ro)",
  };
}

function featuredImageFromEmbedded(p: WPPost) {
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  return media?.source_url ?? "";
}

function authorNameFromEmbedded(p: WPPost) {
  return p._embedded?.author?.[0]?.name ?? "Redacție";
}

function firstCategoryFromEmbedded(p: WPPost) {
  const terms = p._embedded?.["wp:term"];
  if (Array.isArray(terms)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cats = terms.flat().filter((t: any) => t?.taxonomy === "category");
    if (cats?.length) return { slug: cats[0].slug, name: cats[0].name };
  }
  return { slug: "general", name: "General" };
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ro-RO");
  } catch {
    return "";
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    if (!WP_BASE) {
      return NextResponse.json([], {
        headers: { "cache-control": "no-store" },
      });
    }

    const { searchParams } = new URL(req.url);
    const categorySlug = String(searchParams.get("category") ?? "").trim();
    const limit = Math.min(Number(searchParams.get("limit") ?? 6) || 6, 10);

    if (!categorySlug) {
      return NextResponse.json([], {
        headers: { "cache-control": "no-store" },
      });
    }

    // 1) găsim ID-ul categoriei după slug
    const catRes = await fetch(
      `${WP_BASE}/wp-json/wp/v2/categories?slug=${encodeURIComponent(
        categorySlug
      )}`,
      { headers: wpHeaders(), cache: "no-store" }
    );
    if (!catRes.ok) return NextResponse.json([]);

    const cats: WPCategory[] = await catRes.json();
    const catId = cats?.[0]?.id;
    if (!catId) return NextResponse.json([]);

    // 2) luăm postări din categoria aia
    const qs = new URLSearchParams({
      per_page: String(limit),
      categories: String(catId),
      _embed: "1",
    });

    const postsRes = await fetch(
      `${WP_BASE}/wp-json/wp/v2/posts?${qs.toString()}`,
      {
        headers: wpHeaders(),
        cache: "no-store",
      }
    );
    if (!postsRes.ok) return NextResponse.json([]);

    const wpPosts: WPPost[] = await postsRes.json();

    const out = wpPosts.map((p) => {
      const cat = firstCategoryFromEmbedded(p);
      return {
        id: String(p.id),
        slug: p.slug,
        title: stripHtml(p.title?.rendered ?? ""),
        image: featuredImageFromEmbedded(p),
        author: authorNameFromEmbedded(p),
        dateLabel: fmtDate(p.date),
        categorySlug: cat.slug,
        categoryName: cat.name,
      };
    });

    return NextResponse.json(out, {
      headers: { "cache-control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json([], { headers: { "cache-control": "no-store" } });
  }
}
