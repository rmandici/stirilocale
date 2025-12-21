"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories as demoCategories } from "../data/categories";

import { MobileDrawer } from "./MobileDrawer";
import { HamburgerButton } from "./HamburgerButton";
import { DesktopNavDropdown } from "./DesktopNavDropdown";
import { getLatestPostsByCategory } from "./getPosts";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { SearchPanel } from "./SearchPanel";

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

function dropdownVariantFor(slug: string) {
  const s = (slug || "").toLowerCase();

  if (s === "politica") return "two-hero";
  if (s === "actualitate") return "hero-list";
  if (s === "sport") return "three-hero";
  if (s === "local") return "hero-2small";
  if (s === "ultima-ora") return "hero-list";

  return "hero-2small";
}

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

type NavCategory = { slug: string; name: string };

export function Header() {
  const [navCategories, setNavCategories] = useState<NavCategory[]>(
    demoCategories.map((c) => ({ slug: c.slug, name: c.name }))
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (!res.ok) return;

        const data = (await res.json()) as NavCategory[];
        if (!cancelled && Array.isArray(data) && data.length) {
          // extra-sigur: scoate uncategorized și aici
          const cleaned = data.filter(
            (c) => c?.slug && c.slug.toLowerCase() !== "uncategorized"
          );
          if (cleaned.length) setNavCategories(cleaned);
        }
      } catch {
        // rămâne fallback-ul demo
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"menu" | "search">("menu");
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);

  const [desktopQ, setDesktopQ] = useState("");
  const debouncedDesktopQ = useDebounced(desktopQ, 250);
  const [desktopResults, setDesktopResults] = useState<SearchItem[]>([]);
  const [desktopSearching, setDesktopSearching] = useState(false);

  // dropdown hover desktop
  const [hoverCat, setHoverCat] = useState<{
    slug: string;
    name: string;
  } | null>(null);
  const closeTimer = useRef<number | null>(null);

  const topCatsDesktop = useMemo(
    () => navCategories.slice(0, 5),
    [navCategories]
  );
  const navCatsDesktop = useMemo(
    () => navCategories.slice(0, 5),
    [navCategories]
  );
  const navCatsMobile = useMemo(
    () => navCategories.slice(0, 10),
    [navCategories]
  );

  const headerRef = useRef<HTMLElement | null>(null);

  // set header height in CSS var (pentru layoutul tău cu 100vh - header)
  useEffect(() => {
    const setH = () => {
      const h = headerRef.current?.offsetHeight ?? 64;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };
    setH();
    window.addEventListener("resize", setH);
    return () => window.removeEventListener("resize", setH);
  }, [desktopSearchOpen]);

  useEffect(() => {
    const on = () => setHoverCat((h) => (h ? { ...h } : h));
    window.addEventListener("navposts:update", on);
    return () => window.removeEventListener("navposts:update", on);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
        setHoverCat(null);
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!desktopSearchOpen) return;

    const q = debouncedDesktopQ.trim();
    if (!q) {
      setDesktopResults([]);
      setDesktopSearching(false);
      return;
    }

    let cancelled = false;
    setDesktopSearching(true);

    (async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data: SearchItem[] = await res.json();
        if (!cancelled) setDesktopResults(data);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setDesktopSearching(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedDesktopQ, desktopSearchOpen]);

  const openDrawerSearch = () => {
    setDrawerMode("search");
    setMenuOpen(true);
  };

  const openHover = (slug: string, name: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setHoverCat({ slug, name });
  };

  const scheduleCloseHover = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setHoverCat(null), 160);
  };

  const cancelCloseHover = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  return (
    <>
      <header ref={headerRef} className="z-40">
        {/* DESKTOP: TOP BAR (albastru) */}
        <div className="hidden md:block bg-[#0B2A45] dark:bg-[#0b131a] text-white">
          <div className="mx-auto max-w-full px-4">
            <div className="flex h-10 items-center justify-between">
              <nav className="flex items-center gap-5 text-[12px] font-semibold">
                {topCatsDesktop.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categorie/${c.slug}`}
                    className="opacity-90 hover:opacity-100"
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3 text-[20px] font-extrabold">
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
          </div>
        </div>

        {/* MOBILE: albastru */}
        <div className="md:hidden bg-[#0B2A45] dark:bg-[#0b131a] text-white">
          <div className="mx-auto max-w-[80rem] px-4">
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center gap-2">
                <HamburgerButton
                  open={menuOpen}
                  ariaLabel={menuOpen ? "Închide meniul" : "Deschide meniul"}
                  onClick={() => {
                    if (menuOpen) {
                      setMenuOpen(false);
                      return;
                    }
                    setDrawerMode("menu");
                    setMenuOpen(true);
                  }}
                />
              </div>

              <div>
                <Link href="/" className="flex items-center">
                  <Image
                    src="/callatis_logo_new.png"
                    alt="Callatis"
                    width={110}
                    height={36}
                    priority
                    className="h-14 w-auto"
                  />
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={openDrawerSearch}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10"
                  aria-label="Căutare"
                >
                  <IconSearch className="h-5 w-5" />
                </button>

                <ThemeToggle />
              </div>
            </div>
          </div>

          {!menuOpen && (
            <div className="border-t border-white/10 ">
              <div
                className={[
                  "mx-auto max-w-[80rem] px-4",
                  "overflow-x-auto whitespace-nowrap",
                  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                ].join(" ")}
              >
                <div className="inline-flex justify-center min-w-full items-center gap-8 py-2">
                  {navCatsMobile.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/categorie/${c.slug}`}
                      className="text-[15px] font-semibold opacity-95 hover:opacity-100"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP: roșu */}
        <div className="hidden md:block bg-red-700 text-white">
          <div className="relative mx-auto max-w-full px-4">
            <div className="grid h-16 items-center gap-4 md:grid-cols-[1fr_2fr_1fr]">
              {/* STÂNGA */}
              <div className="flex items-center justify-start">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/callatis_logo_new.png"
                    alt="Callatis"
                    width={110}
                    height={36}
                    priority
                    className="h-16 w-auto"
                  />
                </Link>
              </div>

              {/* CENTRU */}
              <div
                className="min-w-0 flex items-center justify-center"
                onMouseEnter={cancelCloseHover}
                onMouseLeave={scheduleCloseHover}
              >
                <nav className="flex items-center gap-8 text-[13px] font-extrabold uppercase whitespace-nowrap overflow-hidden">
                  <Link href="/" className="opacity-95 hover:opacity-100">
                    Acasă
                  </Link>

                  {navCatsDesktop.map((c) => (
                    <div
                      key={c.slug}
                      className="group inline-flex items-center gap-1 opacity-95 hover:opacity-100"
                      onMouseEnter={() => openHover(c.slug, c.name)}
                    >
                      <Link href={`/categorie/${c.slug}`}>{c.name}</Link>
                      <span
                        className={[
                          "inline-flex items-center justify-center ml-1 text-[16px] font-black",
                          "transition-transform duration-200",
                          hoverCat?.slug === c.slug ? "rotate-180" : "rotate-0",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        ▾
                      </span>
                    </div>
                  ))}
                </nav>

                {hoverCat && (
                  <div onMouseEnter={cancelCloseHover}>
                    <DesktopNavDropdown
                      key={hoverCat.slug}
                      open={true}
                      categoryName={hoverCat.name}
                      categorySlug={hoverCat.slug}
                      variant={dropdownVariantFor(hoverCat.slug)}
                      posts={getLatestPostsByCategory(hoverCat.slug).map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (p: any) => ({
                          slug: p.slug ?? p.id ?? "placeholder",
                          title: p.title ?? "Titlu articol (placeholder)",
                          categorySlug: hoverCat.slug,
                          image: p.image ?? p.cover ?? p.thumbnail,
                          author: p.author ?? "Redacție",
                          dateLabel: p.dateLabel ?? p.timeAgo ?? "recent",
                        })
                      )}
                      onClose={scheduleCloseHover}
                    />
                  </div>
                )}
              </div>

              {/* DREAPTA */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDesktopSearchOpen((v) => !v)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10"
                  aria-label="Căutare"
                >
                  <IconSearch className="h-5 w-5" />
                </button>

                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {desktopSearchOpen && (
          <div className="hidden md:block bg-white dark:bg-[#0b131a]">
            <div className="mx-auto max-w-[80rem] px-4 py-3">
              <SearchPanel
                autoFocus
                onClose={() => setDesktopSearchOpen(false)}
                onPickResult={() => setDesktopSearchOpen(false)}
              />
            </div>
          </div>
        )}
      </header>

      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
