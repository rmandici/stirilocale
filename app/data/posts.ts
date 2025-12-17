import type { CategorySlug } from "./categories";
import { categories } from "./categories";

export type Category = {
  id?: number | string;
  slug: string;
  name: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category; // 👈 nu mai e limitată
  author: string;
  publishedAt: string;
  image: string;
  images: string[];
  featured?: boolean;
  views: number;
  video?: string;
};

function pick<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(maxDays = 14) {
  const ms = Math.floor(Math.random() * maxDays * 24 * 60 * 60 * 1000);
  return new Date(Date.now() - ms);
}

const titleSeeds = [
  "Articol demonstrativ pentru demo",
  "Știre generată automat",
  "Titlu generic pentru structură",
  "Exemplu de conținut editorial",
  "Actualizare: informații noi",
];

const authors = ["Redacția", "Editor", "Reporter", "Admin", "Echipa Demo"];

// imagini simple (remote) – fără să descarci nimic
const images = [
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=60",
];

const videos = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
];

export const posts: Post[] = Array.from({ length: 50 }).map((_, i) => {
  const cat = pick(categories);
  const date = daysAgo(10);
  const isVideo = i % 6 === 0; // fiecare al 6-lea articol e video (demo)

  return {
    id: `p_${i + 1}`,
    slug: `articol-demo-${i + 1}`,
    title: `${pick(titleSeeds)} #${i + 1}`,
    excerpt:
      "Text scurt demonstrativ (extras) pentru a testa layout-ul de listare și cardurile de știri.",
    content: `
    <p>Acesta este conținut placeholder pentru demo.</p>
    <p>Poți înlocui ulterior sursa de date cu WordPress/alt CMS.</p>
    <h2>Subtitlu demo</h2>
    <p>Încă un paragraf pentru a simula un articol mai lung.</p>
  `,
    category: cat,
    author: pick(authors),
    publishedAt: date.toISOString(),
    image: images[i % images.length],
    images: [
      images[i % images.length],
      images[(i + 1) % images.length],
      images[(i + 2) % images.length],
    ],
    featured: i === 0,
    views: Math.floor(Math.random() * 25000),
    video: isVideo ? pick(videos) : undefined, // 👈 AICI
  };
});
