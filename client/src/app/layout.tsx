import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://umkm-sragen-hub.vercel.app'),
  title: {
    default: "UMKM Sragen Hub - Majukan UMKM Bersama",
    template: "%s | UMKM Sragen Hub"
  },
  description: "Platform Digital untuk Memajukan UMKM Sragen. Temukan produk lokal berkualitas, berita terkini, dan peluang bisnis di Sragen.",
  keywords: ["UMKM Sragen", "Sragen Hub", "Produk Lokal Sragen", "Bisnis Sragen", "Jual Beli Sragen"],
  authors: [{ name: "UMKM Sragen Team" }],
  openGraph: {
    title: "UMKM Sragen Hub",
    description: "Platform Digital untuk Memajukan UMKM Sragen",
    url: 'https://umkm-sragen-hub.vercel.app',
    siteName: 'UMKM Sragen Hub',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "UMKM Sragen Hub",
    description: "Platform Digital untuk Memajukan UMKM Sragen",
  },
  verification: {
    google: "vgWGBqR66U2WUkP-PVr7722EJlwdbFFNzV-8Qtcz4NM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
