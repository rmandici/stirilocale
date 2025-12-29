/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";

import { posts as demoPosts } from "../../data/posts";
import { categories as demoCategories } from "../../data/categories";

import { MostRead } from "../../components/MostRead";
import { CategoryRemaining } from "../../components/CategoryRemaining";

import { getWpPosts } from "../../lib/wp";

export const revalidate = 60; // cache stabil pt listări

type WPCategory = { id: number; slug: string; name: string };

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

async function getWpCategoryBySlug(slug: string): Promise<WPCategory | null> {
  const WP_BASE = process.env.WP_BASE_URL;
  try {
    if (!WP_BASE) return null;

    const res = await fetch(
      `${WP_BASE}/wp-json/wp/v2/categories?slug=${encodeURIComponent(
        slug
      )}&per_page=1`,
      {
        next: { revalidate: 300 }, // categorie se schimbă rar
        headers: wpHeaders(),
      }
    );

    if (!res.ok) return null;
    if (!isJsonResponse(res)) return null;

    const arr = (await res.json()) as WPCategory[];
    return arr?.[0] ?? null;
  } catch {
    return null;
  }
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) return notFound();

  // 1) WP categorie (pt titlu)
  const wpCat = await getWpCategoryBySlug(slug);

  // 2) WP postări filtrate de WP
  // getWpPosts deja are headers + isJson checks în lib/wp.ts (din ce mi-ai trimis)
  const wpPosts = await getWpPosts({ perPage: 50, categorySlug: slug });

  // 3) Fallback demo
  const demoCat = demoCategories.find((c) => c.slug === slug) ?? null;

  // IMPORTANT:
  // Dacă WP nu răspunde, dar ai categoria în demo -> mergi mai departe cu demo.
  // Dacă nu există nici în WP, nici în demo -> 404 real.
  const cat = wpCat
    ? { slug: wpCat.slug, name: wpCat.name }
    : demoCat
    ? { slug: demoCat.slug, name: demoCat.name }
    : null;

  if (!cat) return notFound();

  const catPosts =
    wpPosts.length > 0
      ? wpPosts
      : demoPosts
          .filter((p) => p.category?.slug === slug)
          .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  // Dacă nu există niciun post în categorie (nici WP, nici demo),
  // nu dăm neapărat 404 (poate categoria există dar e goală).
  // Totuși, dacă vrei 404 pe categorii goale, schimbă condiția.
  const catFeatured = catPosts[0] ?? null;
  const remaining = catPosts.slice(4);

  const mostRead = [...demoPosts].sort(
    (a, b) => (b.views ?? 0) - (a.views ?? 0)
  );

  return (
    <main>
      {catFeatured ? (
        <section className="bg-white text-gray-900 dark:bg-[#0b131a] dark:text-white">
          <div className="py-10">
            <div className="mx-auto max-w-6xl px-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="h-[3px] w-12 bg-red-600" />
                  <h1 className="mt-3 text-sm font-extrabold uppercase tracking-wide">
                    {cat.name}
                  </h1>
                </div>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-start">
                <div className="md:col-span-5">
                  <Link
                    href={`/stire/${catFeatured.slug}`}
                    className="block text-4xl font-extrabold leading-[1.05] hover:underline md:text-5xl"
                  >
                    {catFeatured.title}
                  </Link>

                  {catFeatured.excerpt ? (
                    <p className="mt-4 max-w-[60ch] text-base text-gray-600 dark:text-white/70">
                      {catFeatured.excerpt}
                    </p>
                  ) : null}
                </div>

                <div className="md:col-span-7">
                  <Link href={`/stire/${catFeatured.slug}`} className="block">
                    {catFeatured.image ? (
                      <img
                        src={catFeatured.image}
                        alt={catFeatured.title}
                        className="w-full object-cover"
                        style={{ aspectRatio: "16 / 9" }}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="aspect-[16/9] w-full rounded bg-gray-200 dark:bg-white/10" />
                    )}
                  </Link>
                </div>
              </div>

              <div className="mt-10 grid gap-8 md:grid-cols-3">
                {catPosts.slice(1, 4).map((p) => (
                  <article key={p.id ?? p.slug}>
                    <Link href={`/stire/${p.slug}`} className="block">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full object-cover"
                          style={{ aspectRatio: "16 / 9" }}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="aspect-[16/9] w-full rounded bg-gray-200 dark:bg-white/10" />
                      )}
                    </Link>

                    <Link
                      href={`/stire/${p.slug}`}
                      className="mt-3 block text-lg font-extrabold leading-snug hover:underline"
                    >
                      {p.title}
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white text-gray-900 dark:bg-black dark:text-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-12 md:items-start">
            <div className="md:col-span-8">
              <div className="space-y-10">
                <CategoryRemaining posts={remaining} step={3} />
              </div>
            </div>

            <div className="md:col-span-4 sticky top-24">
              <div className="space-y-4">
                <MostRead posts={mostRead} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
