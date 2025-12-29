/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";
import { PopularInCategory } from "../../components/PopularInCategory";
import { posts as demoPosts } from "../../data/posts";
import { getWpPostBySlug, getWpPosts } from "../../lib/wp";

export const revalidate = 60;

const getPostCached = cache(async (slug: string) => {
  return getWpPostBySlug(slug, { revalidate: 60 });
});

function siteBase() {
  const s =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return s || "https://callatispress.ro";
}

function stripHtmlToText(html?: string) {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildDesc(post: { title: string; content?: string }) {
  const txt = stripHtmlToText(post.content);
  // Facebook afișează bine 150–200 caractere
  const short = txt.slice(0, 180).trim();
  return short || post.title;
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
type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params; // <-- IMPORTANT
  const site = siteBase();

  if (!slug) return { title: "Callatis Press" };

  const canonical = new URL(`/stire/${slug}`, site).toString();
  const fallbackOg = new URL("/og-home.jpg", site).toString();

  let r: any;
  try {
    r = await getPostCached(slug);
  } catch (e: any) {
    r = { kind: "error", message: e?.message ?? "WP fetch failed" };
  }

  // Dacă WP zice “not found”, nu indexăm și dăm meta coerentă (dar fără “undefined”).
  if (r.kind === "not_found") {
    const title = "Callatis Press";
    const description =
      "Știri din România: actualitate, local, politică, sport, ultimă oră.";

    return {
      metadataBase: new URL(site),
      title,
      description,
      alternates: { canonical },
      robots: { index: false, follow: false },
      openGraph: {
        type: "website",
        url: canonical,
        title,
        description,
        images: [{ url: fallbackOg, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [fallbackOg],
      },
    };
  }

  // Dacă WP are eroare tranzitorie, nu vrem 404 și nu vrem metadata goală.
  if (r.kind === "error") {
    const title = "Callatis Press";
    const description =
      "Știri din România: actualitate, local, politică, sport, ultimă oră.";

    return {
      metadataBase: new URL(site),
      title,
      description,
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        title,
        description,
        images: [{ url: fallbackOg, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [fallbackOg],
      },
    };
  }

  // OK
  const post = r.post;

  const ogImage = post?.image
    ? String(post.image).startsWith("http")
      ? String(post.image)
      : new URL(String(post.image), site).toString()
    : fallbackOg;

  const title = post?.title ? String(post.title) : "Callatis Press";
  const description = buildDesc({
    title,
    content: post?.content ? String(post.content) : undefined,
  });

  return {
    metadataBase: new URL(site),
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      siteName: "Callatis Press",
      locale: "ro_RO",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function StirePage({ params }: PageProps) {
  const { slug } = await params; // <-- IMPORTANT

  const r = await getPostCached(slug);

  // Demo fallback (din data/posts)
  const demoPost = demoPosts.find((p) => p.slug === slug) ?? null;
  console.log("StirePage slug =", slug, "WP result kind =", r.kind);
  if (r.kind !== "ok") console.log("WP result =", r);

  // Dacă WP zice "not found"
  if (r.kind === "not_found") {
    if (!demoPost) return notFound();
    // continuăm cu demo
  }

  // Dacă WP are eroare -> NU 404 (Facebook cache-uiește 404 ca “mort”)
  if (r.kind === "error") {
    if (!demoPost) {
      // nu 404, nu crash; afișăm un fallback safe
      return (
        <main className="bg-white text-gray-900 dark:bg-[#0b131a] dark:text-white">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="text-2xl font-extrabold">Momentan indisponibil</h1>
            <p className="mt-4 text-gray-600 dark:text-white/70">
              Serverul de conținut răspunde greu. Te rugăm să reîncerci în
              câteva secunde.
            </p>
          </div>
        </main>
      );
    }
    // altfel continuăm cu demo
  }

  const wpPost = r.kind === "ok" ? r.post : null;
  const post = wpPost ?? demoPost;
  console.log("StirePage slug =", slug, "WP result kind =", r.kind);
  if (r.kind !== "ok") console.log("WP result =", r);

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
