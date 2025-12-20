"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post } from "../data/posts";

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ro-RO");
  } catch {
    return "";
  }
}

export function CategoryRemaining({
  posts,
  step = 3,
}: {
  posts: Post[];
  step?: number;
}) {
  const [visible, setVisible] = useState(step);

  const shown = useMemo(() => posts.slice(0, visible), [posts, visible]);
  const canShowMore = visible < posts.length;

  return (
    <div>
      <div className="space-y-10">
        {shown.map((p) => (
          <article key={p.id} className="grid gap-5 md:grid-cols-12">
            {/* imagine */}
            <Link
              href={`/stire/${p.slug}`}
              className="md:col-span-5 block overflow-hidden"
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full object-cover"
                  style={{ aspectRatio: "16 / 10" }}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div
                  className="w-full bg-gray-200/60 dark:bg-white/10"
                  style={{ aspectRatio: "16 / 10" }}
                  aria-hidden="true"
                />
              )}
            </Link>

            {/* text */}
            <div className="md:col-span-7">
              <Link
                href={`/stire/${p.slug}`}
                className="block text-xl font-extrabold leading-snug hover:underline md:text-2xl"
              >
                {p.title}
              </Link>

              {p.excerpt ? (
                <p className="mt-3 line-clamp-3 text-sm text-gray-600 dark:text-white/70">
                  {p.excerpt}
                </p>
              ) : null}

              <div className="mt-4 text-xs text-gray-500 dark:text-white/50">
                {p.author ? `By ${p.author} · ` : ""}
                {fmtDate(p.publishedAt)}
              </div>
            </div>
          </article>
        ))}
      </div>

      {canShowMore && (
        <div className="mt-10 justify-center flex">
          <button
            type="button"
            onClick={() => setVisible((v) => Math.min(v + step, posts.length))}
            className="
              group inline-flex items-center gap-2
              text-sm font-semibold
              text-gray-900 dark:text-white
              opacity-90 hover:opacity-100
              hover:text-red-600
              transition
            "
            aria-label="Vezi mai mult"
          >
            Vezi mai mult
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
