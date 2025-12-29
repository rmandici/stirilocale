"use client";

export type NavPost = {
  slug: string;
  title: string;
  categorySlug: string;
  image?: string;
  dateLabel?: string;
};

type CacheEntry = {
  ts: number;
  items: NavPost[];
  loading: boolean;
};

const CACHE = new Map<string, CacheEntry>();
const TTL = 60_000; // 1 minut

function keyFor(slug: string) {
  return slug.toLowerCase().trim();
}

async function fetchNavPosts(
  categorySlug: string,
  limit: number
): Promise<NavPost[]> {
  const res = await fetch(
    `/api/nav-posts?category=${encodeURIComponent(categorySlug)}&limit=${limit}`
  );
  if (!res.ok) return [];
  const data = (await res.json()) as unknown;

  if (!Array.isArray(data)) return [];

  return data
    .map((x) => x as Partial<NavPost>)
    .filter((x): x is NavPost => Boolean(x.slug && x.title && x.categorySlug))
    .slice(0, limit);
}

/**
 * ✅ aceeași semnătură ca înainte
 * Returnează imediat ce are în cache (poate [] prima dată),
 * apoi face fetch și notifică UI-ul când vin datele.
 */
export function getLatestPostsByCategory(
  categorySlug: string,
  limit = 6
): NavPost[] {
  const k = keyFor(categorySlug);
  if (!k) return [];

  const now = Date.now();
  const cached = CACHE.get(k);

  // dacă cache e proaspăt
  if (cached && now - cached.ts < TTL && cached.items.length)
    return cached.items;

  // dacă deja încarcă, returnăm ce avem
  if (cached?.loading) return cached.items;

  // inițiem încărcarea
  CACHE.set(k, { ts: now, items: cached?.items ?? [], loading: true });

  fetchNavPosts(k, limit)
    .then((items) => {
      CACHE.set(k, { ts: Date.now(), items, loading: false });
      window.dispatchEvent(new Event("navposts:update"));
    })
    .catch(() => {
      CACHE.set(k, {
        ts: Date.now(),
        items: cached?.items ?? [],
        loading: false,
      });
      window.dispatchEvent(new Event("navposts:update"));
    });

  return cached?.items ?? [];
}
