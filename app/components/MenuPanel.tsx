"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categories } from "../data/categories";

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

export function MenuPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setMounted(true);
    else {
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

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
              <div className="flex gap-2">
                <input
                  placeholder="Caută pe stirilocale"
                  className="w-full rounded-md bg-white px-4 py-3 text-sm text-gray-900 outline-none"
                />
                <button className="rounded-md bg-red-600 px-4 py-3 text-sm font-semibold hover:bg-red-500">
                  Caută
                </button>
              </div>
            </div>

            {/* CATEGORIES */}
            <div className="mt-6 mx-auto max-w-md space-y-1">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/#cat-${c.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-md px-3 py-3 text-lg font-semibold hover:bg-white/5"
                >
                  {c.name}
                </Link>
              ))}
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
                © {new Date().getFullYear()} stirilocale.ro · Toate drepturile
                rezervate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
