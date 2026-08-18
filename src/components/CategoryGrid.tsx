"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useInventory } from "@/lib/InventoryContext";

export default function CategoryGrid() {
  const { categories } = useInventory();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-2xl border border-slate-200/80 bg-white h-48 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => {
        return (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="block group"
          >
            <div className="rounded-2xl border border-slate-200/80 bg-white text-slate-900 shadow-sm h-full transition-all hover:shadow-md overflow-hidden relative">
              <div className="p-0 h-48 relative">
                {/* Background overlay with category color opacity */}
                <div className={`absolute inset-0 ${category.bgColor} opacity-20 group-hover:opacity-30 transition-opacity`} />
                {/* Top color bar */}
                <div className={`absolute top-0 left-0 w-full h-2 ${category.bgColor}`} />
                {/* Bottom accent opacity */}
                <div className={`absolute bottom-0 left-0 w-full h-16 ${category.bgColor} opacity-10`} />

                <div className="p-6 h-full flex flex-col items-center justify-center relative">
                  <div className="text-2xl font-bold mb-2 text-foreground">{category.name}</div>
                  <div className="text-lg text-muted-foreground">{category.boxCount} kasser</div>
                  
                  {/* Badge bottom right */}
                  <div className={`absolute bottom-4 right-4 w-12 h-12 ${category.bgColor} rounded-md shadow-md flex items-center justify-center ${category.textColor}`}>
                    <span className="text-sm font-bold">{category.boxCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
