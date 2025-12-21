"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type BreakingItem = {
  id: string;
  slug: string;
  title: string;
  category?: { name: string; slug: string };
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function categoryColorClass(slug?: string): string | null {
  const s = (slug ?? "").toLowerCase();

  switch (s) {
    case "actualitate":
      return "bg-teal-600 text-white";
    case "local":
      return "bg-emerald-700 text-white";
    case "politica":
      return "bg-orange-700 text-white";
    case "sport":
      return "bg-green-600 text-white";
    case "ultima-ora":
    case "ultima-oră":
      return "bg-yellow-400 text-black";
    default:
      return null; // doar cele 5 au badge
  }
}

export function CurrencyBox() {
  const [items, setItems] = useState<BreakingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // rotire
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        // 🔁 păstrează endpoint-ul tău aici
        const res = await fetch("/api/latest?limit=4", { cache: "no-store" });
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();

        const normalized: BreakingItem[] = Array.isArray(data)
          ? data
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((x: any) => ({
                id: String(x.id ?? x.slug ?? Math.random()),
                slug: String(x.slug ?? ""),
                title: String(x.title ?? ""),
                category: x.category
                  ? {
                      name: String(x.category.name ?? ""),
                      slug: String(x.category.slug ?? ""),
                    }
                  : undefined,
              }))
              .filter((x) => x.slug && x.title)
              .slice(0, 4)
          : [];

        if (!cancelled) setItems(normalized);
      } catch {
        // fallback demo
        if (!cancelled) {
          setItems([
            {
              id: "1",
              slug: "dosar-de-malpraxis-la-spitalul-de-boli-infectioase-mutat-intre-sectiile-tribunalului",
              title:
                "Dosar de malpraxis la Spitalul de Boli Infecțioase, mutat între secțiile tribunalului",
              category: { name: "Politică", slug: "politica" },
            },
            {
              id: "2",
              slug: "alerta-meteo-cod-galben-in-zona",
              title: "Alertă meteo: cod galben în zona litoralului",
              category: { name: "Actualitate", slug: "actualitate" },
            },
            {
              id: "3",
              slug: "restrictii-de-trafic-in-weekend",
              title: "Restricții de trafic în weekend, anunțate de autorități",
              category: { name: "Local", slug: "local" },
            },
            {
              id: "4",
              slug: "sport-rezultate",
              title: "Victorie importantă în derby, scor 2-1",
              category: { name: "Sport", slug: "sport" },
            },
          ]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ROTIRE automată + tranziție (fără texte extra)
  useEffect(() => {
    // curățare timere vechi
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    if (items.length < 2) return;

    // pornește de la 0 de fiecare dată când se schimbă lista
    setIdx(0);
    setPhase("in");

    intervalRef.current = window.setInterval(() => {
      setPhase("out");

      // după fade-out schimbăm indexul și revenim in
      timeoutRef.current = window.setTimeout(() => {
        setIdx((prev) => (prev + 1) % items.length);
        setPhase("in");
      }, 220);
    }, 3000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      intervalRef.current = null;
      timeoutRef.current = null;
    };
  }, [items]);

  const current = useMemo(() => items[idx] ?? null, [items, idx]);
  const badgeClass =
    categoryColorClass(current?.category?.slug) ?? "bg-red-600 text-white";

  return (
    <div
      className={cn(
        "rounded-lg px-3 py-2",
        "border border-gray-500/25 bg-white",
        "dark:bg-white/5 dark:border-gray-400/25"
      )}
    >
      <div className="flex items-center gap-3">
        {/* stânga: imaginea ta (mai mare) */}
        <div className="shrink-0">
          <Image
            src="/breaking_news.png"
            alt="Breaking News"
            width={64}
            height={64}
            className="rounded-md"
            priority
          />
        </div>

        {/* dreapta: badge + titlu (un singur item, cu tranziție) */}
        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="text-sm text-gray-600 dark:text-white/70">
              Se încarcă…
            </div>
          ) : current ? (
            <Link
              href={`/stire/${current.slug}`}
              className="block min-w-0"
              aria-label={current.title}
              title={current.title}
            >
              {/* badge categorie */}
              {current.category?.name ? (
                <div
                  className={cn(
                    "mb-1 inline-flex items-center rounded-md px-2 py-0.5",
                    "text-[10px] font-extrabold uppercase tracking-wide",
                    badgeClass
                  )}
                >
                  {current.category.name}
                </div>
              ) : null}

              {/* titlu cu tranziție */}
              <div
                className={cn(
                  "text-sm font-extrabold leading-snug text-gray-900 dark:text-white",
                  "transition-all duration-200",
                  phase === "out"
                    ? "opacity-0 -translate-y-1"
                    : "opacity-100 translate-y-0",
                  "line-clamp-2"
                )}
              >
                {current.title}
              </div>
            </Link>
          ) : (
            <div className="text-sm text-gray-600 dark:text-white/70">
              Nicio știre.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
