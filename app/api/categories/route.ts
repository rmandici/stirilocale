import { NextResponse } from "next/server";

const WP_BASE = process.env.WP_BASE_URL;

type WPCategory = { id: number; slug: string; name: string };

const EXCLUDE = new Set(["uncategorized"]);

export async function GET() {
  if (!WP_BASE) {
    return NextResponse.json({ error: "Missing WP_BASE_URL" }, { status: 500 });
  }

  const url = `${WP_BASE}/wp-json/wp/v2/categories?per_page=100&hide_empty=false`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    return NextResponse.json(
      { error: `WP categories fetch failed: ${res.status}` },
      { status: 500 }
    );
  }

  const cats: WPCategory[] = await res.json();

  const data = cats
    .filter((c) => c?.slug && c?.name)
    .filter((c) => !EXCLUDE.has(c.slug.toLowerCase()))
    .map((c) => ({ slug: c.slug, name: c.name }));

  return NextResponse.json(data);
}
