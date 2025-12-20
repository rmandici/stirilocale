/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { posts } from "./data/posts";
import { categories, CategorySlug } from "./data/categories";
import { FeaturedHero } from "./components/FeaturedHero";
import { AllPostsSection } from "./components/AllPostsSection";

// ✅ le ai deja create
import { CurrencyBox } from "./components/CurrencyBox";
import { MostRead } from "./components/MostRead";

function cn(...a: (string | false | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center bg-red-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
      {children}
    </span>
  );
}

function SectionTitle({
  title,

  light,
}: {
  title: string;
  href?: string;
  light?: boolean;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className={cn("h-[3px] w-8", light ? "bg-red-500" : "bg-red-600")}
        />
        <h2 className="text-sm font-extrabold uppercase tracking-wide dark:text-white text-gray-900">
          {title}
        </h2>
      </div>
    </div>
  );
}

function MiniStory({
  p,
  showThumb = true,
  light,
}: {
  p: (typeof posts)[number];
  showThumb?: boolean;
  light?: boolean;
}) {
  return (
    <Link href={`/stire/${p.slug}`} className="group block">
      <div className="flex gap-3">
        {showThumb && (
          // ❌ scos rounded-md
          <div className="h-16 w-24 flex-shrink-0 overflow-hidden">
            <img
              src={p.image}
              alt={p.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
        )}

        <div className="min-w-0">
          <div
            className={cn(
              "text-[11px] font-bold uppercase tracking-wide",
              light ? "text-white/60" : "text-gray-500"
            )}
          >
            {p.category.name}
          </div>
          <div
            className={cn(
              "mt-1 line-clamp-2 text-sm font-semibold leading-snug group-hover:underline",
              light ? "text-white" : "text-gray-900"
            )}
          >
            {p.title}
          </div>
        </div>
      </div>
    </Link>
  );
}

function BigCard({ p, tall }: { p: (typeof posts)[number]; tall?: boolean }) {
  return (
    // ❌ scos rounded-2xl
    <div className="">
      <div className="mt-4 inline-flex bg-red-600 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
        {p.category.name}
      </div>
      <Link
        href={`/stire/${p.slug}`}
        className="mt-2 block text-2xl font-extrabold leading-snug hover:underline"
      >
        {p.title}
      </Link>
      <p className="mt-2 text-gray-600 line-clamp-2">{p.excerpt}</p>

      <Link
        href={`/stire/${p.slug}`}
        // ❌ scos rounded-2xl
        className="mt-4 block overflow-hidden"
      >
        <img
          src={p.image}
          alt={p.title}
          className={cn("w-full object-cover", tall ? "h-[360px]" : "h-56")}
        />
      </Link>

      <div className="mt-3 text-xs text-gray-500">
        {p.author} • {new Date(p.publishedAt).toLocaleDateString("ro-RO")}
      </div>
    </div>
  );
}

export default function Home() {
  const latest = [...posts].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );

  // ===== helpers (evităm dubluri) =====

  // ===== SECȚIUNEA 1 =====
  const featured = latest[0];
  const rest = latest.slice(1);

  // ===== SECȚIUNEA 1 (cronologic, fără dubluri) =====
  const bestOf = rest.slice(0, 2); // penultimul + antepenultimul
  const headlines = rest.slice(2, 7); // următoarele 5

  // marcăm ce s-a consumat în secțiunea 1
  const used = new Set<string>([
    featured.id,
    ...bestOf.map((p) => p.id),
    ...headlines.map((p) => p.id),
  ]);

  // ===== SECȚIUNEA 2: doar Politică (cronologic) =====
  const POLITICA_SLUG: CategorySlug = "categorie-2";

  const politicsPool = rest.filter(
    (p) =>
      !used.has(p.id) &&
      (p.category?.slug === POLITICA_SLUG ||
        p.category?.name?.toLowerCase() === "politică" ||
        p.category?.name?.toLowerCase() === "politica")
  );

  // stânga (articolul principal din secțiunea 2)
  const politicsFeatured = politicsPool[0];

  // următoarele 4 (grid jos)
  const featuredGrid = politicsPool.slice(1, 5);

  // următoarele 4 (featuredExtra: 2 mici stânga + 2 jos)
  const featuredExtra = politicsPool.slice(5, 9);

  // marchezi ca folosite (ca să nu se repete în secțiuni viitoare)
  [politicsFeatured, ...featuredGrid, ...featuredExtra].forEach((p) => {
    if (p) used.add(p.id);
  });

  // ===== SECȚIUNEA 3: doar Actualitate =====
  const ACTUALITATE_SLUG: CategorySlug = "categorie-3";

  const cat3 = categories.find((c) => c.slug === ACTUALITATE_SLUG)!;

  const actualitatePool = rest.filter(
    (p) => !used.has(p.id) && p.category?.slug === ACTUALITATE_SLUG
  );

  // 2 mari + încă 5 în box
  const cat3Big = actualitatePool.slice(0, 2);
  const cat3More = actualitatePool.slice(2, 7);

  // marchează ca folosite
  [...cat3Big, ...cat3More].forEach((p) => used.add(p.id));

  const mostRead = [...posts].sort((a, b) => b.views - a.views);

  return (
    <main>
      {/* ===== SECȚIUNEA 1 ===== */}
      {/* ✅ FIX mobil: pe mobil NU forțăm 100vh; doar pe md+ */}
      <section className="mx-auto min-h-[calc(100vh-var(--header-h,64px))]  max-w-6xl px-4 py-6">
        <div className="grid gap-10 md:grid-cols-[42%_29%_20%] md:items-start">
          {/* STÂNGA – FEATURED */}
          <div>
            <h2 className="inline-flex mb-4 md:mb-0 items-center bg-red-600 px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-white">
              ȘTIREA ZILEI
            </h2>

            {/* ✅ FIX mobil: înălțime controlată doar pe md+ */}
            <div className="md:flex-1">
              <div className="md:h-[calc(80vh-var(--header-h,64px)-84px)]">
                <FeaturedHero post={featured} />
              </div>
            </div>
          </div>

          {/* MIJLOC – RECOMANDATE */}
          <div>
            <SectionTitle title="Recomandate" />

            <div className="mt-5 grid gap-10">
              {bestOf.slice(0, 2).map((p) => (
                <Link
                  key={p.id}
                  href={`/stire/${p.slug}`}
                  className="group block"
                >
                  {/* POZA (3/4) */}
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  </div>

                  {/* CATEGORIE (badge) */}
                  <div className="mt-4 inline-flex bg-red-600 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                    {p.category.name}
                  </div>

                  {/* TITLU */}
                  <div className="mt-3 text-[22px] font-extrabold leading-tight">
                    <span className="u-underline">{p.title}</span>
                  </div>

                  {/* AUTOR */}
                  <div className="mt-3 text-[12px] font-normal tracking-wide text-gray-500">
                    BY {p.author} ·{" "}
                    {new Date(p.publishedAt).toLocaleDateString("ro-RO")}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* DREAPTA – PE SCURT */}
          <div>
            <SectionTitle title="Pe scurt" href="#" />

            <div className="mt-5 space-y-7">
              {headlines.slice(0, 5).map((p) => (
                <Link
                  key={p.id}
                  href={`/stire/${p.slug}`}
                  className="group flex gap-5"
                >
                  <div className="min-w-0">
                    <div className="inline-flex bg-red-600 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                      {p.category.name}
                    </div>
                    <div className="mt-1 text-[18px] md:text-[19px] font-extrabold leading-snug">
                      <span className="u-underline">{p.title}</span>
                    </div>
                    <div className="mt-2 text-xs font-normal text-gray-400">
                      BY {p.author} ·{" "}
                      {new Date(p.publishedAt).toLocaleDateString("ro-RO")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECȚIUNEA 2 (dark, full-bleed) ===== */}
      {politicsFeatured && (
        <section className="bg-[#0B2A45] dark:bg-[#0b131a]">
          <div className="min-h-[calc(100vh-var(--header-h,64px))] py-12">
            <div className="mx-auto max-w-6xl px-4">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-[3px] w-8 bg-red-600" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-white">
                    Articole Politică
                  </h2>
                </div>
              </div>

              <div className="mt-7 grid gap-8 md:grid-cols-12 md:items-start">
                {/* stânga */}
                <div className="md:col-span-6">
                  <Tag>{politicsFeatured.category.name}</Tag>

                  <Link
                    href={`/stire/${politicsFeatured.slug}`}
                    className="mt-4 block text-4xl font-extrabold leading-tight text-white hover:underline"
                  >
                    {politicsFeatured.title}
                  </Link>
                  <p className="mt-4 text-base text-white/75">
                    {politicsFeatured.excerpt}
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {featuredExtra.slice(0, 2).map((p) => (
                      // ❌ scos rounded-xl
                      <div key={p.id} className="p-4">
                        <div className="mt-4 inline-flex bg-red-600 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                          {p.category.name}
                        </div>
                        <Link
                          href={`/stire/${p.slug}`}
                          className="mt-2 block text-base font-extrabold leading-snug text-white hover:underline"
                        >
                          {p.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* dreapta: imagine mare */}
                <div className="md:col-span-6">
                  <Link
                    href={`/stire/${politicsFeatured.slug}`}
                    className="block overflow-hidden"
                  >
                    <img
                      src={politicsFeatured.image}
                      alt={politicsFeatured.title}
                      className="h-[360px] w-full object-cover"
                    />
                  </Link>
                </div>

                {/* grid jos */}
                <div className="md:col-span-12">
                  <div className="mt-2 grid gap-6 md:grid-cols-4">
                    {featuredGrid.map((p) => (
                      <div key={p.id} className="text-white">
                        <Link
                          href={`/stire/${p.slug}`}
                          className="block overflow-hidden"
                        >
                          <img
                            src={p.image}
                            alt={p.title}
                            className="h-48 w-full object-cover"
                          />
                        </Link>

                        <div className="mt-3">
                          <Tag>{p.category.name}</Tag>
                          <Link
                            href={`/stire/${p.slug}`}
                            className="mt-2 block text-lg font-extrabold leading-snug hover:underline"
                          >
                            {p.title}
                          </Link>
                          <div className="mt-1 text-xs text-white/60">
                            {p.author}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {featuredExtra.slice(2, 4).map((p) => (
                      // ❌ scos rounded-2xl
                      <div key={p.id} className="bg-white/5 p-5">
                        <div className="inline-flex bg-red-600 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                          {p.category.name}
                        </div>
                        <Link
                          href={`/stire/${p.slug}`}
                          className="mt-2 block text-xl font-extrabold leading-snug text-white hover:underline"
                        >
                          {p.title}
                        </Link>
                        <p className="mt-2 text-sm text-white/70 line-clamp-2">
                          {p.excerpt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* ===== SECȚIUNEA 3 ===== */}
      <section className="mx-auto mt-10 max-w-6xl px-4 py-10 min-h-[calc(100vh-var(--header-h,64px))]">
        <SectionTitle title={cat3.name} href={`/categorie/${cat3.slug}`} />

        <div className="mt-7 grid gap-6 md:grid-cols-12 md:items-start">
          {/* 2 mari */}
          <div className="md:col-span-8 space-y-6">
            {cat3Big.map((p) => (
              <BigCard key={p.id} p={p} />
            ))}
          </div>

          {/* listă mică */}
          <div className="md:col-span-4 sticky top-24 self-start">
            <div className="bg-[#0B2A45] dark:bg-[#0b131a] p-5 text-white">
              <div className="text-sm font-extrabold uppercase tracking-wide">
                Mai mult din {cat3.name}
              </div>
              <div className="mt-5 space-y-4">
                {cat3More.map((p) => (
                  <MiniStory key={p.id} p={p} light />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ULTIMA SECȚIUNE: TOATE ARTICOLELE ===== */}
      <section className="mx-auto mt-12 max-w-6xl px-4 py-10">
        <SectionTitle title="Toate articolele" />

        <div className="mt-7 grid gap-8 md:grid-cols-12 md:items-start">
          {/* STÂNGA: listă cu load more */}
          <div className="md:col-span-8">
            <AllPostsSection posts={latest} rowsPerPage={3} cols={2} />
          </div>

          {/* DREAPTA: rămâne la fel */}
          <div className="md:col-span-4 self-start sticky top-24 space-y-4">
            <div className="">
              <MostRead posts={mostRead} />
              <CurrencyBox />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
