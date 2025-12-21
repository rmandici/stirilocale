"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Post } from "../data/posts";
import { ShareBar } from "./ShareBar";

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function categoryColorClass(slug?: string): string | null {
  const s = (slug ?? "").toLowerCase();

  switch (s) {
    case "actualitate":
      return "bg-teal-600 text-white";
    case "local":
      return "bg-emerald-700 text-white";
    case "politica":
      return "bg-orange-700 text-white";
    case "sport":
      return "bg-green-600 text-white";
    case "ultima-ora":
    case "ultima-oră":
      return "bg-yellow-400 text-black";
    default:
      return null; // doar cele 5 au badge
  }
}

export function FeaturedHero({ post }: { post: Post }) {
  const imgs = useMemo(() => {
    const arr = post.images?.length
      ? post.images
      : post.image
      ? [post.image]
      : [];
    return arr.filter(Boolean);
  }, [post.images, post.image]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (imgs.length <= 1) return;

    const t = setInterval(() => {
      setIdx((v) => (v + 1) % imgs.length);
    }, 4500);

    return () => clearInterval(t);
  }, [imgs.length]);

  const badgeClass = categoryColorClass(post.category?.slug);

  return (
    <section className="group w-full">
      <Link href={`/stire/${post.slug}`} className="block">
        {/* ===== MOBILE ===== */}
        <div className="md:hidden">
          <div className="relative aspect-[16/10] overflow-hidden">
            {imgs[idx] ? (
              <Image
                src={imgs[idx]}
                alt={post.title}
                fill
                className="object-cover transition-opacity duration-500"
                sizes="100vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-black/5 dark:bg-white/10" />
            )}

            {/* ✅ badge în poză */}
            {badgeClass ? (
              <span
                className={[
                  "absolute left-3 top-3 inline-flex items-center",
                  "px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide",
                  "rounded-md shadow-sm",
                  badgeClass,
                ].join(" ")}
              >
                {post.category.name}
              </span>
            ) : null}

            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/35 to-transparent" />
          </div>

          <div className="pt-4">
            <h2 className="text-2xl font-extrabold leading-tight">
              <span className="u-underline">{post.title}</span>
            </h2>

            <p className="mt-3 text-base text-gray-600 dark:text-white/70">
              {post.excerpt}
            </p>

            {/* meta + share */}
            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-gray-400 dark:text-white/50">
              <ShareBar
                path={`/stire/${post.slug}`}
                title={post.title}
                className="shrink-0"
              />
            </div>
          </div>
        </div>

        {/* ===== DESKTOP ===== */}
        <div className="hidden md:block">
          <div className="pt-2">
            <h2 className="mt-5 text-[42px] font-extrabold leading-[1.02] tracking-tight">
              <span className="u-underline">{post.title}</span>
            </h2>

            <div className="mt-3 flex items-center justify-between gap-3 text-[12px] font-normal tracking-wide text-gray-500 dark:text-white/50">
              <ShareBar
                path={`/stire/${post.slug}`}
                title={post.title}
                className="shrink-0"
              />
            </div>

            <div className="mt-6 relative w-full overflow-hidden md:h-[420px]">
              {imgs[idx] ? (
                <Image
                  src={imgs[idx]}
                  alt={post.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-black/5 dark:bg-white/10" />
              )}

              {/* ✅ badge în poză (și pe desktop) */}
              {badgeClass ? (
                <span
                  className={[
                    "absolute left-4 top-4 inline-flex items-center",
                    "px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide",
                    "rounded-md shadow-sm",
                    badgeClass,
                  ].join(" ")}
                >
                  {post.category.name}
                </span>
              ) : null}

              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
