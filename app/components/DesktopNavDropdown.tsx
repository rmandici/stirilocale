"use client";

import Link from "next/link";
import Image from "next/image";

type Post = {
  slug: string;
  title: string;
  categorySlug: string;
  image?: string;
  author?: string;
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
  const p0 = items[0];
  const p1 = items[1];
  const p2 = items[2];
  const p3 = items[3];
  const rest = items.slice(4);

  return (
    <div
      className="absolute left-0 top-full z-[60] w-full"
      onMouseLeave={onClose}
    >
      {/* Banner mai mare + animație smooth */}
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
            {/* Header dropdown */}
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

            {/* Layout-uri diferite */}
            {variant === "hero-2small" && (
              <div className="grid grid-cols-12 gap-6">
                {/* HERO mare */}
                <div className="col-span-7">
                  <HeroCard post={p0} />
                </div>

                {/* 2 mici + listă */}
                <div className="col-span-5 grid grid-rows-2 gap-6">
                  <SmallCard post={p1} />
                  <SmallCard post={p2} />
                </div>

                {/* listă sub (opțional) */}
                <div className="col-span-12">
                  <div className="grid grid-cols-3 gap-6">
                    <MiniCard post={p3} />
                    <MiniCard post={rest[0]} />
                    <MiniCard post={rest[1]} />
                  </div>
                </div>
              </div>
            )}

            {variant === "two-hero" && (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6">
                  <HeroCard post={p0} />
                </div>
                <div className="col-span-6">
                  <HeroCard post={p1} />
                </div>

                <div className="col-span-12 grid grid-cols-3 gap-6">
                  <MiniCard post={p2} />
                  <MiniCard post={p3} />
                  <MiniCard post={rest[0]} />
                </div>
              </div>
            )}

            {variant === "hero-list" && (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  <HeroCard post={p0} />
                </div>

                <div className="col-span-4">
                  <div className="space-y-4">
                    <ListItem post={p1} />
                    <ListItem post={p2} />
                    <ListItem post={p3} />
                    <ListItem post={rest[0]} />
                  </div>
                </div>
              </div>
            )}

            {variant === "three-hero" && (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4">
                  <HeroCard post={p0} />
                </div>
                <div className="col-span-4">
                  <HeroCard post={p1} />
                </div>
                <div className="col-span-4">
                  <HeroCard post={p2} />
                </div>

                <div className="col-span-12 grid grid-cols-3 gap-6">
                  <MiniCard post={p3} />
                  <MiniCard post={rest[0]} />
                  <MiniCard post={rest[1]} />
                </div>
              </div>
            )}

            {/* fallback dacă nu ai posturi */}
            {!items.length && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-sm text-white/70">
                Nu există articole încă (placeholder). Le vom încărca din
                WordPress.
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

function HeroCard({ post }: { post?: Post }) {
  return (
    <Link href={hrefFor(post)} className="group block">
      <div className="relative h-[300px] w-full overflow-hidden bg-white/10">
        {post?.image ? (
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

        {/* gradient Foxiz-ish */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="line-clamp-3 text-3xl font-extrabold leading-tight">
            {post?.title ?? "Titlu articol (placeholder)"}
          </div>

          <div className="mt-3 text-[11px] font-semibold uppercase text-white/75">
            {post?.author ? `De ${post.author}` : "De redacție"}
            <span className="mx-2">•</span>
            {post?.dateLabel ?? "recent"}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ post }: { post?: Post }) {
  return (
    <Link href={hrefFor(post)} className="group block">
      <div className="relative h-[138px] overflow-hidden bg-white/10">
        {post?.image ? (
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
            {post?.title ?? "Titlu articol (placeholder)"}
          </div>
          <div className="mt-2 text-[10px] font-semibold uppercase text-white/75">
            {post?.dateLabel ?? "recent"}
          </div>
        </div>
      </div>
    </Link>
  );
}

function MiniCard({ post }: { post?: Post }) {
  return (
    <Link href={hrefFor(post)} className="group block">
      <div className="relative h-[140px] overflow-hidden bg-white/10">
        {post?.image ? (
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
          {post?.title ?? "Titlu articol (placeholder)"}
        </div>
        <div className="mt-2 text-[10px] font-semibold uppercase text-white/70">
          {post?.dateLabel ?? "recent"}
        </div>
      </div>
    </Link>
  );
}

function ListItem({ post }: { post?: Post }) {
  return (
    <Link href={hrefFor(post)} className="group flex gap-3">
      <div className="relative h-[56px] w-[92px] flex-none overflow-hidden bg-white/10">
        {post?.image ? (
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
          {post?.title ?? "Titlu articol (placeholder)"}
        </div>
        <div className="mt-1 text-[10px] font-semibold uppercase text-white/70">
          {post?.dateLabel ?? "recent"}
        </div>
      </div>
    </Link>
  );
}
