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

  return (
    <section className="group w-full">
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

          <div className="pt-4">
            <div className="inline-flex bg-red-600 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
              {post.category.name}
            </div>

            <h2 className="mt-2 text-2xl font-extrabold leading-tight">
              <span className="u-underline">{post.title}</span>
            </h2>

            <p className="mt-3 text-base text-gray-600">{post.excerpt}</p>

            <div className="mt-4 text-xs text-gray-400">
              BY {post.author ? `${post.author} • ` : ""}
              {fmtDate(post.publishedAt)}
            </div>
          </div>
        </div>

        {/* ===== DESKTOP ===== */}
        <div className="hidden md:block">
          <div className="pt-2">
            {/* titlu mare */}
            <h2 className="mt-5 text-[42px] font-extrabold leading-[1.02] tracking-tight">
              <span className="u-underline">{post.title}</span>
            </h2>

            {/* meta mic, fara bold */}
            <div className="mt-3 text-[12px] font-normal tracking-wide text-gray-500">
              {post.author ? `BY ${post.author} · ` : ""}
              {fmtDate(post.publishedAt)}
            </div>

            {/* imagine FULL WIDTH, inaltime controlata */}
            <div className="mt-6 relative w-full overflow-hidden md:h-[420px]">
              <Image
                src={imgs[idx]}
                alt={post.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* excerpt jos (optional) */}
            {/* {post.excerpt ? (
              <p className="mt-6 max-w-[70ch] text-[17px] leading-relaxed text-gray-700">
                {post.excerpt}
              </p>
            ) : null} */}
          </div>
        </div>
      </Link>
    </section>
  );
}
