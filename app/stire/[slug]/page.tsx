/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "../../data/posts"; // fallback demo (până legi WP)
import { PopularInCategory } from "../../components/PopularInCategory";

// dacă ai WP gata, înlocuiești:
// import { getPostBySlug } from "../../lib/wp";

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ro-RO");
  } catch {
    return "";
  }
}

export default async function StirePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // ✅ DEMO: căutăm în posts locale
  const post = posts.find((p) => p.slug === slug) ?? null;

  // ✅ WP: când e gata, folosești:
  // const post = await getPostBySlug(slug);

  if (!post) return notFound();

  // Populare doar din aceeași categorie (după views)
  const popular = [...posts]
    .filter(
      (p) => p.category.slug === post.category.slug && p.slug !== post.slug
    )
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0));

  // maxim 5 poze (dacă există array de imagini în data ta)
  const gallery = (post.images?.length ? post.images : [])
    .filter(Boolean)
    .slice(0, 5);

  return (
    <main className="bg-white text-gray-900 dark:bg-[#0b131a] dark:text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          {/* STÂNGA: articol */}
          <article className="md:col-span-8">
            {/* (opțional) breadcrumb simplu */}
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

            {/* HERO (dacă vrei să o lași la latitudinea editorului, poți scoate blocul ăsta) */}
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

            {/* Galerie opțională (max 5) – nu te obligă, editorul poate pune imagini în content */}
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

            {/* Conținut – editorul controlează poziționarea text/imagini */}
            <div
              className="
                prose prose-lg mt-10 max-w-none
                prose-headings:font-extrabold
                dark:prose-invert
              "
              // în demo, `post.content` poate să nu existe; poți scoate fallback
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              dangerouslySetInnerHTML={{ __html: (post as any).content ?? "" }}
            />
          </article>

          {/* DREAPTA: articole populare */}
          <div className="md:col-span-4 sticky top-24">
            <div>
              <PopularInCategory posts={popular} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
