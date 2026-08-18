"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Plus, Trash2, X, AlertTriangle, Upload, ArrowUp } from "lucide-react";
import { useInventory } from "@/lib/InventoryContext";
import { InventoryCategory, InventoryBox } from "@/lib/data";

import { compressAndUploadImage } from "@/lib/imageUtils";

interface CategoryViewProps {
  category: InventoryCategory;
}

export default function CategoryView({ category }: CategoryViewProps) {
  const searchParams = useSearchParams();
  const boxIdParam = searchParams.get("boxId");

  const { categories, boxes, isLoggedIn, login, logout, addItem, deleteItem, deleteBox, toggleItemProblem, addWish } = useInventory();
  const categoryBoxes = boxes.filter((b) => b.categoryId === category.id);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBox, setSelectedBox] = useState<InventoryBox | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (boxIdParam) {
      const foundBox = boxes.find((b) => b.id === boxIdParam);
      if (foundBox) {
        setSelectedBox(foundBox);
      }
    }
  }, [boxIdParam, boxes]);

  // Wishes modal state
  const [isWishesOpen, setIsWishesOpen] = useState(false);
  const [wishName, setWishName] = useState("");
  const [wishDescription, setWishDescription] = useState("");
  const [wishSubmitted, setWishSubmitted] = useState(false);

  // New item modal form state
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemImage, setNewItemImage] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  // Global Escape key listener to close popups
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isAddItemOpen) {
          setIsAddItemOpen(false);
        } else if (isWishesOpen) {
          setIsWishesOpen(false);
        } else if (selectedBox) {
          setSelectedBox(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAddItemOpen, isWishesOpen, selectedBox]);

  const filteredBoxes = categoryBoxes
    .filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.number - b.number);

  const activeBox = selectedBox
    ? boxes.find((b) => b.id === selectedBox.id) || selectedBox
    : null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      const downloadUrl = await compressAndUploadImage(file);
      setNewItemImage(downloadUrl);
    } catch (err) {
      console.error("Fejl ved billedkomprimering og upload", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBox || !newItemName.trim()) return;

    addItem(activeBox.id, {
      name: newItemName,
      description: newItemDesc,
      quantity: Number(newItemQty),
      image: newItemImage || undefined
    });

    setNewItemName("");
    setNewItemDesc("");
    setNewItemQty(1);
    setNewItemImage("");
    setIsAddItemOpen(false);
  };

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishDescription.trim()) return;

    addWish({
      categoryName: category.name,
      categoryId: category.id,
      senderName: wishName.trim() ? wishName.trim() : "Anonym",
      wishText: wishDescription.trim()
    });

    setWishSubmitted(true);
    setTimeout(() => {
      setWishName("");
      setWishDescription("");
      setWishSubmitted(false);
      setIsWishesOpen(false);
    }, 1200);
  };

  const getCategoryTopBorderColor = (catId: string) => {
    switch (catId) {
      case "red": return "bg-red-500";
      case "light-blue": return "bg-sky-300";
      case "clear": return "bg-slate-300";
      case "black": return "bg-slate-800";
      case "blue": return "bg-blue-500";
      case "purple": return "bg-purple-500";
      case "green": return "bg-emerald-500";
      default: return "bg-sky-300";
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Title Bar */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {category.name} Kasser
          </h1>

          <div className="flex items-center gap-2">

            {isLoggedIn && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                ⚙️ Admin Dashboard
              </Link>
            )}
            <Link
              href="/"
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-lg shadow-sm transition-colors"
            >
              Tilbage til Forsiden
            </Link>
          </div>
        </div>

        {/* Category Tab Bar Pill Navigation */}
        <div className="bg-slate-100/80 p-1 rounded-xl flex items-center gap-1 overflow-x-auto mb-8 border border-slate-200/60 shadow-inner min-h-[44px]">
          {mounted && categories.map((cat) => {
            const isActive = cat.id === category.id;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* Search Bar + Wishes Button Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder={`Søg ${category.name} kasser...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-9 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm placeholder:text-slate-400"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          <button
            onClick={() => setIsWishesOpen(true)}
            className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-medium text-slate-700 flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <span>⊕ Ønsker</span>
          </button>
        </div>

        {/* Box Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredBoxes.map((box) => {
            return (
              <div
                key={box.id}
                onClick={() => setSelectedBox(box)}
                className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between relative cursor-pointer group h-32"
              >
                <div className={`h-1.5 w-full ${getCategoryTopBorderColor(category.id)}`} />

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 leading-tight group-hover:text-sky-600 transition-colors">
                      {box.name}
                    </h3>
                    <div className="bg-slate-950 text-white font-mono font-bold text-sm sm:text-base px-3 py-1 rounded-lg shadow-sm">
                      {box.number}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-1">{category.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wishes Modal Popup */}
      {isWishesOpen && (
        <div
          onClick={() => setIsWishesOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-900 relative cursor-default"
          >
            <button
              onClick={() => setIsWishesOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Tilføj ønske til {category.name}
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Beskriv hvad du ønsker der skal tilføjes til denne kategori. Dit ønske vil blive sendt til administratorerne.
            </p>

            {wishSubmitted ? (
              <div className="py-8 text-center text-xs font-semibold text-emerald-600">
                ✓ Tak! Dit ønske er sendt.
              </div>
            ) : (
              <form onSubmit={handleSendWish} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700">
                    Dit navn (valgfrit)
                  </label>
                  <input
                    type="text"
                    placeholder="Skriv dit navn her..."
                    value={wishName}
                    onChange={(e) => setWishName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700">
                    Dit ønske
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Beskriv dit ønske her..."
                    value={wishDescription}
                    onChange={(e) => setWishDescription(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none placeholder:text-slate-400 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsWishesOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Annuller
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Send ønske
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Box Detail Modal Popup */}
      {activeBox && (
        <div
          onClick={() => setSelectedBox(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-slate-900 relative cursor-default"
          >
            <button
              onClick={() => setSelectedBox(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between pr-10 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{activeBox.name}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  {category.name} kategori • {(activeBox.items || []).length} genstande
                </p>
              </div>
              <div className="bg-slate-950 text-white font-mono font-bold text-sm px-3 py-1.5 rounded-lg shadow-sm">
                {activeBox.number}
              </div>
            </div>

            {/* Modal Items Grid */}
            <div className="min-h-[140px] mb-6">
              {(!activeBox.items || activeBox.items.length === 0) ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400">
                  Ingen genstande registreret i denne kasse endnu.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeBox.items.map((item) => {
                    const hasProblem = item.hasProblem;
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center border rounded-xl overflow-hidden shadow-sm transition-all group relative ${
                          hasProblem
                            ? "bg-slate-100/70 border-slate-200 opacity-70"
                            : "bg-white border-slate-200 hover:shadow"
                        }`}
                      >
                        <div className="w-16 h-16 bg-slate-100 flex items-center justify-center flex-shrink-0 border-r border-slate-100 overflow-hidden relative">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-300 opacity-40" />
                          )}
                        </div>

                        <div className="p-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4
                              className={`font-semibold text-xs truncate ${
                                hasProblem ? "text-slate-500 line-through" : "text-slate-900"
                              }`}
                            >
                              {item.name}
                            </h4>

                            {/* Grey / Red Error Triangle Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItemProblem(activeBox.id, item.id);
                              }}
                              title={
                                hasProblem
                                  ? "Markér som i orden"
                                  : "Markér som manglende/i stykker"
                              }
                              className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${
                                hasProblem
                                  ? "bg-red-400 text-white shadow-sm hover:bg-red-500"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80"
                              }`}
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {item.description && (
                            <p
                              className={`text-[11px] truncate mt-0.5 ${
                                hasProblem ? "text-slate-400" : "text-slate-400"
                              }`}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
              {isLoggedIn ? (
                <button
                  onClick={() => setIsAddItemOpen(true)}
                  className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tilføj genstand
                </button>
              ) : <div />}

              <button
                onClick={() => setSelectedBox(null)}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 font-semibold rounded-lg text-slate-700 shadow-sm"
              >
                Luk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddItemOpen && activeBox && (
        <div
          onClick={() => setIsAddItemOpen(false)}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-900 cursor-default"
          >
            <h3 className="text-lg font-bold mb-4">Tilføj Genstand til {activeBox.name}</h3>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">Genstandsnavn</label>
                <input
                  type="text"
                  required
                  placeholder="f.eks. Skruetvinger"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">Beskrivelse / Specifikationer</label>
                <input
                  type="text"
                  placeholder="f.eks. 15 cm, metal"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">Antal</label>
                <input
                  type="number"
                  min={1}
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">Billede (Komprimeres til max 300x300 px)</label>
                <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {isCompressing ? (
                    <span className="text-slate-500 animate-pulse">Komprimerer foto (300x300)...</span>
                  ) : newItemImage ? (
                    <div className="flex items-center gap-3 w-full">
                      <img src={newItemImage} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                      <span className="text-emerald-600 font-semibold truncate flex-1">✓ Foto uploadet & komprimeret!</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setNewItemImage("");
                        }}
                        className="text-slate-400 hover:text-red-500 text-xs font-normal underline"
                      >
                        Fjern
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-slate-500" />
                      <span>Vælg eller tag et foto af genstanden</span>
                    </>
                  )}
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
                >
                  Gem Genstand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
