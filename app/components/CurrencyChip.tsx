"use client";

import { useEffect, useState } from "react";

const rates = [
  { code: "EUR", ron: 4.97, change: +0.02 },
  { code: "USD", ron: 4.55, change: -0.01 },
  { code: "GBP", ron: 5.78, change: +0.03 },
  { code: "CHF", ron: 5.2, change: 0.0 },
];

export function CurrencyChip({ compact = false }: { compact?: boolean }) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setI((v) => (v + 1) % rates.length);
        setVisible(true);
      }, 220);
    }, 2500);

    return () => clearInterval(t);
  }, []);

  const r = rates[i];
  const up = r.change > 0;
  const down = r.change < 0;

  return (
    <div
      className={[
        "h-10 items-center justify-center rounded-md border bg-white px-3",
        compact ? "w-[132px]" : "w-[210px]",
        "flex",
      ].join(" ")}
    >
      <div
        className={[
          "flex w-full items-center justify-between gap-2",
          "transition-all duration-300 ease-out",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-0.5",
        ].join(" ")}
      >
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-gray-900">{r.code}</span>
          {!compact && (
            <span className="tabular-nums text-gray-700">
              {r.ron.toFixed(2)} RON
            </span>
          )}
        </div>

        <span
          className={[
            "tabular-nums font-semibold",
            up ? "text-green-600" : down ? "text-red-600" : "text-gray-500",
          ].join(" ")}
        >
          {up ? "+" : ""}
          {r.change.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
