"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type MenuCategory = { slug: string; name: string };

type SearchItem = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
};

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
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // MENU: categorii
  const [cats, setCats] = useState<MenuCategory[]>([]);
  const [catsLoading, setCatsLoading] = useState(false);

  // SEARCH
  const [q, setQ] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);

  const showSearchResults = q.trim().length > 0;

  // focus când se deschide drawer-ul
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // încarcă categoriile doar când vezi meniul (adică nu cauți)
  useEffect(() => {
    if (!open) return;
    if (showSearchResults) return;

    let cancelled = false;
    setCatsLoading(true);

    (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (!res.ok) return;
        const data: MenuCategory[] = await res.json();
        if (!cancelled) setCats(data);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setCatsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, showSearchResults]);

  // debounce + fetch search results (doar când user scrie)
  useEffect(() => {
    if (!open) return;

    const query = q.trim();
    if (!query) {
      setResults([]);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;
    setSearchLoading(true);

    const t = window.setTimeout(() => {
      (async () => {
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(query)}`,
            { cache: "no-store" }
          );
          if (!res.ok) return;
          const data = await res.json();
          if (!cancelled) setResults(Array.isArray(data) ? data : []);
        } catch {
          // ignore
        } finally {
          if (!cancelled) setSearchLoading(false);
        }
      })();
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [q, open]);

  const catPairs = useMemo(() => {
    const list = cats.slice(0, 10);
    const left: typeof list = [];
    const right: typeof list = [];
    list.forEach((c, i) => (i % 2 === 0 ? left : right).push(c));
    return { left, right };
  }, [cats]);

  if (!open) return null;

  const closeAll = () => {
    setQ("");
    setResults([]);
    setSearchLoading(false);
    onClose();
  };

  return (
    // IMPORTANT: containerul începe SUB header => header rămâne clickable
    <div className="fixed left-0 right-0 bottom-0 top-[var(--header-h)] z-[60] md:hidden">
      {/* overlay (doar sub header) */}
      <button
        className="absolute inset-0 bg-black/60"
        onClick={closeAll}
        aria-label="Închide meniul"
      />

      {/* panou full-screen (sub header) */}
      <div className="absolute inset-0">
        <div className="h-full w-full bg-[#0b0b0b] text-white">
          {/* conținut scroll */}
          <div className="h-full overflow-y-auto px-4 py-4">
            {/* Search box (mereu) */}
            <div className="mb-6">
              <div className="flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2">
                <IconSearch className="h-4 w-4 opacity-80" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Caută știri..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/50"
                />
                <button
                  type="button"
                  onClick={closeAll}
                  className="ml-1 rounded px-2 py-1 text-sm opacity-70 hover:opacity-100"
                  aria-label="Închide"
                  title="Închide"
                >
                  ✕
                </button>
              </div>
            </div>

            {showSearchResults ? (
              // =========================
              // REZULTATE CĂUTARE
              // =========================
              <div className="mb-10">
                {searchLoading ? (
                  <div className="text-sm text-white/60">Se caută…</div>
                ) : q.trim() && results.length === 0 ? (
                  <div className="text-sm text-white/60">Niciun rezultat.</div>
                ) : results.length > 0 ? (
                  <div className="mt-2 overflow-hidden rounded-md border border-white/10">
                    <ul className="max-h-[60vh] overflow-y-auto divide-y divide-white/10">
                      {results.map((r) => (
                        <li key={r.id}>
                          <Link
                            href={`/stire/${r.slug}`}
                            onClick={() => {
                              setQ("");
                              setResults([]);
                              setSearchLoading(false);
                              onClose();
                            }}
                            className="block px-4 py-3 hover:bg-white/5"
                          >
                            <div className="text-sm font-extrabold leading-snug">
                              {r.title}
                            </div>
                            {r.excerpt ? (
                              <div className="mt-1 line-clamp-2 text-xs text-white/60">
                                {r.excerpt}
                              </div>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-sm text-white/60">
                    Scrie ca să cauți articole.
                  </div>
                )}
              </div>
            ) : (
              // =========================
              // MENIU (când nu cauți)
              // =========================
              <>
                {/* ACASĂ */}
                <div className="mb-6">
                  <Link
                    href="/"
                    onClick={closeAll}
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

                  {catsLoading && cats.length === 0 ? (
                    <div className="mt-4 text-sm text-white/60">
                      Se încarcă…
                    </div>
                  ) : (
                    <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-3">
                      <div className="flex flex-col gap-3">
                        {catPairs.left.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/categorie/${c.slug}`}
                            onClick={closeAll}
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
                            onClick={closeAll}
                            className="text-sm font-semibold text-white/90 hover:text-white"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SOCIAL */}
                <div className="mb-6 flex justify-between items-center">
                  <div className="text-sm font-extrabold uppercase tracking-wide">
                    Urmărește-ne
                  </div>
                  <div className="flex gap-3">
                    <SocialIcon>
                      <a
                        href="https://www.facebook.com/people/Callatis-Press/61563413554461/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook Callatis Press"
                      >
                        <IconFacebook className="h-4 w-4" />
                      </a>
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
                  © CallatisPress — demo.
                </div>
              </>
            )}
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
