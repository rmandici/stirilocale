import "./globals.css";
import { Shell } from "./components/Shell";
import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-serif" });

const site =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

const ogHome =
  "https://cms.callatispress.ro/wp/wp-content/uploads/2025/12/og-home.jpg";

export const metadata: Metadata = {
  metadataBase: site ? new URL(site) : new URL("https://callatispress.ro"),

  title: {
    default: "Callatis Press",
    template: "%s | Știri Locale",
  },

  description:
    "Știri din România: actualitate, local, politică, sport, ultimă oră.",

  openGraph: {
    type: "website",
    url: "https://callatispress.ro/",
    siteName: "Callatis Press",
    locale: "ro_RO",
    title: "Callatis Press",
    description:
      "Știri din România: actualitate, local, politică, sport, ultimă oră.",
    images: [
      {
        url: ogHome,
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Callatis Press",
    description:
      "Știri din România: actualitate, local, politică, sport, ultimă oră.",
    images: [ogHome],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body className={`${inter.variable} ${newsreader.variable}`}>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
