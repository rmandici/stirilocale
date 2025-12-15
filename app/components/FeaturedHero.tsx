"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Post } from "../data/posts";

export function FeaturedHero({ post }: { post: Post }) {
  const imgs = post.images?.length ? post.images : [post.image];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (imgs.length <= 1) return;
    const t = setInterval(() => {
      setIdx((v) => (v + 1) % imgs.length);
    }, 4500);
    return () => clearInterval(t);
  }, [imgs.length]);

  return (
    <section className="group mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
      <Link href={`/stire/${post.slug}`} className="block">
        {/* MOBILE */}
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
            <div className="text-xs text-gray-500">{post.category.name}</div>
            <h2 className="mt-2 text-2xl font-extrabold leading-tight">
              <span className="u-underline">{post.title}</span>
            </h2>
            <p className="mt-3 text-base text-gray-600">{post.excerpt}</p>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:grid md:grid-cols-12">
          <div className="relative md:col-span-7 min-h-[380px] overflow-hidden">
            {/* WRAPPER animat */}
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
              <Image
                src={imgs[idx]}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 60vw, 700px"
                priority
              />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          <div className="md:col-span-5 p-8">
            <div className="text-xs text-gray-500">{post.category.name}</div>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight">
              <span className="u-underline">{post.title}</span>
            </h2>
            <p className="mt-4 text-base text-gray-600">{post.excerpt}</p>

            <div className="mt-6 inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white">
              Citește articolul →
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
