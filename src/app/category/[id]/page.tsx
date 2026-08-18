"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { useInventory } from "@/lib/InventoryContext";
import CategoryView from "@/components/CategoryView";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function CategoryContent() {
  const params = useParams();
  const catId = params.id as string;
  const { categories } = useInventory();
  const category = categories.find((c) => c.id === catId);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-slate-900">Kategori ikke fundet</h2>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbage til forsiden
          </Link>
        </div>
      </div>
    );
  }

  return <CategoryView category={category} />;
}

export default function CategoryPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Suspense fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
        </div>
      }>
        <CategoryContent />
      </Suspense>
    </div>
  );
}
