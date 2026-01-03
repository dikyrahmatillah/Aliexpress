import type { Metadata } from "next";
import "@/lib/registerUnhandledRejection";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Runolf",
  description:
    "World's most awarded brand. Fast delivery and fast customer support.",
  keywords:
    "e-commerce, online shopping, buy online, fast delivery, customer support, best prices, deals, discounts, shop online, secure payment, Runolf, fashion, electronics, home goods, accessories, trending products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <QueryProvider>{children}</QueryProvider>
        <Footer />
      </body>
    </html>
  );
}
