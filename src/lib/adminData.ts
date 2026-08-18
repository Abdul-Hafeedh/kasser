export interface ProblemReport {
  id: string;
  itemName: string;
  boxName: string;
  boxNumber: number;
  categoryName: string;
  categoryId: string;
  reportedAt: string;
  isSolved: boolean;
  solvedAt?: string; // ISO date string or timestamp
}

export interface UserWish {
  id: string;
  categoryName: string;
  categoryId: string;
  senderName: string;
  wishText: string;
  createdAt: string;
}

export const INITIAL_PROBLEMS: ProblemReport[] = [
  {
    id: "prob-1",
    itemName: "Bremseklodser",
    boxName: "Bremser",
    boxNumber: 2,
    categoryName: "Cykel",
    categoryId: "blue",
    reportedAt: "25.03.2025, 07.40",
    isSolved: true,
    solvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago (Active Løste)
  },
  {
    id: "prob-2",
    itemName: "Bidetang",
    boxName: "Tænger",
    boxNumber: 3,
    categoryName: "Værktøj",
    categoryId: "light-blue",
    reportedAt: "30.03.2025, 19.51",
    isSolved: true,
    solvedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago (Active Løste)
  },
  {
    id: "prob-3",
    itemName: "Spoler",
    boxName: "Symaskine Dele",
    boxNumber: 6,
    categoryName: "Syning",
    categoryId: "red",
    reportedAt: "30.03.2025, 20.28",
    isSolved: true,
    solvedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago (Active Løste)
  },
  {
    id: "prob-4",
    itemName: "Loddekolbe",
    boxName: "Loddeværktøj",
    boxNumber: 1,
    categoryName: "Alm. Elektronik",
    categoryId: "black",
    reportedAt: "29.04.2025, 21.05",
    isSolved: true,
    solvedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() // 45 days ago (> 1 month -> Arkiverede)
  },
  {
    id: "prob-5",
    itemName: "Sikkerhedsbriller",
    boxName: "Sikkerhedsbriller",
    boxNumber: 1,
    categoryName: "Metal & Sikkerhed",
    categoryId: "purple",
    reportedAt: "19.07.2025, 22.44",
    isSolved: true,
    solvedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days ago (> 1 month -> Arkiverede)
  },
  {
    id: "prob-6",
    itemName: "Sytråd Pakke",
    boxName: "Tråd & Nåle",
    boxNumber: 1,
    categoryName: "Syning",
    categoryId: "red",
    reportedAt: "19.07.2025, 22.28",
    isSolved: false
  }
];

export const INITIAL_WISHES: UserWish[] = [
  {
    id: "wish-1",
    categoryName: "Fin Elektronik",
    categoryId: "clear",
    senderName: "Hans",
    wishText: "The screwdriver in box 17 needs replacement.",
    createdAt: "30.03.2025, 19.52"
  },
  {
    id: "wish-2",
    categoryName: "Syning",
    categoryId: "red",
    senderName: "Dejskraber",
    wishText: "100 stk.",
    createdAt: "19.07.2025, 22.29"
  }
];
