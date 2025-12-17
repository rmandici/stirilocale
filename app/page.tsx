/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { posts } from "./data/posts";
import { categories } from "./data/categories";
import { StoryCard } from "./components/StoryCard";
import { FeaturedHero } from "./components/FeaturedHero";

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
  href,
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
        <h2
          className={cn(
            "text-sm font-extrabold uppercase tracking-wide",
            light ? "text-white" : "text-gray-900"
          )}
        >
          {title}
        </h2>
      </div>

      {href && (
        <Link
          href={href}
          className={cn(
            "text-sm hover:underline",
            light ? "text-white/75" : "text-gray-500 hover:text-black"
          )}
        >
          Vezi toate
        </Link>
      )}
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
          <div className="h-16 w-24 flex-shrink-0 overflow-hidden bg-gray-100">
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
    <div className="bg-white p-5">
      <div className="text-xs text-gray-500">{p.category.name}</div>
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
        className="mt-4 block overflow-hidden bg-gray-100"
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
  const featured = posts.find((p) => p.featured) ?? posts[0];

  const latest = [...posts].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );

  const rest = latest.filter((p) => p.id !== featured.id);

  // ===== helpers (evităm dubluri) =====
  const used = new Set<string>([featured.id]);
  const pickUnique = (pool: typeof rest, n: number) => {
    const out: typeof rest = [];
    for (const p of pool) {
      if (out.length >= n) break;
      if (used.has(p.id)) continue;
      used.add(p.id);
      out.push(p);
    }
    return out;
  };

  // unicitate DOAR în interiorul unei secțiuni
  const pickUniqueLocal = (pool: typeof rest, n: number) => {
    const local = new Set<string>();
    const out: typeof rest = [];
    for (const p of pool) {
      if (out.length >= n) break;
      if (local.has(p.id)) continue;
      local.add(p.id);
      out.push(p);
    }
    return out;
  };

  // dacă vrei să excluzi doar "featured"
  const pickExcluding = (
    pool: typeof rest,
    n: number,
    exclude: Set<string>
  ) => {
    const local = new Set<string>();
    const out: typeof rest = [];
    for (const p of pool) {
      if (out.length >= n) break;
      if (exclude.has(p.id)) continue;
      if (local.has(p.id)) continue;
      local.add(p.id);
      out.push(p);
    }
    return out;
  };

  // ===== SECȚIUNEA 1 =====
  const bestOf = pickUnique(rest, 3);
  const headlines = pickUnique(rest, 8);
  const headlinesExtra = pickUnique(rest, 3);

  // ===== SECȚIUNEA 2 (dark) =====
  const featuredGrid = pickUnique(rest, 4);
  const featuredExtra = pickUnique(rest, 4);

  // ===== SECȚIUNEA 3 (categorie-3) =====
  const cat3 = categories[2];
  const cat3Pool = rest.filter((p) => p.category.slug === cat3.slug);
  const cat3Big = pickUnique(cat3Pool, 2);
  const cat3More = pickUnique(cat3Pool, 6);

  // ===== ULTIMA SECȚIUNE (categorie-5) =====
  const lastCat = categories[4];
  const lastPool = rest.filter((p) => p.category.slug === lastCat.slug);

  const lastBig = pickUnique(lastPool, 3);
  const lastMore = pickUnique(lastPool, 10);

  const mostRead = [...posts].sort((a, b) => b.views - a.views);

  return (
    <main>
      {/* ===== SECȚIUNEA 1 ===== */}
      {/* ✅ FIX mobil: pe mobil NU forțăm 100vh; doar pe md+ */}
      <section className="mx-auto mt-6 max-w-6xl px-4 py-6 md:py-0 md:h-[calc(100vh-var(--header-h,64px))]">
        <div className="grid gap-7 md:h-full md:grid-cols-12 md:items-start">
          {/* STÂNGA – FEATURED HERO */}
          <div className="md:col-span-6 md:flex md:h-full md:flex-col">
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-block h-[2px] w-8 bg-red-600" />
                <h2 className="text-sm font-extrabold tracking-wide uppercase text-gray-900">
                  Povestea zilei
                </h2>
              </div>

              <Link
                href={`/categorie/${featured.category.slug}`}
                className="text-sm text-gray-600 hover:text-black"
              >
                Vezi toate
              </Link>
            </div>

            {/* ✅ FIX mobil: înălțime controlată doar pe md+ */}
            <div className="mt-5 md:flex-1">
              <div className="md:h-[calc(100vh-var(--header-h,64px)-84px)]">
                <FeaturedHero post={featured} />
              </div>
            </div>
          </div>

          {/* MIJLOC – RECOMANDATE */}
          <div className="md:col-span-3">
            <SectionTitle title="Recomandate" href="#" />

            <div className="mt-5 grid gap-10">
              {bestOf[0] && (
                <Link href={`/stire/${bestOf[0].slug}`} className="group block">
                  <img
                    src={bestOf[0].image}
                    alt={bestOf[0].title}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="mt-4 text-[12px] font-bold uppercase tracking-wide text-gray-500">
                    {bestOf[0].category.name}
                  </div>

                  <div className="mt-1 text-2xl font-extrabold leading-snug">
                    <span className="u-underline">{bestOf[0].title}</span>
                  </div>

                  <div className="mt-2 text-sm font-semibold text-gray-400">
                    BY {bestOf[0].author} ·{" "}
                    {new Date(bestOf[0].publishedAt).toLocaleDateString(
                      "ro-RO"
                    )}
                  </div>
                </Link>
              )}

              <div className="grid grid-cols-2 gap-6">
                {bestOf.slice(1, 3).map((p) => (
                  <Link
                    key={p.id}
                    href={`/stire/${p.slug}`}
                    className="group block"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="mt-3 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                      {p.category.name}
                    </div>
                    <div className="mt-1 text-[17px] font-extrabold leading-snug">
                      <span className="u-underline">{p.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* DREAPTA – PE SCURT */}
          <div className="md:col-span-3">
            <SectionTitle title="Pe scurt" href="#" />

            <div className="mt-5 space-y-7">
              {headlines.slice(0, 5).map((p) => (
                <Link
                  key={p.id}
                  href={`/stire/${p.slug}`}
                  className="group flex gap-5"
                >
                  <div className="min-w-0">
                    <div className="text-[12px] font-bold uppercase tracking-wide text-gray-500">
                      {p.category.name}
                    </div>
                    <div className="mt-1 text-[17px] font-extrabold leading-snug">
                      <span className="u-underline">{p.title}</span>
                    </div>
                    <div className="mt-2 text-sm font-semibold text-gray-400">
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
      <section className=" bg-slate-950">
        <div className="min-h-[calc(100vh-var(--header-h,64px))] py-12">
          <div className="mx-auto max-w-6xl px-4">
            <SectionTitle title="Articole recomandate" href="#" light />

            <div className="mt-7 grid gap-8 md:grid-cols-12 md:items-start">
              {/* stânga */}
              <div className="md:col-span-6">
                <Tag>{featured.category.name}</Tag>
                <Link
                  href={`/stire/${featured.slug}`}
                  className="mt-4 block text-4xl font-extrabold leading-tight text-white hover:underline"
                >
                  {featured.title}
                </Link>
                <p className="mt-4 text-base text-white/75">
                  {featured.excerpt}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {featuredExtra.slice(0, 2).map((p) => (
                    // ❌ scos rounded-xl
                    <div
                      key={p.id}
                      className="border border-white/10 bg-white/5 p-4"
                    >
                      <div className="text-[11px] font-bold uppercase tracking-wide text-white/60">
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
                  href={`/stire/${featured.slug}`}
                  className="block overflow-hidden"
                >
                  <img
                    src={featured.image}
                    alt={featured.title}
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
                    <div
                      key={p.id}
                      className="border border-white/10 bg-white/5 p-5"
                    >
                      <div className="text-[11px] font-bold uppercase tracking-wide text-white/60">
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

      {/* ===== SECȚIUNEA 3 ===== */}
      <section className="mx-auto mt-10 max-w-6xl px-4 py-10 min-h-[calc(100vh-var(--header-h,64px))]">
        <SectionTitle title={cat3.name} href={`/categorie/${cat3.slug}`} />

        <div className="mt-7 grid gap-6 md:grid-cols-12 md:items-start">
          {/* 2 mari */}
          <div className="md:col-span-7 space-y-6">
            {cat3Big.map((p) => (
              <BigCard key={p.id} p={p} />
            ))}
          </div>

          {/* listă mică */}
          <div className="md:col-span-5">
            {/* ❌ scos rounded-2xl */}
            <div className="border bg-[#0b1b2a] p-5 text-white">
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

      {/* ===== ULTIMA SECȚIUNE ===== */}
      <section className="mx-auto mt-12 max-w-6xl px-4 py-10 pb-12 min-h-[calc(100vh-var(--header-h,64px))]">
        <SectionTitle
          title={lastCat.name}
          href={`/categorie/${lastCat.slug}`}
        />

        <div className="mt-7 grid gap-8 md:grid-cols-12 md:items-start">
          {/* STÂNGA */}
          <div className="md:col-span-8">
            {lastBig[0] && <BigCard p={lastBig[0]} tall />}

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {lastBig.slice(1, 3).map((p) => (
                <BigCard key={p.id} p={p} />
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {lastMore.slice(0, 8).map((p) => (
                <StoryCard key={p.id} post={p} />
              ))}
            </div>
          </div>

          {/* DREAPTA */}
          <div className="md:col-span-4">
            <div
              className={cn(
                "space-y-4 sticky",
                "top-[calc(var(--header-h,64px)+24px)]"
              )}
            >
              <MostRead posts={mostRead} />
              <CurrencyBox />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
