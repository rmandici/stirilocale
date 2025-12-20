"use client";

import { useMemo, useState } from "react";
import type { Post } from "../data/posts";
import { StoryCard } from "./StoryCard";

export function AllPostsSection({
  posts,
  rowsPerPage = 3,
  cols = 2,
}: {
  posts: Post[];
  rowsPerPage?: number; // câte rânduri adaugi la fiecare click
  cols?: number; // 2 coloane => 2 articole / rând
}) {
  const perPage = rowsPerPage * cols; // ex 3*2 = 6
  const [visible, setVisible] = useState(perPage);

  const visiblePosts = useMemo(() => posts.slice(0, visible), [posts, visible]);
  const hasMore = visible < posts.length;

  return (
    <div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {visiblePosts.map((p) => (
          <StoryCard key={p.id} post={p} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisible((v) => Math.min(v + perPage, posts.length))
            }
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white"
          >
            <span className=" group-hover:border-red-600 group-hover:text-red-600">
              Vezi mai mult
            </span>
            <span
              className="
      transition-transform duration-200
      group-hover:translate-x-1
      group-hover:text-red-600
    "
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
