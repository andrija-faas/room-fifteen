import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// Self-hosted (Fontsource, OFL) so builds don't depend on reaching Google Fonts.
const anton = localFont({ src: "./fonts/anton-latin-400-normal.woff2", weight: "400", variable: "--font-anton" });
const inter = localFont({ src: "./fonts/inter-latin-wght-normal.woff2", weight: "100 900", variable: "--font-inter" });
const jetbrains = localFont({
  src: "./fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: "Room Fifteen — Gambling, but efficient",
  description:
    "We bring efficiency to your gambling. Saving 100% of your time for 1% of your money.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="min-h-screen bg-bg font-sans text-ink">{children}</body>
    </html>
  );
}
