import { NextResponse } from "next/server";
import type { Post } from "../../lib/wp";
import { getWpPosts } from "../../lib/wp";
import { posts as demoPosts } from "../../data/posts";

export const revalidate = 60;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 4) || 4, 10);

  const wpPosts = await getWpPosts({ perPage: 50 });

  // ✅ exact ca în page.tsx
  const posts: Post[] =
    wpPosts.length >= 8 ? wpPosts : (demoPosts as unknown as Post[]);

  const latest = [...posts].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );

  const out = latest.slice(0, limit).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: { name: p.category?.name ?? "", slug: p.category?.slug ?? "" },
  }));

  return NextResponse.json(out, {
  headers: {
    // cache pe CDN + stale-while-revalidate = stabil la refresh
    "cache-control": "public, s-maxage=60, stale-while-revalidate=300",
  },
});

}
