"use client";

import { useCallback, useMemo, useState } from "react";

function safeEncode(v: string) {
  return encodeURIComponent(v);
}

function getOrigin() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

function facebookShareUrl(url: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${safeEncode(url)}`;
}

// X (Twitter)
function xShareUrl(url: string, text?: string) {
  const params = new URLSearchParams();
  params.set("url", url);
  if (text) params.set("text", text);
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

function whatsappShareUrl(url: string, text?: string) {
  const msg = text ? `${text}\n${url}` : url;
  return `https://wa.me/?text=${safeEncode(msg)}`;
}

async function copyToClipboard(text: string) {
  // modern
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // fallback
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

function openPopup(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function ShareBar({
  path,
  title,
  className = "",
}: {
  path: string; // ex: /stire/slug
  title?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const absoluteUrl = useMemo(() => {
    const origin = getOrigin();
    return origin ? origin + path : path;
  }, [path]);

  const onFacebook = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      openPopup(facebookShareUrl(absoluteUrl));
    },
    [absoluteUrl]
  );

  const onX = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      openPopup(xShareUrl(absoluteUrl, title));
    },
    [absoluteUrl, title]
  );

  const onWhatsApp = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      openPopup(whatsappShareUrl(absoluteUrl, title));
    },
    [absoluteUrl, title]
  );

  const onCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await copyToClipboard(absoluteUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      } catch {
        // dacă pică, nu facem nimic special
      }
    },
    [absoluteUrl]
  );

  return (
    <div className={className}>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onFacebook}
          className="
            inline-flex items-center gap-2
            rounded-lg px-2 py-2
            bg-[#1877F2] text-white hover:brightness-95
            text-xs font-extrabold
            shadow-sm transition
          "
          aria-label="Share pe Facebook"
          title="Share pe Facebook"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M13.5 22v-8h2.6l.4-3h-3V9.1c0-.9.2-1.5 1.5-1.5H16V5c-.5-.1-1.5-.2-2.6-.2-2.6 0-4.3 1.6-4.3 4.5V11H7v3h2.1v8h4.4z"
            />
          </svg>
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          type="button"
          onClick={onWhatsApp}
          className="
            inline-flex items-center gap-2
            rounded-lg px-2 py-2
            bg-[#128C7E] text-white hover:brightness-95
            text-xs font-extrabold
            shadow-sm transition
          "
          aria-label="Share pe WhatsApp"
          title="Share pe WhatsApp"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M20.5 3.5A11 11 0 0 0 3.3 17.7L2 22l4.4-1.2A11 11 0 0 0 22 12a11 11 0 0 0-1.5-8.5zM12 20a9 9 0 0 1-4.6-1.3l-.3-.2-2.6.7.7-2.5-.2-.3A9 9 0 1 1 12 20zm5.2-6.7c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a7.4 7.4 0 0 1-2.2-1.4 8 8 0 0 1-1.5-1.8c-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.4.3-.6 0-.2 0-.4-.1-.6s-.7-1.7-.9-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.3 3.4c.2.2 2.4 3.7 5.9 5.2.8.3 1.4.5 1.9.6.8.3 1.6.2 2.2.1.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4z"
            />
          </svg>
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          type="button"
          onClick={onCopy}
          className="
            inline-flex items-center gap-2
            rounded-lg px-2 py-2
            bg-gray-200 text-gray-900 hover:bg-gray-300
            dark:bg-white/10 dark:text-white dark:hover:bg-white/15
            text-xs font-extrabold
            shadow-sm transition
          "
          aria-label="Copiază link"
          title="Copiază link"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z"
            />
          </svg>
          <span className="hidden sm:inline">{copied ? "Copiat" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}
