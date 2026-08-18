"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit3, X, FileText, ChevronDown, ChevronUp, Archive, Check, Save, Upload, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, GripVertical, Search } from "lucide-react";
import { useInventory } from "@/lib/InventoryContext";
import { InventoryCategory, InventoryBox } from "@/lib/data";
import { INITIAL_PROBLEMS, INITIAL_WISHES, ProblemReport, UserWish } from "@/lib/adminData";

import { compressImage, compressAndUploadImage } from "@/lib/imageUtils";

type AdminTab = "kategorier" | "admin-kategorier" | "problemer" | "onsker";
type ProblemFilter = "aktive" | "loste";

const COLOR_OPTIONS = [
  { name: "Rød", value: "rød", bg: "bg-red-500", text: "text-white" },
  { name: "Lyseblå", value: "lyseblå", bg: "bg-sky-400", text: "text-slate-900" },
  { name: "Gennemsigtig", value: "gennemsigtig", bg: "bg-slate-200", text: "text-slate-900" },
  { name: "Sort", value: "sort", bg: "bg-slate-900", text: "text-white" },
  { name: "Blå", value: "blå", bg: "bg-blue-600", text: "text-white" },
  { name: "Lilla", value: "lilla", bg: "bg-purple-600", text: "text-white" },
  { name: "Grøn", value: "grøn", bg: "bg-emerald-600", text: "text-white" },
  { name: "Turkis", value: "turkis", bg: "bg-teal-500", text: "text-white" }
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    categories,
    boxes,
    problems,
    wishes,
    logout,
    addItem,
    updateItem,
    deleteItem,
    addBox,
    updateBox,
    deleteBox,
    updateCategory,
    deleteCategory,
    addCategory,
    reorderCategories,
    markProblemSolved,
    reopenProblem,
    deleteProblem,
    deleteWish
  } = useInventory();

  const [activeTab, setActiveTab] = useState<AdminTab>("kategorier");
  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [problemFilter, setProblemFilter] = useState<ProblemFilter>("loste");

  const [selectedWishCat, setSelectedWishCat] = useState<string>("alle");

  // Inline Box Editing State
  const [editingBoxId, setEditingBoxId] = useState<string | null>(null);
  const [editBoxName, setEditBoxName] = useState("");
  const [editBoxNumber, setEditBoxNumber] = useState<number>(1);

  // Inline Item Editing State (Matching Screenshot)
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState("");
  const [editItemDesc, setEditItemDesc] = useState("");
  const [editItemImage, setEditItemImage] = useState<string>("");
  const [isCompressingEdit, setIsCompressingEdit] = useState<boolean>(false);

  // Archive unfold state
  const [isArchiveUnfolded, setIsArchiveUnfolded] = useState(false);

  // Add Category Modal State
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("rød");

  // Category Edit Modal State
  const [editingCategory, setEditingCategory] = useState<InventoryCategory | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatColor, setEditCatColor] = useState("rød");

  // Category Delete Confirmation Modal State
  const [deletingCategory, setDeletingCategory] = useState<InventoryCategory | null>(null);

  // Box Delete Confirmation Modal State
  const [deletingBox, setDeletingBox] = useState<InventoryBox | null>(null);

  // Item Delete Confirmation Modal State
  const [deletingItemTarget, setDeletingItemTarget] = useState<{ boxId: string; itemId: string; itemName: string } | null>(null);

  // Problem Delete Confirmation Modal State
  const [deletingProblem, setDeletingProblem] = useState<ProblemReport | null>(null);

  // Wish Delete Confirmation Modal State
  const [deletingWish, setDeletingWish] = useState<UserWish | null>(null);

  // Form modals state
  const [isAddBoxOpen, setIsAddBoxOpen] = useState(false);
  const [newBoxName, setNewBoxName] = useState("");
  const [newBoxNumber, setNewBoxNumber] = useState(1);

  const [addingToBoxId, setAddingToBoxId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemImage, setNewItemImage] = useState<string>("");
  const [isCompressingNew, setIsCompressingNew] = useState<boolean>(false);

  // Global Escape key listener to close popups
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (deletingProblem) setDeletingProblem(null);
        else if (deletingCategory) setDeletingCategory(null);
        else if (editingCategory) setEditingCategory(null);
        else if (isAddCategoryOpen) setIsAddCategoryOpen(false);
        else if (addingToBoxId) setAddingToBoxId(null);
        else if (isAddBoxOpen) setIsAddBoxOpen(false);
        else if (editingBoxId) setEditingBoxId(null);
        else if (editingItemId) setEditingItemId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    deletingProblem,
    deletingCategory,
    editingCategory,
    isAddCategoryOpen,
    addingToBoxId,
    isAddBoxOpen,
    editingBoxId,
    editingItemId
  ]);

  const currentCatId = selectedCatId || (categories[0]?.id ?? "");
  const activeCategory = categories.find((c) => c.id === currentCatId) || categories[0];
  const activeBoxes = boxes
    .filter((b) => b.categoryId === currentCatId)
    .filter((b) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchBoxName = b.name.toLowerCase().includes(q);
      const matchBoxNum = b.number.toString().includes(q);
      const matchItem = (b.items || []).some(
        (item) => item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q))
      );
      return matchBoxName || matchBoxNum || matchItem;
    })
    .sort((a, b) => a.number - b.number);
  const activeProblemsCount = problems.filter((p) => !p.isSolved).length;

  const handleStartEditingBox = (box: InventoryBox) => {
    setEditingBoxId(box.id);
    setEditBoxName(box.name);
    setEditBoxNumber(box.number);
  };

  const handleSaveBoxInline = (boxId: string) => {
    updateBox(boxId, editBoxName, Number(editBoxNumber));
    setEditingBoxId(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const chosenColor = COLOR_OPTIONS.find((c) => c.value === newCatColor) || COLOR_OPTIONS[0];
    const slugId = newCatName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now();

    addCategory({
      id: slugId,
      name: newCatName,
      color: newCatColor,
      boxCount: 0,
      bgColor: chosenColor.bg,
      textColor: chosenColor.text
    });

    setNewCatName("");
    setNewCatColor("rød");
    setIsAddCategoryOpen(false);
  };

  const handleOpenEditCategory = (cat: InventoryCategory) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatColor(cat.color);
  };

  const handleSaveEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCatName.trim()) return;

    const chosenColor = COLOR_OPTIONS.find((c) => c.value === editCatColor) || COLOR_OPTIONS[0];

    updateCategory(editingCategory.id, {
      name: editCatName,
      color: editCatColor,
      bgColor: chosenColor.bg,
      textColor: chosenColor.text
    });

    setEditingCategory(null);
  };

  const handleConfirmDeleteCategory = () => {
    if (!deletingCategory) return;
    deleteCategory(deletingCategory.id);
    setDeletingCategory(null);
  };

  const handleOpenAddBox = () => {
    // Calculate the next highest box number in the selected category
    const catBoxes = boxes.filter((b) => b.categoryId === selectedCatId);
    const maxNum = catBoxes.reduce((max, b) => (b.number > max ? b.number : max), 0);
    setNewBoxNumber(maxNum + 1);
    setNewBoxName("");
    setIsAddBoxOpen(true);
  };

  const handleAddBoxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoxName.trim()) return;
    addBox({
      name: newBoxName,
      number: Number(newBoxNumber),
      categoryId: selectedCatId,
      items: []
    });
    setNewBoxName("");
    setIsAddBoxOpen(false);
  };

  const handleEditImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressingEdit(true);
      const downloadUrl = await compressAndUploadImage(file);
      setEditItemImage(downloadUrl);
    } catch (err) {
      console.error("Fejl ved komprimering og upload af billede", err);
    } finally {
      setIsCompressingEdit(false);
    }
  };

  const handleNewImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressingNew(true);
      const downloadUrl = await compressAndUploadImage(file);
      setNewItemImage(downloadUrl);
    } catch (err) {
      console.error("Fejl ved komprimering og upload af billede", err);
    } finally {
      setIsCompressingNew(false);
    }
  };

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingToBoxId || !newItemName.trim()) return;
    addItem(addingToBoxId, {
      name: newItemName,
      description: newItemDesc,
      image: newItemImage || undefined
    });
    setNewItemName("");
    setNewItemDesc("");
    setNewItemImage("");
    setAddingToBoxId(null);
  };

  const getCategoryHeaderBg = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      return `${cat.bgColor} ${cat.textColor}`;
    }
    switch (catId) {
      case "red": return "bg-red-500 text-white";
      case "light-blue": return "bg-sky-400 text-slate-900";
      case "clear": return "bg-slate-200 text-slate-900";
      case "black": return "bg-slate-900 text-white";
      case "blue": return "bg-blue-600 text-white";
      case "purple": return "bg-purple-600 text-white";
      case "green": return "bg-emerald-600 text-white";
      default: return "bg-emerald-500 text-white";
    }
  };

  const currentNewColorOption = COLOR_OPTIONS.find((c) => c.value === newCatColor) || COLOR_OPTIONS[0];
  const currentEditColorOption = COLOR_OPTIONS.find((c) => c.value === editCatColor) || COLOR_OPTIONS[0];

  const isMoreThanOneMonthOld = (solvedAtDateStr?: string) => {
    if (!solvedAtDateStr) return false;
    const solvedDate = new Date(solvedAtDateStr);
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    return Date.now() - solvedDate.getTime() > thirtyDaysInMs;
  };

  const solvedProblems = problems.filter((p) => p.isSolved);
  const recentSolvedProblems = solvedProblems.filter((p) => !isMoreThanOneMonthOld(p.solvedAt));
  const archivedSolvedProblems = solvedProblems.filter((p) => isMoreThanOneMonthOld(p.solvedAt));

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-lg shadow-sm transition-colors"
            >
              Se Hjemmeside
            </Link>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Log ud
            </button>
          </div>
        </div>

        {/* Main Admin Tab Bar */}
        <div className="bg-slate-100/90 p-1 rounded-xl flex items-center gap-1 overflow-x-auto mb-6 border border-slate-200/60 shadow-inner">
          <button
            onClick={() => setActiveTab("kategorier")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "kategorier"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Kategorier
          </button>
          <button
            onClick={() => setActiveTab("admin-kategorier")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "admin-kategorier"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Administrer Kategorier
          </button>
          <button
            onClick={() => setActiveTab("problemer")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all relative flex items-center gap-1.5 ${
              activeTab === "problemer"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Problemer</span>
            {activeProblemsCount > 0 && (
              <span className="w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeProblemsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("onsker")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "onsker"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Ønsker
          </button>
        </div>

        {/* TAB 1: KATEGORIER */}
        {activeTab === "kategorier" && (
          <div className="space-y-6">
            <div className="bg-slate-100/60 p-1 rounded-xl flex items-center gap-1 overflow-x-auto border border-slate-200/50 min-h-[44px]">
              {mounted && categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    currentCatId === cat.id
                      ? "bg-white text-slate-900 font-bold shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder={`Søg ${activeCategory?.name || ""} kasser og genstande...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-4 pr-12 text-xs font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-950 hover:bg-slate-800 text-white rounded-xl shadow transition-colors"
                title="Søg"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Box Jump Pills Bar */}
            {activeBoxes.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap pr-1">
                  Hurtighop til kasse:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activeBoxes.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        const el = document.getElementById(`admin-box-${b.id}`);
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                      className="w-7 h-7 rounded-lg bg-black hover:bg-slate-800 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95"
                      title={`Hop til Kasse #${b.number} (${b.name})`}
                    >
                      {b.number}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <h2 className="text-2xl font-bold text-slate-900">
                {activeCategory?.name} Kasser
              </h2>
              <button
                onClick={handleOpenAddBox}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                Tilføj Ny Kasse
              </button>
            </div>

            <div className="space-y-6">
              {activeBoxes.map((box) => {
                const items = box.items || [];
                const isEditingThisBox = editingBoxId === box.id;

                return (
                  <div
                    key={box.id}
                    id={`admin-box-${box.id}`}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden scroll-mt-6"
                  >
                    {/* Header: Toggle inline edit mode vs static view */}
                    {isEditingThisBox ? (
                      /* Inline Edit Mode Bar */
                      <div className={`p-4 ${getCategoryHeaderBg(currentCatId)} flex flex-wrap items-center justify-between gap-4`}>
                        <div className="flex-1 min-w-[200px]">
                          <label className="block text-[11px] font-semibold mb-1 opacity-90">Navn</label>
                          <input
                            type="text"
                            value={editBoxName}
                            onChange={(e) => setEditBoxName(e.target.value)}
                            className="w-full bg-white text-slate-900 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-inner"
                          />
                        </div>

                        <div className="w-24">
                          <label className="block text-[11px] font-semibold mb-1 opacity-90">Nummer</label>
                          <input
                            type="number"
                            value={editBoxNumber}
                            onChange={(e) => setEditBoxNumber(Number(e.target.value))}
                            className="w-full bg-white text-slate-900 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-inner text-center"
                          />
                        </div>

                        <div className="flex items-end gap-2 pt-5">
                          <button
                            onClick={() => handleSaveBoxInline(box.id)}
                            className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md"
                          >
                            <Save className="w-3.5 h-3.5" />
                            Gem
                          </button>
                          <div className="bg-black text-white font-mono font-bold text-xs px-2.5 py-2 rounded-md shadow-sm ml-2">
                            {editBoxNumber}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Normal Bar */
                      <div className={`p-4 flex items-center justify-between ${getCategoryHeaderBg(currentCatId)}`}>
                        <h3 className="font-extrabold text-lg sm:text-xl">{box.name}</h3>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleStartEditingBox(box)}
                            className="hover:opacity-80 p-1"
                            title="Rediger kasse"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingBox(box)}
                            className="hover:opacity-80 p-1"
                            title="Slet kasse"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="bg-slate-950 text-white font-mono font-bold text-sm sm:text-base px-3 py-1 rounded-lg shadow-sm">
                            {box.number}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-xs text-slate-900">
                          Genstande ({items.length})
                        </h4>
                        <button
                          onClick={() => setAddingToBoxId(box.id)}
                          className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Tilføj Genstand
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((item) => {
                          const isEditingThisItem = editingItemId === item.id;

                          if (isEditingThisItem) {
                            return (
                              <div
                                key={item.id}
                                className="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-3"
                              >
                                <div className="flex items-start gap-3">
                                  {/* Item Image preview container */}
                                  <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-200 overflow-hidden relative group">
                                    {editItemImage && editItemImage !== "REMOVE" ? (
                                      <>
                                        <img src={editItemImage} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                          type="button"
                                          onClick={() => setEditItemImage("REMOVE")}
                                          className="absolute inset-0 bg-red-600/85 text-white font-bold text-[11px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                          title="Fjern foto"
                                        >
                                          Fjern Foto
                                        </button>
                                      </>
                                    ) : (
                                      <div className="text-[10px] text-slate-400 font-semibold text-center p-1">
                                        Intet foto
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex-1 space-y-2">
                                    {/* Name Input */}
                                    <input
                                      type="text"
                                      value={editItemName}
                                      onChange={(e) => setEditItemName(e.target.value)}
                                      placeholder="Genstandens navn"
                                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-inner"
                                    />

                                    {/* Description Input */}
                                    <textarea
                                      rows={2}
                                      value={editItemDesc}
                                      onChange={(e) => setEditItemDesc(e.target.value)}
                                      placeholder="Beskrivelse af genstand"
                                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-inner resize-none"
                                    />
                                  </div>

                                  {/* Upload Image Button with hidden file input */}
                                  <label className="p-2.5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors shadow-sm self-center cursor-pointer relative" title="Upload foto (300x300)">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleEditImageFileChange}
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    {isCompressingEdit ? (
                                      <span className="text-[10px] font-bold animate-pulse text-sky-600">...</span>
                                    ) : (
                                      <Upload className="w-4 h-4" />
                                    )}
                                  </label>
                                </div>

                                {/* Form Action Buttons matching screenshot: Red Annuller + Dark Gem */}
                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => setEditingItemId(null)}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                                  >
                                    Annuller
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const finalImage = editItemImage === "REMOVE" ? "" : (editItemImage || item.image || "");
                                      updateItem(box.id, item.id, {
                                        name: editItemName,
                                        description: editItemDesc,
                                        image: finalImage
                                      });
                                      setEditingItemId(null);
                                    }}
                                    className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                    Gem
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={item.id}
                              className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-slate-300 transition-colors"
                            >
                              <div className="w-20 h-20 bg-slate-100 flex items-center justify-center flex-shrink-0 border-r border-slate-100 overflow-hidden relative">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                                )}
                              </div>
                              <div className="p-3.5 flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-1">
                                  <h5 className="font-bold text-xs text-slate-900">{item.name}</h5>
                                  <div className="flex items-center gap-1 text-slate-400">
                                    <button
                                      onClick={() => {
                                        setEditingItemId(item.id);
                                        setEditItemName(item.name);
                                        setEditItemDesc(item.description || "");
                                        setEditItemImage(item.image || "");
                                      }}
                                      className="hover:text-slate-700 p-1"
                                      title="Rediger genstand"
                                    >
                                      <Edit3 className="w-3 h-3 text-slate-400" />
                                    </button>
                                    <button
                                      onClick={() => setDeletingItemTarget({ boxId: box.id, itemId: item.id, itemName: item.name })}
                                      className="hover:text-red-500 p-1"
                                      title="Slet genstand"
                                    >
                                      <Trash2 className="w-3 h-3 text-red-500" />
                                    </button>
                                  </div>
                                </div>
                                {item.description && (
                                  <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ADMINISTRER KATEGORIER */}
        {activeTab === "admin-kategorier" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Administrer Kategorier
              </h2>
              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                Tilføj Ny Kategori
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, index) => (
                <div
                  key={cat.id}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Category Header with color, title, edit and delete icons */}
                  <div className={`p-4 ${getCategoryHeaderBg(cat.id)} flex items-center justify-between`}>
                    <h3 className="font-bold text-lg">{cat.name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        className="hover:opacity-80 p-1 transition-opacity text-current"
                        title="Rediger kategori"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingCategory(cat)}
                        className="hover:opacity-80 p-1 transition-opacity text-current"
                        title="Slet kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Body matching Box card layout */}
                  <div className="p-5 flex items-center justify-between text-xs text-slate-700 font-medium">
                    <div className="space-y-1">
                      <p>
                        <span className="font-bold">Farve:</span> <span className="capitalize">{cat.color}</span>
                      </p>
                      <p>
                        <span className="font-bold">Antal kasser:</span> {cat.boxCount}
                      </p>
                    </div>

                    {/* Position Dropdown Selector styled like box badge */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 shadow-inner">
                      <span className="text-[10px] font-bold text-slate-400 pl-1 uppercase tracking-wider">
                        Rækkefølge
                      </span>
                      <select
                        value={index}
                        onChange={(e) => reorderCategories(index, Number(e.target.value))}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-mono font-bold text-xs px-2.5 py-1 rounded-lg cursor-pointer focus:outline-none transition-colors border border-slate-300/80"
                        title="Skift kategori rækkefølge"
                      >
                        {categories.map((_, idx) => (
                          <option key={idx} value={idx}>
                            #{idx + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROBLEMER */}
        {activeTab === "problemer" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Problemer med genstande
              </h2>
              <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
                <button
                  onClick={() => setProblemFilter("aktive")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    problemFilter === "aktive"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>⚠️ Aktive</span>
                </button>
                <button
                  onClick={() => setProblemFilter("loste")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    problemFilter === "loste"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>✓ Løste</span>
                </button>
              </div>
            </div>

            {problemFilter === "aktive" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {problems
                  .filter((p) => !p.isSolved)
                  .map((prob) => (
                    <div
                      key={prob.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div className={`p-4 ${getCategoryHeaderBg(prob.categoryId)} flex items-center justify-between`}>
                        <h3 className="font-bold text-lg">{prob.itemName}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDeletingProblem(prob)}
                            className="hover:opacity-80 p-1"
                            title="Slet problem"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-white" />
                          </button>
                          <div className="bg-black text-white font-mono font-bold text-sm px-3 py-1 rounded-md">
                            {prob.boxNumber}
                          </div>
                        </div>
                      </div>
                      <div className="p-5 space-y-1.5 text-xs text-slate-700">
                        <p><span className="font-bold">Kasse:</span> {prob.boxName}</p>
                        <p><span className="font-bold">Kategori:</span> {prob.categoryName}</p>
                        <p><span className="font-bold">Rapporteret:</span> {prob.reportedAt}</p>
                        
                        <div className="pt-4">
                          <button
                            onClick={() => markProblemSolved(prob.id)}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                          >
                            Markér som løst
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {problemFilter === "loste" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentSolvedProblems.map((prob) => (
                    <div
                      key={prob.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div className={`p-4 ${getCategoryHeaderBg(prob.categoryId)} flex items-center justify-between`}>
                        <h3 className="font-bold text-lg">{prob.itemName}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDeletingProblem(prob)}
                            className="hover:opacity-80 p-1"
                            title="Slet problem"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-white" />
                          </button>
                          <div className="bg-black text-white font-mono font-bold text-sm px-3 py-1 rounded-md">
                            {prob.boxNumber}
                          </div>
                        </div>
                      </div>
                      <div className="p-5 space-y-1.5 text-xs text-slate-700">
                        <p><span className="font-bold">Kasse:</span> {prob.boxName}</p>
                        <p><span className="font-bold">Kategori:</span> {prob.categoryName}</p>
                        <p><span className="font-bold">Rapporteret:</span> {prob.reportedAt}</p>
                        
                        <div className="pt-4">
                          <button
                            onClick={() => reopenProblem(prob.id)}
                            className="w-full py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium rounded-xl shadow-sm transition-colors"
                          >
                            Genåbn problem
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {archivedSolvedProblems.length > 0 && (
                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setIsArchiveUnfolded(!isArchiveUnfolded)}
                      className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-4 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <Archive className="w-4 h-4 text-slate-500" />
                      <span>Arkiverede løste problemer (ældre end 1 måned) ({archivedSolvedProblems.length})</span>
                      {isArchiveUnfolded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isArchiveUnfolded && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {archivedSolvedProblems.map((prob) => (
                          <div
                            key={prob.id}
                            className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity"
                          >
                            <div className={`p-4 ${getCategoryHeaderBg(prob.categoryId)} flex items-center justify-between`}>
                              <h3 className="font-bold text-lg">{prob.itemName}</h3>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setDeletingProblem(prob)}
                                  className="hover:opacity-80 p-1"
                                  title="Slet problem"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-white" />
                                </button>
                                <div className="bg-black text-white font-mono font-bold text-sm px-3 py-1 rounded-md">
                                  {prob.boxNumber}
                                </div>
                              </div>
                            </div>
                            <div className="p-5 space-y-1.5 text-xs text-slate-700">
                              <p><span className="font-bold">Kasse:</span> {prob.boxName}</p>
                              <p><span className="font-bold">Kategori:</span> {prob.categoryName}</p>
                              <p><span className="font-bold">Rapporteret:</span> {prob.reportedAt}</p>
                              
                              <div className="pt-4">
                                <button
                                  onClick={() => reopenProblem(prob.id)}
                                  className="w-full py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium rounded-xl shadow-sm transition-colors"
                                >
                                  Genåbn problem
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ØNSKER */}
        {activeTab === "onsker" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Ønsker fra brugere
              </h2>
              <select
                value={selectedWishCat}
                onChange={(e) => setSelectedWishCat(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="alle">Alle kategorier</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wishes
                .filter((w) => selectedWishCat === "alle" || w.categoryId === selectedWishCat)
                .map((wish) => (
                  <div
                    key={wish.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div className={`p-4 ${getCategoryHeaderBg(wish.categoryId)}`}>
                      <h3 className="font-bold text-lg">{wish.categoryName}</h3>
                    </div>
                    <div className="p-5 space-y-3 text-xs text-slate-800">
                      <p className="font-semibold text-slate-700">Fra: {wish.senderName}</p>
                      <p className="text-slate-600 leading-relaxed font-normal">{wish.wishText}</p>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{wish.createdAt}</span>
                        <button
                          onClick={() => setDeletingWish(wish)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Slet ønske"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* ADD CATEGORY MODAL */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-900 relative">
            <button
              onClick={() => setIsAddCategoryOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Tilføj Ny Kategori
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Opret en ny kategori til værkstedets inventarsystem.
            </p>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">
                  Kategorinavn
                </label>
                <input
                  type="text"
                  required
                  placeholder="F.eks. Elektronik, Værktøj, etc."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-white border border-slate-900 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">
                  Farve
                </label>
                <select
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-700">
                  Forhåndsvisning
                </label>
                <div className={`p-3.5 rounded-xl font-bold text-sm shadow-sm ${currentNewColorOption.bg} ${currentNewColorOption.text}`}>
                  {newCatName || "Kategorinavn"}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Tilføj Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-900 relative">
            <button
              onClick={() => setEditingCategory(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Rediger Kategori
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Opdater detaljer for kategorien.
            </p>

            <form onSubmit={handleSaveEditCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">
                  Kategorinavn
                </label>
                <input
                  type="text"
                  required
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  className="w-full bg-white border border-slate-900 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">
                  Farve
                </label>
                <select
                  value={editCatColor}
                  onChange={(e) => setEditCatColor(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-700">
                  Forhåndsvisning
                </label>
                <div className={`p-3.5 rounded-xl font-bold text-sm shadow-sm ${currentEditColorOption.bg} ${currentEditColorOption.text}`}>
                  {editCatName || "Kategori Navn"}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Gem Ændringer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CATEGORY CONFIRMATION MODAL */}
      {deletingCategory && (
        <div
          onClick={() => setDeletingCategory(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-900 relative cursor-default"
          >
            <button
              onClick={() => setDeletingCategory(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Er du sikker på at du vil slette?
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Er du sikker på, at du vil slette kategorien <strong className="text-slate-800">"{deletingCategory.name}"</strong>? Alle kasser og genstande i denne kategori vil også blive slettet.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Annuller
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Slet Kategori
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE BOX CONFIRMATION MODAL */}
      {deletingBox && (
        <div
          onClick={() => setDeletingBox(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-900 relative cursor-default"
          >
            <button
              onClick={() => setDeletingBox(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Er du sikker på at du vil slette?
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Er du sikker på, at du vil slette kasse <strong className="text-slate-800">#{deletingBox.number} ("{deletingBox.name}")</strong>?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingBox(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Annuller
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteBox(deletingBox.id);
                  setDeletingBox(null);
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Slet Kasse
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ITEM CONFIRMATION MODAL */}
      {deletingItemTarget && (
        <div
          onClick={() => setDeletingItemTarget(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-900 relative cursor-default"
          >
            <button
              onClick={() => setDeletingItemTarget(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Er du sikker på at du vil slette?
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Er du sikker på, at du vil slette genstanden <strong className="text-slate-800">"{deletingItemTarget.itemName}"</strong>?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItemTarget(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Annuller
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteItem(deletingItemTarget.boxId, deletingItemTarget.itemId);
                  setDeletingItemTarget(null);
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Slet Genstand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE PROBLEM CONFIRMATION MODAL */}
      {deletingProblem && (
        <div
          onClick={() => setDeletingProblem(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-900 relative cursor-default"
          >
            <button
              onClick={() => setDeletingProblem(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Er du sikker på at du vil slette?
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Er du sikker på, at du vil slette problemrapporten for <strong className="text-slate-800">"{deletingProblem.itemName}"</strong>?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProblem(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Annuller
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProblem(deletingProblem.id);
                  setDeletingProblem(null);
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Slet Problem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE WISH CONFIRMATION MODAL */}
      {deletingWish && (
        <div
          onClick={() => setDeletingWish(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-900 relative cursor-default"
          >
            <button
              onClick={() => setDeletingWish(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Er du sikker på at du vil slette?
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Er du sikker på, at du vil slette ønske fra <strong className="text-slate-800">"{deletingWish.senderName}"</strong> ({deletingWish.wishText})?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingWish(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Annuller
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteWish(deletingWish.id);
                  setDeletingWish(null);
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Slet Ønske
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Box Modal */}
      {isAddBoxOpen && (
        <div
          onClick={() => setIsAddBoxOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-900 cursor-default"
          >
            <h3 className="text-lg font-bold mb-4">Tilføj Ny Kasse til {activeCategory?.name}</h3>
            <form onSubmit={handleAddBoxSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">Kasse Navn</label>
                <input
                  type="text"
                  required
                  placeholder="f.eks. Loddeværktøj"
                  value={newBoxName}
                  onChange={(e) => setNewBoxName(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">Kassenummer</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newBoxNumber}
                  onChange={(e) => setNewBoxNumber(Number(e.target.value))}
                  className="w-full border rounded-lg p-2.5 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddBoxOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-xs font-semibold rounded-lg"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
                >
                  Gem Kasse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {addingToBoxId && (
        <div
          onClick={() => setAddingToBoxId(null)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-900 cursor-default"
          >
            <h3 className="text-lg font-bold mb-4">Tilføj Ny Genstand</h3>
            <form onSubmit={handleAddItemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">Navn</label>
                <input
                  type="text"
                  required
                  placeholder="f.eks. Loddekolbe 60W"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">Beskrivelse</label>
                <input
                  type="text"
                  placeholder="60W justerbar temperatur"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">Billede (Komprimeres til max 300x300 px)</label>
                <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewImageFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {isCompressingNew ? (
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
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setAddingToBoxId(null)}
                  className="px-4 py-2 bg-slate-100 text-xs font-semibold rounded-lg"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
                >
                  Gem Genstand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* FLOATING CIRCULAR BACK TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-slate-700/50"
          title="Tilbage til toppen"
          aria-label="Tilbage til toppen"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
