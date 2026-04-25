import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://entros.io"),
  title: {
    default: "Entros Protocol — Proof of Personhood on Solana",
    template: "%s | Entros Protocol",
  },
  description:
    "Prove you're human without revealing who you are. Solana-native identity verification through the dynamic signature of liveness — voice, motion, and touch, verified with zero-knowledge proofs.",
  icons: {
    icon: [
      { url: "/favicons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Entros Protocol — Proof of Personhood on Solana",
    description:
      "Solana-native identity verification through behavioral liveness. Privacy by architecture.",
    url: "https://entros.io",
    siteName: "Entros Protocol",
    type: "website",
    images: [
      {
        url: "/logos/og-card.png",
        width: 1200,
        height: 630,
        alt: "Entros Protocol",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Entros Protocol — Proof of Personhood on Solana",
    description:
      "Prove you're human without revealing who you are. Built on Solana.",
    creator: "@entros_protocol",
    images: ["/logos/og-card.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="min-h-[100svh] overflow-x-clip bg-background text-foreground font-sans antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
