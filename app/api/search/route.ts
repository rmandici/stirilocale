import { NextResponse } from "next/server";

const WP_BASE = process.env.WP_BASE_URL;

type WPRendered = { rendered: string };
type WPPost = {
  id: number;
  slug: string;
  title: WPRendered;
  excerpt: WPRendered;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _embedded?: any;
};

function stripHtml(html: string) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(req: Request) {
  if (!WP_BASE) {
    return NextResponse.json({ error: "Missing WP_BASE_URL" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) return NextResponse.json([]);

  const url =
    `${WP_BASE}/wp-json/wp/v2/posts` +
    `?search=${encodeURIComponent(q)}` +
    `&per_page=8&_embed=1`;

  const res = await fetch(url, { next: { revalidate: 30 } });

  if (!res.ok) {
    return NextResponse.json(
      { error: `WP search failed: ${res.status}` },
      { status: 500 }
    );
  }

  const posts: WPPost[] = await res.json();

  const data = posts.map((p) => {
    const image = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";

    return {
      id: String(p.id),
      slug: p.slug,
      title: stripHtml(p.title?.rendered ?? ""),
      excerpt: stripHtml(p.excerpt?.rendered ?? ""),
      image,
    };
  });

  return NextResponse.json(data);
}
