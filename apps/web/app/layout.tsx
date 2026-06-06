import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SyncX — Search mirror queue for Chrome",
    template: "%s · SyncX",
  },
  description:
    "SyncX captures Google search queries and replays them on Bing in your browser with enforced pacing and daily caps.",
  icons: {
    icon: "/icon-128.png",
  },
  openGraph: {
    title: "SyncX — Search mirror queue for Chrome",
    description:
      "Personal search mirroring with local-first mode and optional self-hosted AWS backend.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
