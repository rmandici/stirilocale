export const categories = [
  { slug: "categorie-1", name: "Local" },
  { slug: "categorie-2", name: "Politică" },
  { slug: "categorie-3", name: "Actualitate" },
  { slug: "categorie-4", name: "Sport" },
  { slug: "categorie-5", name: "Ultimă oră" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];
