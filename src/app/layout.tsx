import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { AnnouncementBar } from "@/components/home";

export const metadata: Metadata = {
  title: {
    template: "%s | AMW Career Point - MBBS Abroad Consultancy",
    default: "AMW Career Point - MBBS Abroad Consultancy | Study Medicine Overseas",
  },
  description: "Expert consultancy for MBBS abroad. We help students achieve their dream of becoming doctors through quality education in top international medical universities.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white font-sans">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
