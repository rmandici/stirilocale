const items = [
  { symbol: "CMCSA", price: "27.23", change: "-1.34%", delta: "-0.37" },
  { symbol: "NWS", price: "29.66", change: "+0.34%", delta: "+0.10" },
  { symbol: "HOG", price: "21.59", change: "-3.40%", delta: "-0.76" },
  { symbol: "TSLA", price: "458.96", change: "+2.70%", delta: "+12.07" },
  { symbol: "HYMFT", price: "51.00", change: "0.00%", delta: "0.00" },
  { symbol: "NVDA", price: "175.02", change: "-3.27%", delta: "-5.91" },
  { symbol: "WMT", price: "116.70", change: "+1.10%", delta: "+1.25" },
];

function isUp(v: string) {
  return v.trim().startsWith("+");
}

function TickerRow({ clone = false }: { clone?: boolean }) {
  return (
    <div className="flex min-w-max items-center gap-10 px-6">
      {items.map((it) => {
        const up = isUp(it.change);
        return (
          <div
            key={(clone ? "c-" : "") + it.symbol}
            className="flex items-baseline gap-3 whitespace-nowrap"
          >
            <span className="text-xs font-semibold tracking-wide text-gray-800 dark:text-zinc-100">
              {it.symbol}
            </span>

            <span className="text-xs text-gray-600 dark:text-zinc-400">
              ${it.price}
            </span>

            <span
              className={[
                "text-xs font-semibold",
                up
                  ? "text-green-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-rose-400",
              ].join(" ")}
            >
              {it.change}
            </span>

            <span
              className={[
                "text-xs",
                up
                  ? "text-green-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-rose-400",
              ].join(" ")}
            >
              {it.delta}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function MarketTicker() {
  return (
    <div className="border-b border-black/10 bg-white dark:border-white/10 dark:bg-black/95">
      <div className="mx-auto max-w-[80rem] overflow-hidden">
        <div className="flex h-10 items-center">
          <div className="ticker-track flex">
            <TickerRow />
            <TickerRow clone />
          </div>
        </div>
      </div>
    </div>
  );
}
