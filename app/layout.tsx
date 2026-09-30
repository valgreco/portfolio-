import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GridSpotlight from "@/components/GridSpotlight";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://leragreco.com"),
  title: "Valeria Greco, Product Manager",
  description:
    "Product Manager building fintech for travellers across Europe. Italian, based in Madrid. Building with AI.",
  openGraph: {
    title: "Valeria Greco, Product Manager",
    description:
      "Product Manager building fintech for travellers across Europe. Italian, based in Madrid. Building with AI.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valeria Greco, Product Manager",
    description:
      "Product Manager building fintech for travellers across Europe. Building with AI.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="min-h-screen">
        <GridSpotlight />
        <Nav />
        <LenisProvider>
          {children}
          <Footer />
        </LenisProvider>
        <Analytics />
      </body>
    </html>
  );
}
