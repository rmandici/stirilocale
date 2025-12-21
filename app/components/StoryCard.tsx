"use client";

import Image from "next/image";
import Link from "next/link";
import type { Post } from "../lib/wp";
import { ShareBar } from "./ShareBar";

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ro-RO");
  } catch {
    return "";
  }
}

// ✅ culori doar pentru cele 5 categorii
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

export function StoryCard({ post }: { post: Post }) {
  const badgeClass = categoryColorClass(post.category?.slug);

  return (
    <article className="group  overflow-hidden bg-white dark:bg-[#0b131a] transition hover:shadow-md">
      {/* Link doar pe poză + titlu (share-ul e buton separat) */}
      <Link href={`/stire/${post.slug}`} className="block">
        {/* imagine + badge în poză */}
        <div className="relative aspect-[16/9]">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 dark:bg-white/10" />
          )}

          {/* ✅ badge categorie în poză (doar cele 5) */}
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

          {/* icon video (păstrat) */}
          {(post.hasVideo || post.video) && (
            <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center bg-black/60 text-white">
              ▶
            </span>
          )}

          {/* gradient mic jos ca să “lege” vizual */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* text mai compact */}
        <div className="p-4">
          <h3 className="line-clamp-2 text-base font-extrabold leading-snug">
            <span className="u-underline">{post.title}</span>
          </h3>

          {post.excerpt ? (
            <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-white/70">
              {post.excerpt}
            </p>
          ) : null}

          {/* meta row + share jos dreapta */}
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-white/50">
            <div className="min-w-0 truncate">
              {post.author ? `${post.author} • ` : ""}
              {fmtDate(post.publishedAt)}
            </div>

            <ShareBar
              path={`/stire/${post.slug}`}
              title={post.title}
              className="shrink-0"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}
