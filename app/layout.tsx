import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// 1. Setup Font Utama (UI)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // Kita beri nama variabel
  display: "swap",
});

// 2. Setup Font Data (SKU/ID/Code)
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono", // Kita beri nama variabel
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inventra",
  description: "Smart Inventory Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
