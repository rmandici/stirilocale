"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories } from "../data/categories";
import { CurrencyChip } from "./CurrencyChip";
import { MobileDrawer } from "./MobileDrawer";
import { HamburgerButton } from "./HamburgerButton";

// IMPORTANT: trebuie să ai aceste 2 fișiere din pașii anteriori
import { DesktopNavDropdown } from "./DesktopNavDropdown";
import { getLatestPostsByCategory } from "./getPosts";

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

type DropdownVariant = "hero-2small" | "two-hero" | "hero-list" | "three-hero";

function dropdownVariantFor(slug: string): DropdownVariant {
  if (slug === "categorie-3") return "two-hero";
  if (slug === "categorie-5") return "three-hero";

  if (slug === "categorie-1") return "hero-list";
  if (slug === "video") return "two-hero";

  return "hero-2small";
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"menu" | "search">("menu");

  // desktop search bar (ss2) – apare/dispare sub header
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);

  // dropdown hover desktop
  const [hoverCat, setHoverCat] = useState<{
    slug: string;
    name: string;
  } | null>(null);
  const closeTimer = useRef<number | null>(null);

  const topCatsDesktop = useMemo(() => categories.slice(0, 6), []);
  const navCatsDesktop = useMemo(() => categories.slice(0, 6), []);
  const navCatsMobile = useMemo(() => categories.slice(0, 10), []);

  const headerRef = useRef<HTMLElement | null>(null);

  // set header height in CSS var for mobile drawer offset
  useEffect(() => {
    const setH = () => {
      const h = headerRef.current?.offsetHeight ?? 64;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };
    setH();
    window.addEventListener("resize", setH);
    return () => window.removeEventListener("resize", setH);
  }, []);

  // clear timer on unmount + ESC closes dropdown
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
      <header ref={headerRef} className="sticky top-0 z-40">
        {/* DESKTOP: TOP BAR (negru) – doar redirect */}
        <div className="hidden md:block bg-black text-white">
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
                <Link
                  href="#"
                  aria-label="Facebook"
                  className="opacity-90 hover:opacity-100"
                >
                  f
                </Link>
                <Link
                  href="#"
                  aria-label="X"
                  className="opacity-90 hover:opacity-100"
                >
                  X
                </Link>
                <Link
                  href="#"
                  aria-label="YouTube"
                  className="opacity-90 hover:opacity-100"
                >
                  ▶
                </Link>
                <Link
                  href="#"
                  aria-label="TikTok"
                  className="opacity-90 hover:opacity-100"
                >
                  ♪
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE: Foxiz style (roșu) */}
        <div className="md:hidden bg-red-700 text-white">
          <div className="mx-auto max-w-[80rem] px-4">
            <div className="flex h-14 items-center justify-between">
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

              <Link href="/" className="text-2xl font-extrabold tracking-tight">
                stirilocale
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={openDrawerSearch}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10"
                  aria-label="Căutare"
                >
                  <IconSearch className="h-5 w-5" />
                </button>

                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10"
                  aria-label="Setări"
                >
                  ⚙
                </button>
              </div>
            </div>
          </div>

          {/* MOBILE: bandă categorii scroll (doar redirect) */}
          {!menuOpen && (
            <div className="border-t border-white/10">
              <div
                className={[
                  "mx-auto max-w-[80rem] px-2",
                  "overflow-x-auto whitespace-nowrap",
                  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                ].join(" ")}
              >
                <div className="flex items-center gap-5 px-2 py-2">
                  {navCatsMobile.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/categorie/${c.slug}`}
                      className="text-[13px] font-semibold opacity-95 hover:opacity-100"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP: MAIN BAR (roșu) */}
        <div className="hidden md:block bg-red-700 text-white">
          {/* relative ca dropdown-ul să se ancoreze corect */}
          <div className="relative mx-auto max-w-full px-4">
            <div className="flex h-16 items-center">
              {/* stânga */}
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-2xl font-extrabold tracking-tight"
                >
                  stirilocale
                </Link>
              </div>

              {/* centru: wrapper comun pentru hover (meniu + dropdown) */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                onMouseEnter={cancelCloseHover}
                onMouseLeave={scheduleCloseHover}
              >
                {/* nav rămâne centrat */}
                <nav className="flex items-center gap-8 text-[13px] font-extrabold uppercase whitespace-nowrap">
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

                {/* dropdown sub bară, full width (părintele e inset-0 => full) */}
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

              {/* dreapta */}
              <div className="ml-auto flex items-center gap-3">
                <CurrencyChip />

                <button
                  onClick={() => setDesktopSearchOpen((v) => !v)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10"
                  aria-label="Căutare"
                >
                  <IconSearch className="h-5 w-5" />
                </button>

                <button
                  className="inline-flex h-10 items-center justify-center rounded-full bg-white/10 px-3 text-[12px] font-bold hover:bg-white/15"
                  aria-label="Opțiuni"
                >
                  ⚙
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP: search bar “finuț” */}
        {desktopSearchOpen && (
          <div className="hidden md:block bg-white">
            <div className="mx-auto max-w-[80rem] px-4">
              <div className="py-3">
                <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 shadow-sm">
                  <IconSearch className="h-4 w-4 text-gray-500" />
                  <input
                    placeholder="Caută știri..."
                    className="w-full bg-transparent text-sm outline-none"
                  />
                  <button
                    onClick={() => setDesktopSearchOpen(false)}
                    className="rounded-md px-2 py-1 text-sm text-gray-500 hover:text-gray-800"
                    aria-label="Închide căutarea"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MOBILE DRAWER */}
      <MobileDrawer
        open={menuOpen}
        mode={drawerMode}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
