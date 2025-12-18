import Link from "next/link";
import type { Post } from "../data/posts";

export function MostRead({ posts }: { posts: Post[] }) {
  return (
    <div className=" p-4">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-900 dark:text-gray-200">
        Cele mai citite
      </h3>

      <ol className="mt-4 space-y-3">
        {posts.slice(0, 6).map((p, idx) => (
          <li key={p.id} className="flex gap-3">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-700">
              {idx + 1}
            </div>

            <Link
              href={`/stire/${p.slug}`}
              className="min-w-0 text-sm font-semibold leading-snug text-gray-900 dark:text-gray-200 hover:underline"
            >
              <span className="line-clamp-2">{p.title}</span>
              <span className="mt-1 block text-[11px] text-gray-500">
                {p.category.name}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
