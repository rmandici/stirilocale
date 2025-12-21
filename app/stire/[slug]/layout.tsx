import type { Metadata } from "next";
import { getWpPostBySlug } from "../../lib/wp";
import { posts as demoPosts } from "../../data/posts";

function siteBase() {
  const s =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  // fallback hard ca să nu ajungi la url relativ/greșit
  return s || "https://callatispress.ro";
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;

  const wpPost = await getWpPostBySlug(slug);
  const demoPost = demoPosts.find((p) => p.slug === slug) ?? null;
  const post = wpPost ?? demoPost;

  const site = siteBase();

  // dacă nu găsește articolul, măcar să nu trimită og:url=homepage
  if (!post) {
    const fallbackOg = new URL("/og-home.jpg", site).toString();
    return {
      metadataBase: new URL(site),
      title: "Callatis Press",
      openGraph: {
        type: "website",
        url: site,
        title: "Callatis Press",
        siteName: "Callatis Press",
        locale: "ro_RO",
        images: [
          { url: fallbackOg, width: 1200, height: 630, alt: "Callatis Press" },
        ],
      },
    };
  }

  const canonical = new URL(`/stire/${post.slug}`, site).toString();
  const fallbackOg = new URL("/og-home.jpg", site).toString();
  const img = post.image ? new URL(post.image, site).toString() : fallbackOg;

  return {
    metadataBase: new URL(site),
    title: post.title,
    description: post.excerpt || "",
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description: post.excerpt || "",
      siteName: "Callatis Press",
      locale: "ro_RO",
      images: [{ url: img, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: [img],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
