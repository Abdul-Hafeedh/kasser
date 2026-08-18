"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { InventoryCategory, InventoryBox, InventoryItem, INITIAL_CATEGORIES, INITIAL_BOXES } from "./data";
import { ProblemReport, INITIAL_PROBLEMS, UserWish, INITIAL_WISHES } from "./adminData";
import * as fs from "./firestore";

interface InventoryContextType {
  categories: InventoryCategory[];
  boxes: InventoryBox[];
  problems: ProblemReport[];
  wishes: UserWish[];
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  addItem: (boxId: string, item: Omit<InventoryItem, "id">) => void;
  updateItem: (boxId: string, itemId: string, updated: Partial<InventoryItem>) => void;
  deleteItem: (boxId: string, itemId: string) => void;
  toggleItemProblem: (boxId: string, itemId: string) => void;
  addBox: (box: Omit<InventoryBox, "id">) => void;
  updateBox: (boxId: string, name: string, number?: number, description?: string) => void;
  deleteBox: (boxId: string) => void;
  addCategory: (category: InventoryCategory) => void;
  updateCategory: (id: string, updated: Partial<InventoryCategory>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (startIndex: number, endIndex: number) => void;
  markProblemSolved: (id: string) => void;
  reopenProblem: (id: string) => void;
  deleteProblem: (id: string) => void;
  deleteWish: (id: string) => void;
  addWish: (wish: Omit<UserWish, "id" | "createdAt">) => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  resetToDefault: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const LOGIN_KEY = "vaerkstedets_is_logged_in";

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with INITIAL data so SSR renders something meaningful
  const [categories, setCategories] = useState<InventoryCategory[]>(INITIAL_CATEGORIES);
  const [boxes, setBoxes] = useState<InventoryBox[]>(INITIAL_BOXES);
  const [problems, setProblems] = useState<ProblemReport[]>(INITIAL_PROBLEMS);
  const [wishes, setWishes] = useState<UserWish[]>(INITIAL_WISHES);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from Firestore on mount
  useEffect(() => {
    async function init() {
      try {
        // Load login state from localStorage (login is per-browser)
        if (typeof window !== "undefined") {
          const savedLogin = localStorage.getItem(LOGIN_KEY);
          if (savedLogin === "true") {
            setIsLoggedIn(true);
          }
        }

        const data = await fs.loadAllData();

        if (data) {
          // Firestore has data — use it
          setCategories(data.categories);
          setBoxes(data.boxes);
          setProblems(data.problems);
          setWishes(data.wishes);
        } else {
          // First time: seed Firestore with initial data
          await fs.seedInitialData(INITIAL_CATEGORIES, INITIAL_BOXES, INITIAL_PROBLEMS, INITIAL_WISHES);
          // State already has INITIAL values, no need to update
        }
      } catch (e) {
        console.error("Error loading data from Firestore:", e);
        // Fallback: keep INITIAL data in state
      } finally {
        setIsLoaded(true);
      }
    }
    init();
  }, []);

  // Helper: persist a box to Firestore after local state update
  const persistBox = useCallback((boxId: string, updatedBoxes: InventoryBox[]) => {
    const box = updatedBoxes.find((b) => b.id === boxId);
    if (box) fs.saveBox(box).catch(console.error);
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    if (typeof window !== "undefined") localStorage.setItem(LOGIN_KEY, "true");
  };

  const logout = () => {
    setIsLoggedIn(false);
    if (typeof window !== "undefined") localStorage.setItem(LOGIN_KEY, "false");
  };

  const addItem = (boxId: string, item: Omit<InventoryItem, "id">) => {
    const newItem: InventoryItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setBoxes((prev) => {
      const updated = prev.map((box) => {
        if (box.id === boxId) {
          return { ...box, items: [...(box.items || []), newItem] };
        }
        return box;
      });
      persistBox(boxId, updated);
      return updated;
    });
  };

  const updateItem = (boxId: string, itemId: string, updatedFields: Partial<InventoryItem>) => {
    setBoxes((prev) => {
      const updated = prev.map((box) => {
        if (box.id === boxId && box.items) {
          return {
            ...box,
            items: box.items.map((item) => (item.id === itemId ? { ...item, ...updatedFields } : item))
          };
        }
        return box;
      });
      persistBox(boxId, updated);
      return updated;
    });
  };

  const deleteItem = (boxId: string, itemId: string) => {
    setBoxes((prev) => {
      const updated = prev.map((box) => {
        if (box.id === boxId && box.items) {
          return { ...box, items: box.items.filter((item) => item.id !== itemId) };
        }
        return box;
      });
      persistBox(boxId, updated);
      return updated;
    });
  };

  const toggleItemProblem = (boxId: string, itemId: string) => {
    const targetBox = boxes.find((b) => b.id === boxId);
    if (!targetBox || !targetBox.items) return;

    const targetItem = targetBox.items.find((i) => i.id === itemId);
    if (!targetItem) return;

    const newHasProblem = !targetItem.hasProblem;

    // 1. Toggle hasProblem on item
    setBoxes((prev) => {
      const updated = prev.map((box) => {
        if (box.id === boxId && box.items) {
          return {
            ...box,
            items: box.items.map((item) =>
              item.id === itemId ? { ...item, hasProblem: newHasProblem } : item
            )
          };
        }
        return box;
      });
      persistBox(boxId, updated);
      return updated;
    });

    // 2. Add or solve problem
    const targetCategory = categories.find((c) => c.id === targetBox.categoryId);
    const categoryName = targetCategory ? targetCategory.name : "Værksted";
    const categoryId = targetCategory ? targetCategory.id : "black";

    if (newHasProblem) {
      const now = new Date();
      const formattedDate = `${now.getDate().toString().padStart(2, "0")}.${(
        now.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}.${now.getFullYear()}, ${now
        .getHours()
        .toString()
        .padStart(2, "0")}.${now.getMinutes().toString().padStart(2, "0")}`;

      const newReport: ProblemReport = {
        id: `prob-${Date.now()}`,
        itemName: targetItem.name,
        boxName: targetBox.name,
        boxNumber: targetBox.number,
        categoryName: categoryName,
        categoryId: categoryId,
        reportedAt: formattedDate,
        isSolved: false
      };

      setProblems((prev) => [newReport, ...prev]);
      fs.saveProblem(newReport).catch(console.error);
    } else {
      setProblems((prev) => {
        const updated = prev.map((p) =>
          p.itemName === targetItem.name && !p.isSolved
            ? { ...p, isSolved: true, solvedAt: new Date().toISOString() }
            : p
        );
        // Persist each updated problem
        updated.filter((p) => p.itemName === targetItem.name && p.isSolved).forEach((p) => {
          fs.saveProblem(p).catch(console.error);
        });
        return updated;
      });
    }
  };

  const addBox = (newBoxData: Omit<InventoryBox, "id">) => {
    const newBox: InventoryBox = {
      ...newBoxData,
      id: `${newBoxData.categoryId}-${Date.now()}`
    };

    setBoxes((prev) => [...prev, newBox]);
    fs.saveBox(newBox).catch(console.error);

    setCategories((prev) => {
      const updated = prev.map((cat) =>
        cat.id === newBoxData.categoryId ? { ...cat, boxCount: cat.boxCount + 1 } : cat
      );
      const changedCat = updated.find((c) => c.id === newBoxData.categoryId);
      if (changedCat) fs.saveCategory(changedCat).catch(console.error);
      return updated;
    });
  };

  const updateBox = (boxId: string, name: string, number?: number, description?: string) => {
    setBoxes((prev) => {
      const updated = prev.map((box) => {
        if (box.id === boxId) {
          return {
            ...box,
            name,
            number: number !== undefined ? number : box.number,
            description
          };
        }
        return box;
      });
      persistBox(boxId, updated);
      return updated;
    });
  };

  const deleteBox = (boxId: string) => {
    const targetBox = boxes.find((b) => b.id === boxId);
    if (!targetBox) return;

    setBoxes((prev) => prev.filter((b) => b.id !== boxId));
    fs.removeBox(boxId).catch(console.error);

    setCategories((prev) => {
      const updated = prev.map((cat) =>
        cat.id === targetBox.categoryId ? { ...cat, boxCount: Math.max(0, cat.boxCount - 1) } : cat
      );
      const changedCat = updated.find((c) => c.id === targetBox.categoryId);
      if (changedCat) fs.saveCategory(changedCat).catch(console.error);
      return updated;
    });
  };

  const addCategory = (category: InventoryCategory) => {
    setCategories((prev) => [...prev, category]);
    fs.saveCategory(category).catch(console.error);
  };

  const updateCategory = (id: string, updated: Partial<InventoryCategory>) => {
    setCategories((prev) => {
      const newCats = prev.map((cat) => (cat.id === id ? { ...cat, ...updated } : cat));
      const changedCat = newCats.find((c) => c.id === id);
      if (changedCat) fs.saveCategory(changedCat).catch(console.error);
      return newCats;
    });
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    fs.removeCategory(id).catch(console.error);

    // Also delete associated boxes
    const associatedBoxes = boxes.filter((b) => b.categoryId === id);
    setBoxes((prev) => prev.filter((b) => b.categoryId !== id));
    fs.removeBoxesByCategoryId(id, associatedBoxes).catch(console.error);
  };

  const reorderCategories = (startIndex: number, endIndex: number) => {
    setCategories((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      // Persist all categories to maintain order
      fs.saveCategoriesBatch(result).catch(console.error);
      return result;
    });
  };

  const markProblemSolved = (id: string) => {
    setProblems((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, isSolved: true, solvedAt: new Date().toISOString() } : p
      );
      const changedProb = updated.find((p) => p.id === id);
      if (changedProb) fs.saveProblem(changedProb).catch(console.error);
      return updated;
    });
  };

  const reopenProblem = (id: string) => {
    setProblems((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, isSolved: false, solvedAt: undefined } : p
      );
      const changedProb = updated.find((p) => p.id === id);
      if (changedProb) fs.saveProblem(changedProb).catch(console.error);
      return updated;
    });
  };

  const deleteProblem = (id: string) => {
    setProblems((prev) => prev.filter((p) => p.id !== id));
    fs.removeProblem(id).catch(console.error);
  };

  const deleteWish = (id: string) => {
    setWishes((prev) => prev.filter((w) => w.id !== id));
    fs.removeWish(id).catch(console.error);
  };

  const addWish = (wishData: Omit<UserWish, "id" | "createdAt">) => {
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")}.${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${now.getFullYear()}, ${now
      .getHours()
      .toString()
      .padStart(2, "0")}.${now.getMinutes().toString().padStart(2, "0")}`;

    const newWish: UserWish = {
      ...wishData,
      id: `wish-${Date.now()}`,
      createdAt: formattedDate
    };

    setWishes((prev) => [newWish, ...prev]);
    fs.saveWish(newWish).catch(console.error);
  };

  const exportData = () => {
    return JSON.stringify({ categories, boxes, problems, wishes }, null, 2);
  };

  const importData = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.categories) && Array.isArray(parsed.boxes)) {
        setCategories(parsed.categories);
        setBoxes(parsed.boxes);
        if (parsed.problems) setProblems(parsed.problems);
        if (parsed.wishes) setWishes(parsed.wishes);

        // Persist imported data to Firestore
        (async () => {
          await fs.clearAllData();
          await fs.seedInitialData(
            parsed.categories,
            parsed.boxes,
            parsed.problems || [],
            parsed.wishes || []
          );
        })().catch(console.error);

        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const resetToDefault = () => {
    setCategories(INITIAL_CATEGORIES);
    setBoxes(INITIAL_BOXES);
    setProblems(INITIAL_PROBLEMS);
    setWishes(INITIAL_WISHES);

    // Reset Firestore to initial data
    (async () => {
      await fs.clearAllData();
      await fs.seedInitialData(INITIAL_CATEGORIES, INITIAL_BOXES, INITIAL_PROBLEMS, INITIAL_WISHES);
    })().catch(console.error);
  };

  return (
    <InventoryContext.Provider
      value={{
        categories,
        boxes,
        problems,
        wishes,
        isLoggedIn,
        login,
        logout,
        addItem,
        updateItem,
        deleteItem,
        toggleItemProblem,
        addBox,
        updateBox,
        deleteBox,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        markProblemSolved,
        reopenProblem,
        deleteProblem,
        deleteWish,
        addWish,
        exportData,
        importData,
        resetToDefault
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
