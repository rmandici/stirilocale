"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Post } from "../data/posts";

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

export function FeaturedHero({ post }: { post: Post }) {
  const imgs = useMemo(
    () => (post.images?.length ? post.images : [post.image]),
    [post.images, post.image]
  );
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (imgs.length <= 1) return;
    const t = setInterval(() => {
      setIdx((v) => (v + 1) % imgs.length);
    }, 4500);
    return () => clearInterval(t);
  }, [imgs.length]);

  return (
    <section className="group w-full overflow-hidden bg-white shadow-sm">
      <Link href={`/stire/${post.slug}`} className="block">
        {/* ===== MOBILE ===== */}
        <div className="md:hidden">
          <div className="relative aspect-[16/10]">
            <Image
              src={imgs[idx]}
              alt={post.title}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="100vw"
              priority
            />
          </div>

          <div className="p-5">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              {post.category.name}
            </div>

            <h2 className="mt-2 text-2xl font-extrabold leading-tight">
              <span className="u-underline">{post.title}</span>
            </h2>

            <p className="mt-3 text-base text-gray-600">{post.excerpt}</p>

            <div className="mt-4 text-xs text-gray-500">
              {post.author ? `${post.author} • ` : ""}
              {fmtDate(post.publishedAt)}
            </div>
          </div>
        </div>

        {/* ===== DESKTOP (TOP STORY “PE LUNG”) ===== */}
        <div className="hidden md:block">
          <div className=" pb-6">
            <h2 className="mt-4 text-4xl font-extrabold leading-[1.05]">
              <span className="u-underline">{post.title}</span>
            </h2>

            <p className="mt-4 max-w-[60ch] text-base text-gray-600">
              {post.excerpt}
            </p>

            <div className="mt-5 flex items-center gap-3 text-xs text-gray-500">
              {post.author ? (
                <span className="font-semibold">{post.author}</span>
              ) : null}
              <span>•</span>
              <span>{fmtDate(post.publishedAt)}</span>
            </div>
          </div>

          {/* imagine mare dedesubt */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
              <Image
                src={imgs[idx]}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 480px) 60vw, 760px"
                priority
              />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>

          <div className="px-8 py-6">
            <span className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white">
              Citește articolul →
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
