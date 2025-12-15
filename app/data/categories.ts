export const categories = [
  { slug: "categorie-1", name: "Categorie 1" },
  { slug: "categorie-2", name: "Categorie 2" },
  { slug: "categorie-3", name: "Categorie 3" },
  { slug: "categorie-4", name: "Categorie 4" },
  { slug: "categorie-5", name: "Categorie 5" },
  { slug: "video", name: "Video" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];
