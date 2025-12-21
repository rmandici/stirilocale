import { posts as demoPosts } from "../data/posts";

type NavPost = {
  slug: string;
  title: string;
  categorySlug: string;
  image?: string;
  author?: string;
  dateLabel?: string;
};

function stripHtml(html: string) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function fmtDate(iso?: string) {
  try {
    return iso ? new Date(iso).toLocaleDateString("ro-RO") : "recent";
  } catch {
    return "recent";
  }
}

/**
 * Normalizare: lower + fără diacritice + trim
 */
function norm(s: string) {
  return (s || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Ia slug categoria din orice structură posibilă:
 * - p.categorySlug (dacă există)
 * - p.category.slug (cum ai în WP și în multe demo-uri)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCatSlug(p: any): string {
  return String(p?.categorySlug ?? p?.category?.slug ?? "").trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toNavPost(p: any): NavPost {
  return {
    slug: String(p?.slug ?? ""),
    title: stripHtml(String(p?.title ?? "")),
    categorySlug: getCatSlug(p),
    image: p?.image ? String(p.image) : undefined,
    author: p?.author ? String(p.author) : "Redacție",
    dateLabel: fmtDate(p?.publishedAt ?? p?.date ?? p?.createdAt),
  };
}

/**
 * ✅ Funcția folosită în Header
 */
export function getLatestPostsByCategory(
  categorySlug: string,
  limit = 6
): NavPost[] {
  const wanted = norm(categorySlug);
  if (!wanted) return [];

  // Debug rapid (opțional): vezi în console dacă intră și ce filtrează
  // console.log("[getLatestPostsByCategory]", { categorySlug, wanted, total: demoPosts.length });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtered = (demoPosts as any[])
    .filter((p) => {
      const slug = norm(getCatSlug(p));
      return slug === wanted;
    })
    .map(toNavPost)
    .filter((p) => p.slug && p.title);

  return filtered.slice(0, limit);
}
