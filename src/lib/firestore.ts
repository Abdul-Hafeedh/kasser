import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { InventoryCategory, InventoryBox } from "./data";
import { ProblemReport, UserWish } from "./adminData";

// Collection names
const CATEGORIES_COL = "categories";
const BOXES_COL = "boxes";
const PROBLEMS_COL = "problems";
const WISHES_COL = "wishes";

// ── Load all data ──────────────────────────────────────────────
export async function loadAllData(): Promise<{
  categories: InventoryCategory[];
  boxes: InventoryBox[];
  problems: ProblemReport[];
  wishes: UserWish[];
} | null> {
  try {
    const [catSnap, boxSnap, probSnap, wishSnap] = await Promise.all([
      getDocs(collection(db, CATEGORIES_COL)),
      getDocs(collection(db, BOXES_COL)),
      getDocs(collection(db, PROBLEMS_COL)),
      getDocs(collection(db, WISHES_COL)),
    ]);

    // If Firestore is empty (first time), return null to signal "seed needed"
    if (catSnap.empty && boxSnap.empty) {
      return null;
    }

    // Explicit predefined order by ID / Color:
    // 1: Red (red), 2: Lightblue (light-blue), 3: Clear/White (clear), 4: Black (black), 5: Blue (blue), 6: Purple (purple), 7: Green (green)
    const ORDER_MAP: Record<string, number> = {
      red: 1,
      "light-blue": 2,
      clear: 3,
      white: 3,
      black: 4,
      blue: 5,
      purple: 6,
      green: 7,
    };

    const categories = catSnap.docs
      .map((d) => d.data() as InventoryCategory)
      .sort((a, b) => {
        if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
          return a.sortOrder - b.sortOrder;
        }
        const orderA = a.sortOrder ?? ORDER_MAP[a.id] ?? 99;
        const orderB = b.sortOrder ?? ORDER_MAP[b.id] ?? 99;
        return orderA - orderB;
      });

    const boxes = boxSnap.docs.map((d) => d.data() as InventoryBox);
    const problems = probSnap.docs.map((d) => d.data() as ProblemReport);
    const wishes = wishSnap.docs.map((d) => d.data() as UserWish);

    return { categories, boxes, problems, wishes };
  } catch (e) {
    console.error("Firestore loadAllData error:", e);
    return null;
  }
}

// ── Seed initial data ──────────────────────────────────────────
export async function seedInitialData(
  categories: InventoryCategory[],
  boxes: InventoryBox[],
  problems: ProblemReport[],
  wishes: UserWish[]
): Promise<void> {
  const batch = writeBatch(db);

  for (const cat of categories) {
    batch.set(doc(db, CATEGORIES_COL, cat.id), cat);
  }
  for (const box of boxes) {
    batch.set(doc(db, BOXES_COL, box.id), box);
  }
  for (const prob of problems) {
    batch.set(doc(db, PROBLEMS_COL, prob.id), prob);
  }
  for (const wish of wishes) {
    batch.set(doc(db, WISHES_COL, wish.id), wish);
  }

  await batch.commit();
}

// ── Categories ─────────────────────────────────────────────────
export async function saveCategory(category: InventoryCategory): Promise<void> {
  await setDoc(doc(db, CATEGORIES_COL, category.id), category);
}

export async function saveCategoriesBatch(categories: InventoryCategory[]): Promise<void> {
  const batch = writeBatch(db);
  for (const cat of categories) {
    batch.set(doc(db, CATEGORIES_COL, cat.id), cat);
  }
  await batch.commit();
}

export async function removeCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, CATEGORIES_COL, id));
}

// ── Boxes ──────────────────────────────────────────────────────
export async function saveBox(box: InventoryBox): Promise<void> {
  await setDoc(doc(db, BOXES_COL, box.id), box);
}

export async function removeBox(id: string): Promise<void> {
  await deleteDoc(doc(db, BOXES_COL, id));
}

export async function removeBoxesByCategoryId(categoryId: string, boxes: InventoryBox[]): Promise<void> {
  const batch = writeBatch(db);
  const toDelete = boxes.filter((b) => b.categoryId === categoryId);
  for (const box of toDelete) {
    batch.delete(doc(db, BOXES_COL, box.id));
  }
  await batch.commit();
}

// ── Problems ───────────────────────────────────────────────────
export async function saveProblem(problem: ProblemReport): Promise<void> {
  await setDoc(doc(db, PROBLEMS_COL, problem.id), problem);
}

export async function removeProblem(id: string): Promise<void> {
  await deleteDoc(doc(db, PROBLEMS_COL, id));
}

// ── Wishes ─────────────────────────────────────────────────────
export async function saveWish(wish: UserWish): Promise<void> {
  await setDoc(doc(db, WISHES_COL, wish.id), wish);
}

export async function removeWish(id: string): Promise<void> {
  await deleteDoc(doc(db, WISHES_COL, id));
}

// ── Bulk operations for import/reset ───────────────────────────
export async function clearAllData(): Promise<void> {
  const collections = [CATEGORIES_COL, BOXES_COL, PROBLEMS_COL, WISHES_COL];
  for (const colName of collections) {
    const snap = await getDocs(collection(db, colName));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
}
