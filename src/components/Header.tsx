"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useInventory } from "@/lib/InventoryContext";

export default function Header() {
  const { boxes, categories, isLoggedIn, logout } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");

  // Escape key listener to close search dropdown
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchTerm) {
        setSearchTerm("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchTerm]);

  const searchResults = searchTerm.trim()
    ? boxes
        .map((box) => {
          const cat = categories.find((c) => c.id === box.categoryId);
          const matchedItems = (box.items || []).filter(
            (item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
          );
          const boxMatches = box.name.toLowerCase().includes(searchTerm.toLowerCase());

          if (boxMatches || matchedItems.length > 0) {
            return {
              box,
              category: cat,
              matchedItems: matchedItems.length > 0 ? matchedItems : box.items || []
            };
          }
          return null;
        })
        .filter(Boolean)
    : [];

  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        {/* Top bar with Admin Dashboard link or Log ind */}
        <div className="flex justify-end items-center gap-2 mb-8">
          {mounted && isLoggedIn ? (
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 h-9 px-4 shadow-sm transition-colors"
            >
              ⚙️ Admin Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 h-9 px-4 shadow-sm transition-colors"
            >
              Log ind
            </Link>
          )}
        </div>

        {/* Big title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 sm:text-5xl">
            Værkstedets Inventarsystem
          </h1>
          <p className="text-lg text-slate-500 font-normal">
            Find hvad du har brug for i vores værkstedskasser
          </p>
        </div>

        {/* Large center search bar */}
        <div className="max-w-2xl mx-auto relative">
          <form onSubmit={(e) => e.preventDefault()} className="relative">
            <input
              type="text"
              placeholder="Søg efter genstande på tværs af alle kasser..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3.5 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white rounded-lg p-2 hover:bg-slate-800 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Search Dropdown */}
          {searchTerm.trim() && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 max-h-[70vh] overflow-y-auto">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-sm font-bold text-slate-900">Søgeresultater</h3>
                <button onClick={() => setSearchTerm("")} className="text-slate-400 hover:text-slate-900">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {searchResults.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">Ingen resultater fundet</p>
                ) : (
                  searchResults.map((res) => {
                    if (!res) return null;
                    const { box, category, matchedItems } = res;
                    return (
                      <Link
                        key={box.id}
                        href={`/category/${category?.id}?boxId=${box.id}`}
                        onClick={() => setSearchTerm("")}
                        className="block border border-slate-200 rounded-lg overflow-hidden bg-white hover:border-sky-400 hover:shadow-md transition-all group"
                      >
                        <div className={`p-3 ${category?.bgColor} ${category?.textColor} flex justify-between items-center`}>
                          <div>
                            <h4 className="font-bold text-sm group-hover:underline">{box.name}</h4>
                            <p className="text-xs opacity-90">{category?.name} kategori</p>
                          </div>
                          <div className="bg-black text-white w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                            {box.number}
                          </div>
                        </div>

                        <div className="p-3">
                          {matchedItems.length > 0 ? (
                            <div className="space-y-1.5">
                              {matchedItems.map((item) => (
                                <div key={item.id} className="text-xs flex justify-between text-slate-700 bg-slate-50 p-2 rounded">
                                  <span>{item.name}</span>
                                  {item.quantity !== undefined && <span className="font-mono text-slate-400">x{item.quantity}</span>}
                                </div>
                              ))}
                            </div>
                          ) : null}
                          <div className="mt-2.5 text-right">
                            <span className="text-xs font-semibold text-sky-600 group-hover:underline flex items-center justify-end gap-1">
                              <span>Åbn kasse</span>
                              <span>→</span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
