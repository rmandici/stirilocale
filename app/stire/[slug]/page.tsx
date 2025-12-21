/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PopularInCategory } from "../../components/PopularInCategory";
import { posts as demoPosts } from "../../data/posts";
import { getWpPostBySlug, getWpPosts } from "../../lib/wp";

function siteBase() {
  const s =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return s || "https://callatispress.ro";
}

type Props = {
  params: { slug: string };
};

// ✅ TEST: metadata statică pe articol (fără WP)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = siteBase();
  const { slug } = params;

  const post = await getWpPostBySlug(slug);
  if (!post) return {};

  const canonical = new URL(`/stire/${slug}`, site).toString();

  const ogImage = post.image
    ? post.image.startsWith("http")
      ? post.image
      : new URL(post.image, site).toString()
    : new URL("/og-home.jpg", site).toString();

  const desc = post.excerpt?.trim() || post.title;

  return {
    metadataBase: new URL(site),
    title: post.title,
    description: desc,
    alternates: { canonical },

    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description: desc,
      siteName: "Callatis Press",
      locale: "ro_RO",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: desc,
      images: [ogImage],
    },
  };
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ro-RO");
  } catch {
    return "";
  }
}

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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
