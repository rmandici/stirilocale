/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Post } from "./lib/wp";
import { getWpPosts } from "./lib/wp";
import { FeaturedHero } from "./components/FeaturedHero";
import { AllPostsSection } from "./components/AllPostsSection";
import { posts as demoPosts } from "./data/posts";
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
  p: Post;
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

function BigCard({ p, tall }: { p: Post; tall?: boolean }) {
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

export default async function Home() {
  const wpPosts = await getWpPosts({ perPage: 50 });
  const posts: Post[] =
    wpPosts.length >= 8 ? wpPosts : (demoPosts as unknown as Post[]);

  const latest = [...posts].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );
  if (latest.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="text-sm text-gray-600">Nu există articole încă.</div>
      </main>
    );
  }

  // ===== SECȚIUNEA 1 =====
  const featured = latest[0] ?? null;
  const rest = latest.slice(1);

  // Secțiunea 1 (cronologic)
  const bestOf = rest.slice(0, 2);
  const headlines = rest.slice(2, 7);

  // ✅ Set pentru secțiunile de jos: evităm dubluri ÎNTRE secțiunile de jos,
  // dar permitem dubluri cu Secțiunea 1.
  const usedBelow = new Set<string>();

  function pickFirst<T extends Post>(
    arr: T[],
    count: number,
    used: Set<string>
  ) {
    const out: T[] = [];
    for (const p of arr) {
      if (!p) continue;
      if (used.has(p.id)) continue;
      used.add(p.id);
      out.push(p);
      if (out.length >= count) break;
    }
    return out;
  }

  // ===== SECȚIUNEA 2: Politică (poate repeta din top) =====
  const politicsPool = rest.filter((p) =>
    ["politică", "politica"].includes((p.category?.name ?? "").toLowerCase())
  );

  // Alegem din politicsPool, dar deduplicăm doar față de celelalte secțiuni de jos
  const politicsPicked = pickFirst(politicsPool, 1 + 4 + 4, usedBelow);
  const politicsFeatured = politicsPicked[0];
  const featuredGrid = politicsPicked.slice(1, 5);
  const featuredExtra = politicsPicked.slice(5, 9);

  // ===== SECȚIUNEA 3: Actualitate (poate repeta din top, dar nu repetă Politică) =====
  const ACTUALITATE_NAME = "Actualitate";

  const actualitatePool = rest.filter(
    (p) =>
      (p.category?.name ?? "").toLowerCase() === ACTUALITATE_NAME.toLowerCase()
  );

  // Tot “jos” => deduplicăm față de cele deja luate la Politică prin usedBelow
  const actualitatePicked = pickFirst(actualitatePool, 2 + 5, usedBelow);
  const cat3Big = actualitatePicked.slice(0, 2);
  const cat3More = actualitatePicked.slice(2, 7);

  const cat3Name = ACTUALITATE_NAME;

  const mostRead = latest.slice(0, 10);

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
              <div className="md:min-h-[520px]">
                {featured ? <FeaturedHero post={featured} /> : null}
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
        <SectionTitle title={cat3Name} href={`/categorie/actualitate`} />

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
                Mai mult din {cat3Name}
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
