import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InventoryProvider } from "@/lib/InventoryContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Værkstedets Inventarsystem",
  description: "Lokal og tilpasselig version af Værkstedets Inventarsystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body className={`${inter.className} bg-white text-slate-900 antialiased`}>
        <InventoryProvider>{children}</InventoryProvider>
      </body>
    </html>
  );
}
