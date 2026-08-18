export interface InventoryCategory {
  id: string;
  name: string;
  color: string;
  boxCount: number;
  bgColor: string;
  textColor: string;
}

export interface InventoryBox {
  id: string;
  name: string;
  number: number;
  categoryId: string;
  description?: string;
  items?: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  quantity?: number;
  image?: string;
  tags?: string[];
  hasProblem?: boolean;
}

export const INITIAL_CATEGORIES: InventoryCategory[] = [
  { id: "red", name: "Syning", color: "rød", boxCount: 11, bgColor: "bg-red-500", textColor: "text-white" },
  { id: "light-blue", name: "Værktøj", color: "lyseblå", boxCount: 10, bgColor: "bg-sky-400", textColor: "text-slate-900" },
  { id: "clear", name: "Fin Elektronik", color: "gennemsigtig", boxCount: 10, bgColor: "bg-slate-200 dark:bg-slate-700", textColor: "text-slate-900 dark:text-slate-100" },
  { id: "black", name: "Alm. Elektronik", color: "sort", boxCount: 14, bgColor: "bg-slate-900", textColor: "text-white" },
  { id: "blue", name: "Cykel", color: "blå", boxCount: 12, bgColor: "bg-blue-600", textColor: "text-white" },
  { id: "purple", name: "Metal & Sikkerhed", color: "lilla", boxCount: 8, bgColor: "bg-purple-600", textColor: "text-white" },
  { id: "green", name: "Træ", color: "grøn", boxCount: 8, bgColor: "bg-emerald-600", textColor: "text-white" }
];

export const INITIAL_BOXES: InventoryBox[] = [
  // Syning (Red)
  { id: "red-1", name: "Tråd & Nåle", number: 1, categoryId: "red", items: [
    { id: "r1-1", name: "Sytråd Sæt (24 farver)", description: "Polyester sytråd i assorterede farver", quantity: 24 },
    { id: "r1-2", name: "Synåle æske", description: "Assorterede nåle til håndsyning", quantity: 1 }
  ]},
  { id: "red-2", name: "Stofrester", number: 2, categoryId: "red", items: [
    { id: "r2-1", name: "Bomuldsstof bomuld", description: "Forskellige farvede bomuldsrester", quantity: 5 }
  ]},
  { id: "red-3", name: "Knapper & Lynlåse", number: 3, categoryId: "red", items: [
    { id: "r3-1", name: "Metallynlåse 20cm", description: "Sorte og grå lynlåse", quantity: 8 },
    { id: "r3-2", name: "Træknapper 15mm", description: "Dekorative knapper", quantity: 50 }
  ]},
  { id: "red-4", name: "Måleværktøj", number: 4, categoryId: "red" },
  { id: "red-5", name: "Sakse & Skærere", number: 5, categoryId: "red", items: [
    { id: "r5-1", name: "Stofsaks 25cm", description: "Ergonomisk stofsaks i rustfrit stål", quantity: 2 }
  ]},
  { id: "red-6", name: "Symaskine Dele", number: 6, categoryId: "red" },
  { id: "red-7", name: "Mønstre", number: 7, categoryId: "red" },
  { id: "red-8", name: "Broderi", number: 8, categoryId: "red" },
  { id: "red-9", name: "Elastik & Bånd", number: 9, categoryId: "red" },
  { id: "red-10", name: "Knappenåle & Clips", number: 10, categoryId: "red" },
  { id: "red-11", name: "Sy-bøger", number: 11, categoryId: "red" },

  // Værktøj (Light Blue)
  { id: "light-blue-1", name: "Skruetrækkere", number: 1, categoryId: "light-blue", items: [
    { id: "lb1-1", name: "Stjerne & Flad skruetrækkersæt", description: "Isolerede skruetrækkere 1000V", quantity: 6 }
  ]},
  { id: "light-blue-2", name: "Skruenøgler", number: 2, categoryId: "light-blue", items: [
    { id: "lb2-1", name: "Svensknøgle 10-tommer", description: "Justerbar skruenøgle", quantity: 1 }
  ]},
  { id: "light-blue-3", name: "Tænger", number: 3, categoryId: "light-blue" },
  { id: "light-blue-4", name: "Hamre", number: 4, categoryId: "light-blue" },
  { id: "light-blue-5", name: "Måleværktøj", number: 5, categoryId: "light-blue" },
  { id: "light-blue-6", name: "Hobbyknive", number: 6, categoryId: "light-blue" },
  { id: "light-blue-7", name: "Tape & Lim", number: 7, categoryId: "light-blue" },
  { id: "light-blue-8", name: "Skruer & Bolte", number: 8, categoryId: "light-blue" },
  { id: "light-blue-9", name: "Klemmer", number: 9, categoryId: "light-blue" },
  { id: "light-blue-10", name: "Diverse Værktøj", number: 10, categoryId: "light-blue" },

  // Fin Elektronik (Clear)
  { id: "clear-1", name: "Mikrocontrollere", number: 1, categoryId: "clear", items: [
    { id: "c1-1", name: "Arduino Uno R3", description: "ATmega328P mikrocontroller board", quantity: 3 },
    { id: "c1-2", name: "ESP32 NodeMCU", description: "Wi-Fi + Bluetooth udviklingskort", quantity: 5 }
  ]},
  { id: "clear-2", name: "Sensorer", number: 2, categoryId: "clear", items: [
    { id: "c2-1", name: "DHT22 Temperatur & Fugtighedssensor", description: "Præcis digital sensor", quantity: 4 }
  ]},
  { id: "clear-3", name: "LED & Displays", number: 3, categoryId: "clear" },
  { id: "clear-4", name: "Modstande", number: 4, categoryId: "clear" },
  { id: "clear-5", name: "Kondensatorer", number: 5, categoryId: "clear" },
  { id: "clear-6", name: "Transistorer", number: 6, categoryId: "clear" },
  { id: "clear-7", name: "IC'er", number: 7, categoryId: "clear" },
  { id: "clear-8", name: "Stik", number: 8, categoryId: "clear" },
  { id: "clear-9", name: "Kontakter", number: 9, categoryId: "clear" },
  { id: "clear-10", name: "Fin Elektronik Diverse", number: 10, categoryId: "clear" },

  // Alm. Elektronik (Black)
  { id: "black-1", name: "Loddeværktøj", number: 1, categoryId: "black", items: [
    { id: "b1-1", name: "Loddekolbe 60W med digital display", description: "Justerbar temperatur 200-450C", quantity: 1 },
    { id: "b1-2", name: "Loddetin 0.8mm 100g", description: "Blyfri loddetin med flusmiddel", quantity: 2 }
  ]},
  { id: "black-2", name: "Ledninger & Kabler", number: 2, categoryId: "black" },
  { id: "black-3", name: "Strømforsyninger", number: 3, categoryId: "black" },
  { id: "black-4", name: "Batterier", number: 4, categoryId: "black" },
  { id: "black-5", name: "Motorer", number: 5, categoryId: "black" },
  { id: "black-6", name: "Lydkomponenter", number: 6, categoryId: "black" },
  { id: "black-7", name: "Testudstyr", number: 7, categoryId: "black" },
  { id: "black-8", name: "Printplader", number: 8, categoryId: "black" },
  { id: "black-9", name: "Køleelementer", number: 9, categoryId: "black" },
  { id: "black-10", name: "Relæer", number: 10, categoryId: "black" },
  { id: "black-11", name: "Sikringer", number: 11, categoryId: "black" },
  { id: "black-12", name: "Transformere", number: 12, categoryId: "black" },
  { id: "black-13", name: "Elektronik Bøger", number: 13, categoryId: "black" },
  { id: "black-14", name: "Elektronik Diverse", number: 14, categoryId: "black" },

  // Cykel (Blue)
  { id: "blue-1", name: "Dæk & Slanger", number: 1, categoryId: "blue" },
  { id: "blue-2", name: "Bremser", number: 2, categoryId: "blue" },
  { id: "blue-3", name: "Kæder", number: 3, categoryId: "blue" },
  { id: "blue-4", name: "Gear & Skiftere", number: 4, categoryId: "blue" },
  { id: "blue-5", name: "Pedaler", number: 5, categoryId: "blue" },
  { id: "blue-6", name: "Styr", number: 6, categoryId: "blue" },
  { id: "blue-7", name: "Sadler", number: 7, categoryId: "blue" },
  { id: "blue-8", name: "Hjul", number: 8, categoryId: "blue" },
  { id: "blue-9", name: "Cykelværktøj", number: 9, categoryId: "blue" },
  { id: "blue-10", name: "Cykellygter", number: 10, categoryId: "blue" },
  { id: "blue-11", name: "Cykeltilbehør", number: 11, categoryId: "blue" },
  { id: "blue-12", name: "Cykel Diverse", number: 12, categoryId: "blue" },

  // Metal & Sikkerhed (Purple)
  { id: "purple-1", name: "Sikkerhedsbriller", number: 1, categoryId: "purple" },
  { id: "purple-2", name: "Handsker", number: 2, categoryId: "purple" },
  { id: "purple-3", name: "Masker", number: 3, categoryId: "purple" },
  { id: "purple-4", name: "Høreværn", number: 4, categoryId: "purple" },
  { id: "purple-5", name: "Filer & Rasp", number: 5, categoryId: "purple" },
  { id: "purple-6", name: "Borehoveder metal", number: 6, categoryId: "purple" },
  { id: "purple-7", name: "Boremaskine tilbehør", number: 7, categoryId: "purple" },
  { id: "purple-8", name: "Metal Diverse", number: 8, categoryId: "purple" },

  // Træ (Green)
  { id: "green-1", name: "Trælim & Klemmer", number: 1, categoryId: "green" },
  { id: "green-2", name: "Sandpapir", number: 2, categoryId: "green" },
  { id: "green-3", name: "Stemmejern", number: 3, categoryId: "green" },
  { id: "green-4", name: "Høvle", number: 4, categoryId: "green" },
  { id: "green-5", name: "Save", number: 5, categoryId: "green" },
  { id: "green-6", name: "Træskruer & Dyvler", number: 6, categoryId: "green" },
  { id: "green-7", name: "Overfladebehandling", number: 7, categoryId: "green" },
  { id: "green-8", name: "Træ Diverse", number: 8, categoryId: "green" }
];
