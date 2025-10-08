import type { Metadata } from "next";
import { Oswald, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./provider/ReactQueryProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const oswald = Oswald({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopNex",
  description: `ShopNex is a next-gen e-commerce platform built to redefine the way you shop online.
With AI-driven recommendations, lightning-fast performance, and a clean modern interface — ShopNex makes shopping effortless.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ReactQueryProvider>
          <Navbar></Navbar>
          <main className="flex-1 flex flex-col">
          {children}
          </main>
        <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
