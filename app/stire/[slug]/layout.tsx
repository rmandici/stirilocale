import type { Metadata } from "next";

type Params = { slug: string };
type MaybePromise<T> = T | Promise<T>;

function siteBase() {
  const s =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return s || "https://callatispress.ro";
}

async function resolveParams(p: MaybePromise<Params>): Promise<Params> {
  return await Promise.resolve(p);
}

// ✅ METADATA DE TEST: fără WP, fără fetch, fără nimic dinamic
export async function generateMetadata({
  params,
}: {
  params: MaybePromise<Params>;
}): Promise<Metadata> {
  const site = siteBase();
  const { slug } = await resolveParams(params);

  const canonical = new URL(`/stire/${slug}`, site).toString();
  const ogImage = new URL("/og-home.jpg", site).toString();

  return {
    metadataBase: new URL(site),
    title: `TEST OG - ${slug}`,
    description: `Descriere TEST pentru ${slug}`,
    alternates: { canonical },

    openGraph: {
      type: "article",
      url: canonical,
      title: `TEST OG - ${slug}`,
      description: `Descriere TEST pentru ${slug}`,
      siteName: "Callatis Press",
      locale: "ro_RO",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `TEST OG - ${slug}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `TEST OG - ${slug}`,
      description: `Descriere TEST pentru ${slug}`,
      images: [ogImage],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
