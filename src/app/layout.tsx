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
  title: {
    default: "IAM Protocol — Proof of Humanity on Solana",
    template: "%s | IAM Protocol",
  },
  description:
    "Prove you're human without revealing who you are. Solana-native identity verification through behavioral liveness — not iris scans, not selfies, not social graphs.",
  openGraph: {
    title: "IAM Protocol — Proof of Humanity on Solana",
    description:
      "Solana-native identity verification through behavioral liveness. Privacy by architecture.",
    url: "https://iam-human.io",
    siteName: "IAM Protocol",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IAM Protocol — Proof of Humanity on Solana",
    description:
      "Prove you're human without revealing who you are. Built on Solana.",
    creator: "@iam_protocol",
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
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
