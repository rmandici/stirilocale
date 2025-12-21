import "./globals.css";
import { Shell } from "./components/Shell";
import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import ServerShell from "./components/ServerShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-serif" });

const site =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

export const metadata: Metadata = {
  metadataBase: site ? new URL(site) : new URL("https://callatispress.ro"),

  title: {
    default: "Callatis Press",
    template: "%s | Știri Locale",
  },

  description:
    "Știri din România: actualitate, local, politică, sport, ultimă oră.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body className={`${inter.variable} ${newsreader.variable}`}>
        <ServerShell>{children}</ServerShell>
      </body>
    </html>
  );
}
