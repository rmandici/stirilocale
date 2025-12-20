/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "../../data/posts";
import { categories } from "../../data/categories";
import { MostRead } from "../../components/MostRead";
import { CategoryRemaining } from "../../components/CategoryRemaining";

// mic helper pt dată (opțional)
function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ro-RO");
  } catch {
    return "";
  }
}

// ✅ IMPORTANT: async + params Promise (cum ai la tine)
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const catPosts = posts
    .filter((p) => p.category.slug === slug)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  const mostRead = [...posts].sort((a, b) => b.views - a.views);

  const catFeatured = catPosts[0] ?? null;

  // ✅ sus consumăm: featured + 3 => total 4
  const remaining = catPosts.slice(4);

  return (
    <main>
      {/* ===== HERO + 3 ===== */}
      {catFeatured ? (
        <section className="bg-white text-gray-900 dark:bg-[#0b131a] dark:text-white">
          <div className="py-10">
            <div className="mx-auto max-w-6xl px-4">
              {/* titlu categorie */}
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="h-[3px] w-12 bg-red-600" />
                  <h1 className="mt-3 text-sm font-extrabold uppercase tracking-wide">
                    {cat.name}
                  </h1>
                </div>
              </div>

              {/* HERO: stânga text, dreapta imagine */}
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

                  <div className="mt-5 text-xs text-gray-500 dark:text-white/50">
                    {catFeatured.author ? `By ${catFeatured.author} · ` : ""}
                    {fmtDate(catFeatured.publishedAt)}
                  </div>
                </div>

                <div className="md:col-span-7">
                  <Link href={`/stire/${catFeatured.slug}`} className="block">
                    <img
                      src={catFeatured.image}
                      alt={catFeatured.title}
                      className="w-full object-cover"
                      style={{ aspectRatio: "16 / 9" }}
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                </div>
              </div>

              {/* 3 articole */}
              <div className="mt-10 grid gap-8 md:grid-cols-3">
                {catPosts.slice(1, 4).map((p) => (
                  <article key={p.id}>
                    <Link href={`/stire/${p.slug}`} className="block">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full object-cover"
                        style={{ aspectRatio: "16 / 9" }}
                        loading="lazy"
                        decoding="async"
                      />
                    </Link>

                    <Link
                      href={`/stire/${p.slug}`}
                      className="mt-3 block text-lg font-extrabold leading-snug hover:underline"
                    >
                      {p.title}
                    </Link>

                    <div className="mt-2 text-xs text-gray-500 dark:text-white/50">
                      {p.author ? `By ${p.author} · ` : ""}
                      {fmtDate(p.publishedAt)}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ===== RESTUL (o coloană) + MostRead în dreapta ===== */}
      <section className="bg-white text-gray-900 dark:bg-black dark:text-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-12 md:items-start">
            {/* STÂNGA: listă 1 col */}
            <div className="md:col-span-8">
              <div className="space-y-10">
                <CategoryRemaining posts={remaining} step={3} />
              </div>
            </div>

            {/* DREAPTA: MostRead sticky */}
            <div className="md:col-span-4 sticky top-24">
              <div className=" space-y-4">
                <MostRead posts={mostRead} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
