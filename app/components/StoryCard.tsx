import Image from "next/image";
import Link from "next/link";
import type { Post } from "../data/posts";

export function StoryCard({ post }: { post: Post }) {
  return (
    <article className="group overflow-hidden transition hover:shadow-md">
      <Link href={`/stire/${post.slug}`} className="block">
        <div className="relative aspect-[16/9]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          {(post.hasVideo || post.video) && (
            <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white">
              ▶
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="inline-flex bg-red-600 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
            {post.category.name}
          </div>

          <h3 className="mt-1 line-clamp-2 text-base font-semibold">
            <span className="u-underline">{post.title}</span>
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
