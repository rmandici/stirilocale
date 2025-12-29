import type { ReactNode } from "react";
import { getWpCategories } from "../lib/wp";
import { Shell } from "./Shell";

export default async function ServerShell({
  children,
}: {
  children: ReactNode;
}) {
  const catsMap = await getWpCategories();

  const categories = Array.from(catsMap.values())
    .filter(Boolean)
    .filter((c) => {
      const slug = (c.slug ?? "").toLowerCase();
      const name = (c.name ?? "").toLowerCase();
      return slug !== "uncategorized" && name !== "uncategorized";
    });

  return <Shell categories={categories}>{children}</Shell>;
}
