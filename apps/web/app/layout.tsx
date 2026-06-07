import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/links";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SyncX — Mirror your Google searches to Bing",
    template: "%s · SyncX",
  },
  description:
    "Open-source Chrome extension that mirrors your Google searches to Bing — with configurable pacing, daily limits, and no cloud required.",
  applicationName: "SyncX",
  keywords: ["SyncX", "Chrome extension", "Bing", "search mirror", "open source"],
  authors: [{ name: "Devom B" }],
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon-128.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SyncX — Mirror your searches to Bing",
    description:
      "Open-source Chrome extension. Local-first, self-hostable, MIT licensed.",
    type: "website",
    url: SITE_URL,
    siteName: "SyncX",
  },
  twitter: {
    card: "summary",
    title: "SyncX — Mirror your searches to Bing",
    description:
      "Open-source Chrome extension that mirrors your Google searches to Bing.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0e12",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
