import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
    default: "SyncX - Run your Google searches on Bing too",
    template: "%s · SyncX",
  },
  description:
    "SyncX is an open-source Chrome extension that queues your Google searches locally and replays them on Bing at the pace you choose.",
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
    title: "SyncX - Run your Google searches on Bing too",
    description:
      "Open-source Chrome extension with local storage, pacing controls, and optional self-hosting.",
    type: "website",
    url: SITE_URL,
    siteName: "SyncX",
  },
  twitter: {
    card: "summary",
    title: "SyncX - Run your Google searches on Bing too",
    description:
      "Queue Google searches locally and replay them on Bing at the pace you choose.",
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
        <Analytics />
      </body>
    </html>
  );
}
