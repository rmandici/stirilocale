"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories } from "../data/categories";
import { CurrencyChip } from "./CurrencyChip";
import { SearchBarPanel } from "./SearchOverlay";
import { MenuPanel } from "./MenuPanel";

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

function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Header({
  showCompactLogo,
  navShifted,
}: {
  showCompactLogo: boolean;
  navShifted: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navCats = useMemo(() => categories.slice(0, 5), []);

  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const setH = () => {
      const h = headerRef.current?.offsetHeight ?? 64;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };
    setH();
    window.addEventListener("resize", setH);
    return () => window.removeEventListener("resize", setH);
  }, []);

  return (
    <>
      {/* HEADER */}
      <header ref={headerRef} className="sticky top-0 z-40 border-b bg-white">
        <div className="mx-auto flex max-w-[80rem] items-center gap-3 px-4 py-3">
          {/* MOBILE compact logo (stânga) */}
          <Link href="/" className="md:hidden block">
            <span
              className={[
                "h-serif text-lg font-extrabold tracking-tight text-gray-900",
                "transition-opacity duration-150",
                showCompactLogo
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none",
              ].join(" ")}
            >
              stirilocale
            </span>
          </Link>

          {/* DESKTOP: logo compact + nav */}
          <div className="hidden md:flex items-center gap-6 min-w-0">
            {/* Logo compact (animăm lățimea ca să împingă nav-ul) */}
            <div
              className={[
                "overflow-hidden",
                "transition-[width] duration-200 ease-out",
                showCompactLogo ? "w-40" : "w-0",
              ].join(" ")}
            >
              <Link href="/" className="block">
                <span
                  className={[
                    "h-serif text-xl font-extrabold tracking-tight text-gray-900",
                    "transition-opacity duration-150",
                    showCompactLogo ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                >
                  stirilocale
                </span>
              </Link>
            </div>

            {/* Nav */}
            <nav className="flex items-center gap-5 text-sm transition-all duration-200 ease-out">
              {navCats.map((c) => (
                <Link
                  key={c.slug}
                  href={`/#cat-${c.slug}`}
                  scroll={true}
                  className="text-gray-700 hover:text-black"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:block">
              <CurrencyChip />
            </div>
            <div className="md:hidden">
              <CurrencyChip compact />
            </div>

            {/* Desktop search (doar desktop) */}
            <button
              onClick={() => {
                setSearchOpen((v) => !v);
                setMenuOpen(false);
              }}
              className="hidden md:inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-gray-800"
              aria-label="Deschide căutarea"
            >
              <IconSearch className="h-4 w-4" />
              Căutare
            </button>

            {/* Hamburger / X – mobil */}
            <button
              onClick={() => {
                setMenuOpen((v) => !v);
                setSearchOpen(false);
              }}
              className="inline-flex items-center justify-center rounded-md border p-2 text-gray-800 md:hidden"
              aria-label={menuOpen ? "Închide meniul" : "Deschide meniul"}
            >
              {menuOpen ? (
                <IconX className="h-5 w-5" />
              ) : (
                <IconMenu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* DESKTOP SEARCH PANEL */}
      <SearchBarPanel open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* MENU PANEL (mobil + desktop dacă vrei) */}
      <MenuPanel open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
