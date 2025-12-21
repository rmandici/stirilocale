"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type MenuCategory = { slug: string; name: string };
type SearchItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
};

function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15"
    >
      {children}
    </a>
  );
}

// debounce mic
function useDebounced<T>(value: T, delayMs = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export function MenuPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(open);

  const [cats, setCats] = useState<MenuCategory[]>([]);
  const [catsLoading, setCatsLoading] = useState(false);

  const [q, setQ] = useState("");
  const debouncedQ = useDebounced(q, 250);

  const [results, setResults] = useState<SearchItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // focus când se deschide
      const t = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(t);
    } else {
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  // load categories când se deschide
  useEffect(() => {
    if (!open) return;

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
  }, [open]);

  // search în WP (via api)
  useEffect(() => {
    if (!open) return;

    const query = debouncedQ.trim();
    if (!query) {
      setResults([]);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;
    setSearchLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data: SearchItem[] = await res.json();
        if (!cancelled) setResults(data);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQ, open]);

  const showDropdown = useMemo(() => {
    return (
      open &&
      (searchLoading || results.length > 0 || debouncedQ.trim().length > 0)
    );
  }, [open, searchLoading, results.length, debouncedQ]);

  if (!mounted) return null;

  return (
    <div className="fixed left-0 right-0 top-[var(--header-h)] z-50 bg-[#0B2A45] text-white md:hidden">
      <div className="mx-auto max-w-[80rem] px-4">
        <div
          className={[
            "origin-top overflow-hidden",
            "transition-all duration-200 ease-out",
            open ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0",
          ].join(" ")}
        >
          <div className="py-5">
            {/* SEARCH (mobil) */}
            <div className="mx-auto max-w-md">
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Caută pe Callatis Press"
                    className="w-full rounded-md bg-white px-4 py-3 text-sm text-gray-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // forțăm search acum; debouncedQ va urma imediat
                      setQ((v) => v.trim());
                    }}
                    className="rounded-md bg-red-600 px-4 py-3 text-sm font-semibold hover:bg-red-500"
                  >
                    Caută
                  </button>
                </div>

                {/* dropdown rezultate */}
                {showDropdown ? (
                  <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-md border border-white/10 bg-[#071e32] shadow-lg">
                    {searchLoading ? (
                      <div className="px-4 py-3 text-sm text-white/70">
                        Se caută…
                      </div>
                    ) : results.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-white/70">
                        Niciun rezultat.
                      </div>
                    ) : (
                      <ul className="max-h-[60vh] overflow-auto">
                        {results.map((r) => (
                          <li key={r.id}>
                            <Link
                              href={`/stire/${r.slug}`}
                              onClick={() => {
                                setQ("");
                                setResults([]);
                                onClose();
                              }}
                              className="block px-4 py-3 hover:bg-white/5"
                            >
                              <div className="text-sm font-extrabold leading-snug">
                                {r.title}
                              </div>
                              {r.excerpt ? (
                                <div className="mt-1 line-clamp-2 text-xs text-white/70">
                                  {r.excerpt}
                                </div>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {/* CATEGORIES */}
            <div className="mt-6 mx-auto max-w-md space-y-1">
              {catsLoading && cats.length === 0 ? (
                <div className="rounded-md px-3 py-3 text-sm text-white/70">
                  Se încarcă categoriile…
                </div>
              ) : (
                cats.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categorie/${c.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-md px-3 py-3 text-lg font-semibold hover:bg-white/5"
                  >
                    {c.name}
                  </Link>
                ))
              )}
            </div>

            {/* FOOTER */}
            <div className="mt-8 border-t border-white/10 pt-6 text-center">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/80">
                <a href="#">Termeni și condiții</a>
                <a href="#">Politica de confidențialitate</a>
                <a href="#">Contact</a>
                <a href="#">Despre noi</a>
              </div>

              <div className="mt-4 flex justify-center gap-3">
                <SocialIcon>f</SocialIcon>
                <SocialIcon>ig</SocialIcon>
                <SocialIcon>x</SocialIcon>
                <SocialIcon>yt</SocialIcon>
                <SocialIcon>tt</SocialIcon>
              </div>

              <div className="mt-4 text-[11px] text-white/60">
                © {new Date().getFullYear()} CallatisPress.ro · Toate drepturile
                rezervate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
