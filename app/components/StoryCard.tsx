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
        </div>

        <div className="p-4">
          <div className="text-xs text-gray-500">{post.category.name}</div>

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
