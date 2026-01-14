import type { Metadata } from "next";
import { Oswald, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import AuthSessionProvider from "./providers/AuthSessionProvider";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import Navbar from "../components/layout/navbar/Navbar";
import Footer from "../components/layout/Footer";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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
      <body
        className={`${oswald.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >  <AuthSessionProvider>
        <ReactQueryProvider>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <Navbar></Navbar>
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
             <ReactQueryDevtools initialIsOpen={true} />
        </ReactQueryProvider>
         </AuthSessionProvider>
      </body>
    </html>
  );
}
