/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";

import { PopularInCategory } from "../../components/PopularInCategory";
import { posts as demoPosts } from "../../data/posts";
import { getWpPostBySlug, getWpPosts } from "../../lib/wp";

type Params = { slug: string };
type MaybePromise<T> = T | Promise<T>;

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ro-RO");
  } catch {
    return "";
  }
}

async function resolveParams(params: MaybePromise<Params>): Promise<Params> {
  return await Promise.resolve(params);
}

/**
 * Scoate primul bloc <figure><img ...></figure> din content
 * DOAR dacă imaginea este aceeași cu featured (acceptă și variantele -1024x683 etc).
 */
function removeFirstDuplicateFeaturedImage(html: string, featuredUrl?: string) {
  if (!html || !featuredUrl) return html;

  const normalize = (url: string) => url.replace(/-\d+x\d+(?=\.\w+$)/, "");
  const featuredBase = normalize(featuredUrl);

  const re =
    /<figure[^>]*>\s*<img[^>]+src=["']([^"']+)["'][^>]*>\s*(?:<\/img>)?\s*<\/figure>/i;

  const m = html.match(re);
  if (!m) return html;

  const imgSrc = m[1];
  const imgBase = normalize(imgSrc);

  if (imgBase !== featuredBase) return html;

  return html.replace(re, "");
}

export default async function StirePage({
  params,
}: {
  params: MaybePromise<Params>; // ✅ merge și dacă e Promise, și dacă e obiect
}) {
  const { slug } = await resolveParams(params); // ✅ sigur

  const wpPost = await getWpPostBySlug(slug);
  const demoPost = demoPosts.find((p) => p.slug === slug) ?? null;

  const post = wpPost ?? demoPost;
  if (!post) return notFound();

  const isWP = Boolean(wpPost);

  const wpSameCat =
    isWP && post.category?.slug
      ? await getWpPosts({ perPage: 12, categorySlug: post.category.slug })
      : [];

  const popularPool = wpSameCat.length ? wpSameCat : demoPosts;

  const popular =
    popularPool === demoPosts
      ? popularPool
          .filter(
            (p) =>
              p.category.slug === post.category.slug && p.slug !== post.slug
          )
          .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      : popularPool.filter((p) => p.slug !== post.slug);

  const gallery = (!isWP && post.images?.length ? post.images : [])
    .filter(Boolean)
    .slice(0, 5);

  const contentHtml = isWP
    ? removeFirstDuplicateFeaturedImage(post.content ?? "", post.image)
    : post.content ?? "";

  return (
    <main className="bg-white text-gray-900 dark:bg-[#0b131a] dark:text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <article className="md:col-span-8">
            <div className="text-xs font-semibold text-gray-500 dark:text-white/50">
              <Link
                href={`/categorie/${post.category.slug}`}
                className="hover:underline"
              >
                {post.category.name}
              </Link>
            </div>

            <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] md:text-5xl">
              {post.title}
            </h1>

            <div className="mt-4 text-sm text-gray-500 dark:text-white/50">
              {post.author ? `By ${post.author} · ` : ""}
              {fmtDate(post.publishedAt)}
            </div>

            {post.image ? (
              <img
                src={post.image}
                alt=""
                className="mt-8 w-full object-cover"
                style={{ aspectRatio: "16 / 9" }}
                loading="lazy"
                decoding="async"
              />
            ) : null}

            {gallery.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {gallery.map((src, i) => (
                  <img
                    key={src + i}
                    src={src}
                    alt=""
                    className="w-full object-cover"
                    style={{ aspectRatio: "16 / 10" }}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            ) : null}

            <div
              className="
                prose prose-lg mt-10 max-w-none
                prose-headings:font-extrabold
                dark:prose-invert
              "
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </article>

          <div className="md:col-span-4 sticky top-24">
            <PopularInCategory posts={popular} />
          </div>
        </div>
      </div>
    </main>
  );
}
