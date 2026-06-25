import type { Metadata } from "next";
import { Suspense } from "react";
import JotaiProvider from "./providers/JotaiProvider";
import ScrollToTop from "./components/ScrollToTop";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Point dos amigos",
  description: "O sabor autêntico da Amazônia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={cn("antialiased", "font-sans", inter.variable)}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Inter:wght@400;700&family=Epilogue:wght@700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col font-body bg-background text-on-background">
        <JotaiProvider>
          <Suspense fallback={null}>
            <ScrollToTop />
          </Suspense>
          {children}
        </JotaiProvider>
      </body>
    </html>
  );
}
