import "./globals.css";
import { Shell } from "./components/Shell";
import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "stirilocale",
  description: "Demo site știri",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body className={`${inter.variable} ${newsreader.variable}`}>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
