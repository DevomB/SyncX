import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CoconutAsset } from "@/components/CoconutAsset";
import { CoconutGuard } from "@/components/CoconutGuard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "SyncX",
    template: "%s · SyncX",
  },
  description:
    "Open-source Chrome extension that mirrors your Google searches to Bing — with configurable pacing, daily limits, and no cloud required.",
  icons: {
    icon: "/icon-128.png",
  },
  openGraph: {
    title: "SyncX — Mirror your searches to Bing",
    description:
      "Open-source Chrome extension. Local-first, self-hostable, MIT licensed.",
    type: "website",
    url: "https://syncx.devomb.com",
  },
  twitter: {
    card: "summary",
    title: "SyncX",
    description: "Open-source Chrome extension that mirrors your Google searches to Bing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <CoconutAsset />
        <CoconutGuard>
          <Header />
          <main>{children}</main>
          <Footer />
        </CoconutGuard>
      </body>
    </html>
  );
}
