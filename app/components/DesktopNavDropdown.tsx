"use client";

import Link from "next/link";
import Image from "next/image";

type Post = {
  slug: string;
  title: string;
  categorySlug: string;
  image?: string;
  dateLabel?: string;
};

type Variant = "hero-2small" | "two-hero" | "hero-list" | "three-hero";

export function DesktopNavDropdown({
  open,
  categoryName,
  categorySlug,
  posts,
  onClose,
  variant = "hero-2small",
}: {
  open: boolean;
  categoryName: string;
  categorySlug: string;
  posts: Post[];
  onClose: () => void;
  variant?: Variant;
}) {
  if (!open) return null;

  const items = (posts ?? []).slice(0, 6);

  // ✅ fallback doar când chiar nu ai nimic
  const hasAny = items.length > 0;

  // Helpers ca să nu mai indexăm “orb”
  const hero = items[0];
  const smalls = items.slice(1, 3); // până la 2
  const minis = items.slice(3, 6); // până la 3
  const list = items.slice(1, 6); // până la 5

  return (
    <div
      className="absolute left-0 top-full z-[60] w-full"
      onMouseLeave={onClose}
    >
      <div
        className={[
          "bg-[#0b0b0b] text-white",
          "border-t border-white/10",
          "shadow-[0_30px_80px_rgba(0,0,0,0.45)]",
          "origin-top",
          "animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200",
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="py-7">
            <div className="flex items-center justify-between pb-5">
              <span className="inline-flex items-center bg-red-600 px-4 py-2 text-xs font-extrabold uppercase tracking-wide">
                {categoryName}
              </span>

              <Link
                href={`/categorie/${categorySlug}`}
                className="text-sm font-extrabold opacity-90 hover:opacity-100"
              >
                Vezi mai mult
              </Link>
            </div>

            {/* ✅ Layout-uri, dar fără “carduri goale” */}
            {variant === "hero-2small" && hasAny && (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-7">
                  <HeroCard post={hero} />
                </div>

                {/* 0-2 smalls */}
                <div className="col-span-5 grid gap-6">
                  {smalls.map((p) => (
                    <SmallCard key={p.slug} post={p} />
                  ))}
                </div>

                {/* minis doar dacă există */}
                {minis.length > 0 && (
                  <div className="col-span-12">
                    <div className="grid grid-cols-3 gap-6">
                      {minis.map((p) => (
                        <MiniCard key={p.slug} post={p} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {variant === "two-hero" && hasAny && (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6">
                  <HeroCard post={items[0]} />
                </div>
                {items[1] && (
                  <div className="col-span-6">
                    <HeroCard post={items[1]} />
                  </div>
                )}

                {items.length > 2 && (
                  <div className="col-span-12 grid grid-cols-3 gap-6">
                    {items.slice(2, 5).map((p) => (
                      <MiniCard key={p.slug} post={p} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {variant === "hero-list" && hasAny && (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  <HeroCard post={items[0]} />
                </div>

                <div className="col-span-4">
                  <div className="space-y-4">
                    {list.map((p) => (
                      <ListItem key={p.slug} post={p} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {variant === "three-hero" && hasAny && (
              <div className="grid grid-cols-12 gap-6">
                {items.slice(0, 3).map((p) => (
                  <div key={p.slug} className="col-span-4">
                    <HeroCard post={p} />
                  </div>
                ))}

                {items.length > 3 && (
                  <div className="col-span-12 grid grid-cols-3 gap-6">
                    {items.slice(3, 6).map((p) => (
                      <MiniCard key={p.slug} post={p} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {!hasAny && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-sm text-white/70 flex flex-col items-center justify-center gap-3 min-h-[140px]">
                <span
                  className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/70"
                  aria-label="Se încarcă"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function hrefFor(post?: Post) {
  if (!post?.slug) return "#";
  return `/stire/${post.slug}`;
}

/** ✅ Cardurile: nu mai pun placeholder text dacă post e undefined (dar oricum nu mai chemăm cu undefined) */
function HeroCard({ post }: { post: Post }) {
  return (
    <Link href={hrefFor(post)} className="group block">
      <div className="relative h-[300px] w-full overflow-hidden bg-white/10">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs text-white/60">
            Imagine (placeholder)
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="line-clamp-3 text-3xl font-extrabold leading-tight">
            {post.title}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ post }: { post: Post }) {
  return (
    <Link href={hrefFor(post)} className="group block">
      <div className="relative h-[138px] overflow-hidden bg-white/10">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs text-white/60">
            Imagine (placeholder)
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="line-clamp-2 text-[15px] font-extrabold leading-snug">
            {post.title}
          </div>
          <div className="mt-2 text-[10px] font-semibold uppercase text-white/75">
            {post.dateLabel ?? "recent"}
          </div>
        </div>
      </div>
    </Link>
  );
}

function MiniCard({ post }: { post: Post }) {
  return (
    <Link href={hrefFor(post)} className="group block">
      <div className="relative h-[140px] overflow-hidden bg-white/10">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs text-white/60">
            Imagine (placeholder)
          </div>
        )}
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="mt-3">
        <div className="line-clamp-2 text-[13px] font-extrabold leading-snug">
          {post.title}
        </div>
        <div className="mt-2 text-[10px] font-semibold uppercase text-white/70">
          {post.dateLabel ?? "recent"}
        </div>
      </div>
    </Link>
  );
}

function ListItem({ post }: { post: Post }) {
  return (
    <Link href={hrefFor(post)} className="group flex gap-3">
      <div className="relative h-[56px] w-[92px] flex-none overflow-hidden bg-white/10">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className="min-w-0">
        <div className="line-clamp-2 text-[13px] font-extrabold leading-snug">
          {post.title}
        </div>
        <div className="mt-1 text-[10px] font-semibold uppercase text-white/70">
          {post.dateLabel ?? "recent"}
        </div>
      </div>
    </Link>
  );
}
