import Link from "next/link";
import type { Post } from "../data/posts";

export function VideoSidebar({ posts }: { posts: Post[] }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
        Video
      </h3>

      <div className="mt-3 space-y-4">
        {posts.slice(0, 4).map((p) => (
          <Link key={p.id} href={`/stire/${p.slug}`} className="group block">
            <div className="flex gap-3">
              {/* VIDEO */}
              <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-md bg-black">
                <video
                  src={p.video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                  autoPlay
                />

                {/* Play icon */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 text-white"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* TEXT */}
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wide text-gray-500">
                  {p.category.name}
                </div>
                <div className="text-sm font-semibold leading-snug line-clamp-2 group-hover:underline">
                  {p.title}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
