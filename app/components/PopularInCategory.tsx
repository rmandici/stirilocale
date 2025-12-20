/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Post } from "../lib/wp";

export function PopularInCategory({
  posts,
  limit = 4,
}: {
  posts: Post[];
  limit?: number;
}) {
  const items = posts.slice(0, limit);

  return (
    <aside className="w-full">
      <div className="flex items-end justify-between">
        <div>
          <div className="h-[3px] w-14 bg-black dark:bg-white" />
          <div className="mt-2 text-sm font-extrabold uppercase tracking-wide">
            ARTICOLE POPULARE
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        {items.map((p) => (
          <article key={p.id}>
            <Link
              href={`/stire/${p.slug}`}
              className="block overflow-hidden border-4 border-black dark:border-white"
            >
              <div className="relative">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full object-cover"
                    style={{ aspectRatio: "3 / 4" }}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div
                    className="w-full bg-gray-200 dark:bg-white/10"
                    style={{ aspectRatio: "3 / 4" }}
                  />
                )}

                {(p.hasVideo || p.video) && (
                  <span className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white">
                    ▶
                  </span>
                )}
              </div>
            </Link>

            <Link
              href={`/stire/${p.slug}`}
              className="mt-3 block text-center text-[15px] font-extrabold leading-snug hover:underline"
            >
              {p.title}
            </Link>
          </article>
        ))}
      </div>
    </aside>
  );
}
