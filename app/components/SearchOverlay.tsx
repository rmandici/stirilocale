"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

function IconX() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.5 22v-7h2.4l.4-3H13.5V9.9c0-.9.3-1.6 1.6-1.6H16V5.6c-.5-.1-1.6-.2-3-.2-2.9 0-4.9 1.8-4.9 5V12H6v3h2.1v7h5.4Z"
      />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9A3.5 3.5 0 0 0 20 16.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6Zm6.2-.9a1.1 1.1 0 1 1-2.2 0a1.1 1.1 0 0 1 2.2 0Z"
      />
    </svg>
  );
}

function IconXBrand() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.9 2H22l-6.8 7.8L22.8 22h-6l-4.7-6.2L6.8 22H3.7l7.3-8.3L3 2h6.1l4.2 5.6L18.9 2Zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20Z"
      />
    </svg>
  );
}

function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.6 7.2c.3 1.6.3 5 .3 5s0 3.4-.3 5c-.2 1-1 1.8-2 2-1.6.3-7.6.3-7.6.3s-6 0-7.6-.3c-1-.2-1.8-1-2-2c-.3-1.6-.3-5-.3-5s0-3.4.3-5c.2-1 1-1.8 2-2C6 5 12 5 12 5s6 0 7.6.3c1 .2 1.8 1 2 2ZM10 15.5 15.2 12 10 8.5v7Z"
      />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.6 3c.4 2.4 1.8 3.9 4.1 4.2v3.1c-1.9.1-3.5-.5-5-1.6v7c0 4-3.3 6.8-7.1 6.2c-2.6-.4-4.8-2.6-5.2-5.2C2.8 12.9 5.6 9.6 9.6 9.6c.4 0 .8 0 1.2.1v3.4c-.4-.1-.8-.2-1.2-.2c-2 0-3.4 1.8-3 3.7c.3 1.2 1.2 2.1 2.5 2.4c2 .5 3.8-1 3.8-3V3h3.7Z"
      />
    </svg>
  );
}

export function SearchBarPanel({ open, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      // focus după un pic, ca să nu “fure” animația
      setTimeout(() => inputRef.current?.focus(), 120);
    } else {
      // unmount după animație
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={[
        "hidden md:block",
        "fixed left-0 right-0 z-50",
        "border-b bg-[#0B2A45] text-white",
        "transition-all duration-200 ease-out",
        open
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none",
      ].join(" ")}
      style={{ top: "var(--header-h)" }}
    >
      {/* container îngust și centrat */}
      <div className="mx-auto max-w-[80rem] px-4">
        {/* panel animat (scaleY + opacity) */}
        <div
          className={[
            "origin-top overflow-hidden",
            "transition-all duration-200 ease-out",
            open ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0",
          ].join(" ")}
        >
          <div className="py-5">
            {/* search row (mai îngust) */}
            <div className="mx-auto flex max-w-3xl items-center gap-3">
              <input
                ref={inputRef}
                placeholder="Caută pe stirilocale"
                className="w-full rounded-md bg-white px-4 py-3 text-base text-gray-900 outline-none"
              />
              <button className="rounded-md bg-red-600 px-5 py-3 text-sm font-semibold hover:bg-red-500">
                Caută
              </button>
              <button
                onClick={onClose}
                className="rounded-md p-3 hover:bg-white/10"
                aria-label="Închide căutarea"
              >
                <IconX />
              </button>
            </div>

            {/* footer mini – centrat */}
            <div className="mt-5 border-t border-white/10 pt-5">
              <div className="mx-auto max-w-3xl text-center">
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/80">
                  <a href="#">Termeni și condiții</a>
                  <a href="#">Politica de confidențialitate</a>
                  <a href="#">Contact</a>
                  <a href="#">Despre noi</a>
                </div>

                <div className="mt-4 flex items-center justify-center gap-3">
                  {[
                    { name: "Facebook", icon: <IconFacebook /> },
                    { name: "Instagram", icon: <IconInstagram /> },
                    { name: "X", icon: <IconXBrand /> },
                    { name: "YouTube", icon: <IconYouTube /> },
                    { name: "TikTok", icon: <IconTikTok /> },
                  ].map((s) => (
                    <a
                      key={s.name}
                      href="#"
                      aria-label={s.name}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15"
                      title={s.name}
                    >
                      {s.icon}
                    </a>
                  ))}
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
    </div>
  );
}
