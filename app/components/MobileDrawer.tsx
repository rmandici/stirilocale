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

function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#"
      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/15"
      aria-label="Social"
    >
      {children}
    </a>
  );
}

function IconFacebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.5-1.5H16.8V5a25 25 0 0 0-2.7-.1c-2.7 0-4.6 1.6-4.6 4.6V11H6.7v3h2.8v8h4z" />
    </svg>
  );
}

function IconInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 3H21l-6.6 7.6L22 21h-6.5l-5.1-6.1L5 21H3l7.1-8.2L2.7 3H9.3l4.6 5.4L18.9 3Zm-2.3 16h1.7L7.5 4.9H5.7L16.6 19Z" />
    </svg>
  );
}

function IconYouTube(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2 31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10 15.3V8.7L15.7 12 10 15.3Z" />
    </svg>
  );
}

function IconTikTok(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.5 3c.4 2.6 1.9 4.1 4.5 4.5V11c-1.7 0-3.2-.5-4.5-1.4V16c0 4-3.3 7-7.4 6.4-2.7-.4-4.9-2.6-5.3-5.3C3.2 12.9 6.2 9.6 10.2 9.6c.3 0 .6 0 .9.1v3.7c-.3-.1-.6-.2-.9-.2-1.9 0-3.3 1.7-2.9 3.6.2 1 .9 1.8 1.9 2 .2 0 .4.1.6.1 1.7 0 3-1.3 3-3V3h3.7Z" />
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
            <div className="mb-16">
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
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm font-extrabold uppercase tracking-wide">
                Urmărește-ne
              </div>
              <div className="flex gap-3">
                <SocialIcon>
                  <IconFacebook className="h-4 w-4" />
                </SocialIcon>
                <SocialIcon>
                  <IconInstagram className="h-5 w-5" />
                </SocialIcon>
                <SocialIcon>
                  <IconX className="h-4 w-4" />
                </SocialIcon>
                <SocialIcon>
                  <IconYouTube className="h-5 w-5" />
                </SocialIcon>
                <SocialIcon>
                  <IconTikTok className="h-4 w-4" />
                </SocialIcon>
              </div>
            </div>
            <div className="mt-3 h-px w-full bg-white/10" />

            <div className="mt-8 text-xs text-white/50 justify-center text-center">
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
