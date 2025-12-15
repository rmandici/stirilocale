"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";
import { MarketTicker } from "./MarketTicker";
import { BannerOverlay } from "./BannerOverlay";
import { Footer } from "./Footer";

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
      <Header showCompactLogo={collapsed} navShifted={collapsed} />

      {/* spațiu CONSTANT sub header ca să aibă loc bannerul (NU se schimbă la scroll) */}
      <div className="h-[112px] md:h-[164px]" />

      {/* banner overlay (nu împinge nimic) */}
      <BannerOverlay hidden={collapsed} />

      <MarketTicker />
      {children}
      <Footer />
    </>
  );
}
