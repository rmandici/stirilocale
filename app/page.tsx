import Link from "next/link";
import { posts } from "./data/posts";
import { categories } from "./data/categories";
import { StoryCard } from "./components/StoryCard";
import { FeaturedHero } from "./components/FeaturedHero";

export default function Home() {
  const featured = posts.find((p) => p.featured);

  const latest = [...posts].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );

  // dacă featured e și în latest, îl scoatem din listă
  const filtered = featured
    ? latest.filter((p) => p.id !== featured.id)
    : latest;

  const hero = filtered[0];

  // posts rămase pentru secțiuni
  const remaining = hero ? filtered.slice(1) : filtered;

  // helper: posts per categorie
  const byCat = (slug: (typeof categories)[number]["slug"]) =>
    remaining.filter((p) => p.category.slug === slug);

  // “video” (demo): ia dintr-o categorie sau din posts marcate video (cum vrei)
  const videoPosts = posts.filter((p) => p.video);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold">Demo știri</h1>

      {/* HERO EVIDENȚIAT CU SLIDESHOW */}
      {featured && <FeaturedHero post={featured} />}

      <div className="mt-6 grid gap-6 md:grid-cols-12">
        {/* STÂNGA – CONȚINUT */}
        <section className="md:col-span-8">
          {/* HERO MIC (prima știre după featured) */}
          {hero && (
            <div className="rounded-lg border p-4">
              <div className="text-xs text-gray-500">{hero.category.name}</div>
              <h2 className="mt-2 text-2xl font-bold">{hero.title}</h2>
              <p className="mt-2 text-gray-600">{hero.excerpt}</p>
            </div>
          )}

          {/* SECȚIUNI PE CATEGORII (ancore pentru header) */}
          {categories.slice(0, 5).map((cat) => {
            const items = byCat(cat.slug).slice(0, 6);
            if (items.length === 0) return null;

            return (
              <section
                key={cat.slug}
                id={`cat-${cat.slug}`}
                className="mt-10 scroll-mt-28"
              >
                <div className="flex items-end justify-between">
                  <h2 className="text-xl font-bold">{cat.name}</h2>
                  <Link
                    href={`/#cat-${cat.slug}`}
                    className="text-sm text-gray-500 hover:text-black"
                  >
                    Vezi toate
                  </Link>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {items.map((p) => (
                    <StoryCard key={p.id} post={p} />
                  ))}
                </div>
              </section>
            );
          })}
        </section>

        {/* DREAPTA – SIDEBAR */}
        <aside className="md:col-span-4">
          {/* VIDEO (NON-sticky, mai mic, sub sticky) */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-700">
              Video
            </h3>

            <div className="mt-3 space-y-4">
              {(videoPosts.length ? videoPosts : remaining.slice(0, 4))
                .slice(0, 4)
                .map((p) => (
                  <Link
                    key={p.id}
                    href={`/stire/${p.slug}`}
                    className="group block"
                  >
                    <div className="flex gap-3">
                      {/* video thumbnail (real mp4) */}
                      <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-md bg-black">
                        {p.video ? (
                          <video
                            src={p.video}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover"
                            autoPlay
                          />
                        ) : (
                          // fallback dacă nu are video
                          <div className="h-full w-full bg-gray-200" />
                        )}

                        {/* play icon */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4 text-white"
                              fill="currentColor"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* text */}
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-wide text-gray-500">
                          {p.category.name}
                        </div>
                        <div className="text-sm font-semibold leading-snug line-clamp-2 group-hover:underline">
                          {p.title}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
          {/* STICKY DOAR PENTRU currency + cele mai citite */}
          <div className="sticky top-24 space-y-4 mt-6">
            {/* Cele mai citite (poți face primul ca mini-card ulterior) */}
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold">Cele mai citite</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {[...posts]
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((p) => (
                    <li key={p.id} className="line-clamp-2">
                      {p.title}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Currency (demo) */}
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold">Curs valutar (demo)</h3>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>EUR</span>
                  <span>5.09</span>
                </div>
                <div className="flex justify-between">
                  <span>USD</span>
                  <span>4.33</span>
                </div>
                <div className="flex justify-between">
                  <span>GBP</span>
                  <span>5.80</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">Actualizat azi</div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
