"use client";

import Link from "next/link";

export function BannerOverlay({ hidden }: { hidden: boolean }) {
  return (
    <div
      className={[
        "fixed left-0 right-0 z-30", // <-- FIXED
        "bg-white border-b",
        "transition-all duration-200 ease-out",
        hidden
          ? "opacity-0 -translate-y-3 pointer-events-none"
          : "opacity-100 translate-y-0",
      ].join(" ")}
      style={{ top: "var(--header-h)" }}
    >
      <div className="mx-auto max-w-[80rem] px-4 py-6 md:py-8">
        <Link
          href="/"
          onClick={() => {
            setTimeout(
              () => window.scrollTo({ top: 0, behavior: "smooth" }),
              0
            );
          }}
          className="flex items-center justify-center"
        >
          <div className="h-serif text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            stirilocale
          </div>
        </Link>
      </div>
      <div className="h-4 md:h-6" />
    </div>
  );
}
