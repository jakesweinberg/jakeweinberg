import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Intro, { introScript } from "@/components/Intro";
import { site } from "@/data/site";
import "./globals.css";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", weight: ["400"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.tagline,
  openGraph: { siteName: site.name, type: "website" },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        {site.intro && (
          <>
            <script dangerouslySetInnerHTML={{ __html: introScript }} />
            <Intro />
          </>
        )}
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
