"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";
import { MarketTicker } from "./MarketTicker";
import { Footer } from "./Footer";
import { ThemeProvider } from "./theme-provider";

export function Shell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      setCollapsed(window.scrollY > 30);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <ThemeProvider>
        <Header />

        {/* banner overlay (nu împinge nimic) */}

        {/* <MarketTicker /> */}
        <div className="bg-white text-gray-900 dark:bg-black/95 dark:text-white">
          {children}
        </div>

        <Footer />
      </ThemeProvider>
    </>
  );
}
