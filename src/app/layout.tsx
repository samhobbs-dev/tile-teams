import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tileteams.com"),
  title: {
    default: "TileTeams - Discover college football records, logos, and more!",
    template: "%s | TileTeams",
  },
  description: "Discover college football records, logos, and more!",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TileTeams",
    description: "Discover college football records, logos, and more!",
    url: "/",
    siteName: "TileTeams",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TileTeams",
    description: "Discover college football records, logos, and more!",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
