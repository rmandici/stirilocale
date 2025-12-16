"use client";

export function HamburgerButton({
  open,
  onClick,
  ariaLabel,
}: {
  open: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="relative flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10"
    >
      <span className="sr-only">{ariaLabel}</span>

      <div className="relative h-4 w-5">
        {/* linia 1 */}
        <span
          className={[
            "absolute left-0 top-0 h-[2px] w-full bg-current",
            "transition-transform duration-200 ease-in-out",
            open ? "translate-y-[7px] rotate-45" : "",
          ].join(" ")}
        />

        {/* linia 2 */}
        <span
          className={[
            "absolute left-0 top-[7px] h-[2px] w-full bg-current",
            "transition-all duration-200 ease-in-out",
            open ? "opacity-0 scale-x-0" : "",
          ].join(" ")}
        />

        {/* linia 3 */}
        <span
          className={[
            "absolute left-0 top-[14px] h-[2px] w-full bg-current",
            "transition-transform duration-200 ease-in-out",
            open ? "-translate-y-[7px] -rotate-45" : "",
          ].join(" ")}
        />
      </div>
    </button>
  );
}
