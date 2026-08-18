"use client";

import Header from "@/components/Header";
import CategoryGrid from "@/components/CategoryGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pb-16">
        <CategoryGrid />
      </main>
    </div>
  );
}
