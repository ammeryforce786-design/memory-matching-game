import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ammeryforce786-design.github.io/memory-matching-game/"),
  title: "Memory Match",
  description: "Find all ten number pairs before your lives run out.",
  openGraph: {
    title: "Memory Match",
    description: "Find all ten number pairs before your lives run out.",
    images: [{ url: "og.png", width: 1733, height: 909, alt: "Memory Match number card game" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memory Match",
    description: "Find all ten number pairs before your lives run out.",
    images: ["og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
