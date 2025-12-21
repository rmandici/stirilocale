"use client";

import { useCallback } from "react";

function buildFacebookShareUrl(fullUrl: string) {
  const u = encodeURIComponent(fullUrl);
  return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
}

export function FacebookShareButton({
  path,
  title,
  className = "",
  children,
}: {
  path: string;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const origin = window.location.origin;
      const fullUrl = origin + path;

      window.open(
        buildFacebookShareUrl(fullUrl),
        "_blank",
        "noopener,noreferrer"
      );
    },
    [path]
  );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title ? `Share pe Facebook: ${title}` : "Share pe Facebook"}
      className={className}
    >
      {/* dacă ai children, le afișezi; altfel afișezi icon */}
      {children ? (
        children
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M13.5 22v-8h2.6l.4-3h-3V9.1c0-.9.2-1.5 1.5-1.5H16V5c-.5-.1-1.5-.2-2.6-.2-2.6 0-4.3 1.6-4.3 4.5V11H7v3h2.1v8h4.4z"
          />
        </svg>
      )}
    </button>
  );
}
