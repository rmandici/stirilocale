"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { categories } from "../data/categories";

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.2 16.2 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MobileDrawer({
  open,
  mode,
  onClose,
}: {
  open: boolean;
  mode: "menu" | "search";
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open && mode === "search") {
      const t = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(t);
    }
  }, [open, mode]);

  const catPairs = useMemo(() => {
    // PLACEHOLDER (mai târziu WP)
    const list = categories.slice(0, 10);
    const left: typeof list = [];
    const right: typeof list = [];
    list.forEach((c, i) => (i % 2 === 0 ? left : right).push(c));
    return { left, right };
  }, []);

  if (!open) return null;

  return (
    // IMPORTANT: containerul începe SUB header => header rămâne clickable
    <div className="fixed left-0 right-0 bottom-0 top-[var(--header-h)] z-[60] md:hidden">
      {/* overlay (doar sub header) */}
      <button
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Închide meniul"
      />

      {/* panou full-screen (sub header) */}
      <div className="absolute inset-0">
        <div className="h-full w-full bg-[#0b0b0b] text-white">
          {/* conținut scroll */}
          <div className="h-full overflow-y-auto px-4 py-4">
            {/* Search box */}
            <div className="mb-6">
              <div className="flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2">
                <IconSearch className="h-4 w-4 opacity-80" />
                <input
                  ref={inputRef}
                  placeholder="Caută știri..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/50"
                />
                <span className="opacity-60">→</span>
              </div>
            </div>

            {/* ACASĂ (UN SINGUR BUTON / LINK) */}
            <div className="mb-6">
              <Link
                href="/"
                onClick={onClose}
                className="block text-sm font-extrabold uppercase tracking-wide text-white/95"
              >
                Acasă
              </Link>
              <div className="mt-3 h-px w-full bg-white/10" />
            </div>

            {/* CATEGORII */}
            <div className="mb-6">
              <div className="text-sm font-extrabold uppercase tracking-wide">
                Categorii
              </div>
              <div className="mt-3 h-px w-full bg-white/10" />

              <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-3">
                <div className="flex flex-col gap-3">
                  {catPairs.left.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/categorie/${c.slug}`}
                      onClick={onClose}
                      className="text-sm font-semibold text-white/90 hover:text-white"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {catPairs.right.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/categorie/${c.slug}`}
                      onClick={onClose}
                      className="text-sm font-semibold text-white/90 hover:text-white"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* SOCIAL (mai evident) */}
            <div className="mb-6">
              <div className="text-sm font-extrabold uppercase tracking-wide">
                Urmărește-ne
              </div>
              <div className="mt-3 h-px w-full bg-white/10" />

              <div className="mt-4 flex items-center gap-3">
                <SocialPill href="#" label="Facebook">
                  f
                </SocialPill>
                <SocialPill href="#" label="X">
                  X
                </SocialPill>
                <SocialPill href="#" label="YouTube">
                  ▶
                </SocialPill>
                <SocialPill href="#" label="TikTok">
                  ♪
                </SocialPill>
              </div>
            </div>

            <div className="mt-8 text-xs text-white/50">
              © stirilocale — demo.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialPill({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-11 min-w-11 items-center justify-center rounded-lg bg-white/10 px-4 text-sm font-extrabold hover:bg-white/15"
    >
      {children}
    </Link>
  );
}
