"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SearchItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
};

function useDebounced<T>(value: T, delayMs = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

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

export function SearchPanel({
  onClose,
  onPickResult,
  autoFocus = false,
  className = "",
}: {
  onClose?: () => void;
  onPickResult?: () => void; // chemat când user apasă pe un rezultat
  autoFocus?: boolean;
  className?: string;
}) {
  const [q, setQ] = useState("");
  const debouncedQ = useDebounced(q, 250);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = debouncedQ.trim();
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data: SearchItem[] = await res.json();
        if (!cancelled) setResults(Array.isArray(data) ? data : []);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQ]);

  return (
    <div className={className}>
      <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 shadow-sm dark:bg-white/5 dark:border-white/10">
        <IconSearch className="h-4 w-4 text-gray-500 dark:text-white/60" />
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Caută știri."
          className="w-full bg-transparent text-sm outline-none text-gray-900 dark:text-white"
        />
        <button
          onClick={() => {
            setQ("");
            setResults([]);
            onClose?.();
          }}
          className="rounded-md px-2 py-1 text-sm text-gray-500 hover:text-gray-800 dark:text-white/60 dark:hover:text-white"
          aria-label="Închide căutarea"
        >
          ✕
        </button>
      </div>

      <div className="mt-3 overflow-hidden rounded-md border bg-white shadow-lg dark:bg-[#0b131a] dark:border-white/10">
        {loading ? (
          <div className="px-4 py-3 text-sm text-gray-600 dark:text-white/70">
            Se caută…
          </div>
        ) : debouncedQ.trim() && results.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-600 dark:text-white/70">
            Niciun rezultat.
          </div>
        ) : results.length > 0 ? (
          <ul className="max-h-[60vh] overflow-auto">
            {results.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/stire/${r.slug}`}
                  onClick={() => {
                    setQ("");
                    setResults([]);
                    onPickResult?.();
                  }}
                  className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <div className="text-sm font-extrabold leading-snug text-gray-900 dark:text-white">
                    {r.title}
                  </div>
                  {r.excerpt ? (
                    <div className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-white/70">
                      {r.excerpt}
                    </div>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
