export interface InventoryCategory {
  id: string;
  name: string;
  color: string;
  boxCount: number;
  bgColor: string;
  textColor: string;
  sortOrder?: number;
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
  {
    "textColor": "text-white",
    "color": "rød",
    "id": "red",
    "bgColor": "bg-red-500",
    "name": "Syning",
    "boxCount": 7
  },
  {
    "textColor": "text-slate-900",
    "color": "lyseblå",
    "id": "light-blue",
    "name": "Værktøj",
    "boxCount": 10,
    "bgColor": "bg-sky-400"
  },
  {
    "name": "Fin Elektronik",
    "boxCount": 10,
    "bgColor": "bg-slate-200 dark:bg-slate-700",
    "id": "clear",
    "color": "gennemsigtig",
    "textColor": "text-slate-900 dark:text-slate-100"
  },
  {
    "name": "Alm. Elektronik",
    "bgColor": "bg-slate-900",
    "color": "sort",
    "id": "black",
    "boxCount": 14,
    "textColor": "text-white"
  },
  {
    "textColor": "text-white",
    "color": "blå",
    "boxCount": 10,
    "name": "Cykel",
    "bgColor": "bg-blue-600",
    "id": "blue"
  },
  {
    "textColor": "text-white",
    "color": "lilla",
    "name": "Metal & Sikkerhed",
    "bgColor": "bg-purple-600",
    "id": "purple",
    "boxCount": 6
  },
  {
    "bgColor": "bg-emerald-600",
    "textColor": "text-white",
    "boxCount": 6,
    "color": "grøn",
    "name": "Træ",
    "id": "green"
  }
];

export const INITIAL_BOXES: InventoryBox[] = [
  {
    "name": "Loddeværktøj",
    "items": [
      {
        "id": "b1-1",
        "description": "Justerbar temperatur 200-450C",
        "quantity": 1,
        "name": "Loddekolbe 60W med digital display"
      },
      {
        "description": "Blyfri loddetin med flusmiddel",
        "id": "b1-2",
        "name": "Loddetin 0.8mm 100g",
        "quantity": 2
      }
    ],
    "number": 1,
    "categoryId": "black",
    "id": "black-1"
  },
  {
    "number": 10,
    "name": "Relæer",
    "id": "black-10",
    "categoryId": "black"
  },
  {
    "id": "black-11",
    "categoryId": "black",
    "number": 11,
    "name": "Sikringer"
  },
  {
    "id": "black-12",
    "categoryId": "black",
    "name": "Transformere",
    "number": 12
  },
  {
    "number": 13,
    "id": "black-13",
    "categoryId": "black",
    "name": "Elektronik Bøger"
  },
  {
    "id": "black-14",
    "categoryId": "black",
    "name": "Elektronik Diverse",
    "number": 14
  },
  {
    "number": 2,
    "id": "black-2",
    "name": "Ledninger & Kabler",
    "categoryId": "black"
  },
  {
    "number": 3,
    "id": "black-3",
    "categoryId": "black",
    "name": "Strømforsyninger"
  },
  {
    "number": 4,
    "id": "black-4",
    "name": "Batterier",
    "categoryId": "black"
  },
  {
    "id": "black-5",
    "name": "Motorer",
    "number": 5,
    "categoryId": "black"
  },
  {
    "number": 6,
    "id": "black-6",
    "categoryId": "black",
    "name": "Lydkomponenter"
  },
  {
    "name": "Testudstyr",
    "categoryId": "black",
    "id": "black-7",
    "number": 7
  },
  {
    "number": 8,
    "name": "Printplader",
    "id": "black-8",
    "categoryId": "black"
  },
  {
    "number": 9,
    "name": "Køleelementer",
    "categoryId": "black",
    "id": "black-9"
  },
  {
    "name": "Dæk & Slanger",
    "id": "blue-1",
    "categoryId": "blue",
    "number": 1
  },
  {
    "id": "blue-1787037185678",
    "items": [],
    "categoryId": "blue",
    "name": "Smørremiddel & olie",
    "number": 9
  },
  {
    "categoryId": "blue",
    "number": 10,
    "id": "blue-1787037190962",
    "items": [],
    "name": "Rens & puds"
  },
  {
    "name": "Bremser",
    "number": 2,
    "categoryId": "blue",
    "id": "blue-2"
  },
  {
    "categoryId": "blue",
    "number": 3,
    "name": "Kæder",
    "id": "blue-3"
  },
  {
    "name": "Gear & Skiftere",
    "number": 4,
    "id": "blue-4",
    "categoryId": "blue"
  },
  {
    "number": 5,
    "categoryId": "blue",
    "name": "Pedaler",
    "id": "blue-5"
  },
  {
    "id": "blue-6",
    "name": "Styr",
    "number": 6,
    "categoryId": "blue"
  },
  {
    "name": "Sadler",
    "categoryId": "blue",
    "number": 7,
    "id": "blue-7"
  },
  {
    "number": 8,
    "id": "blue-8",
    "name": "Hjul",
    "categoryId": "blue"
  },
  {
    "categoryId": "clear",
    "id": "clear-1",
    "number": 1,
    "items": [
      {
        "name": "Arduino Uno R3",
        "description": "ATmega328P mikrocontroller board",
        "quantity": 3,
        "id": "c1-1"
      },
      {
        "description": "Wi-Fi + Bluetooth udviklingskort",
        "id": "c1-2",
        "name": "ESP32 NodeMCU",
        "quantity": 5
      }
    ],
    "name": "Mikrocontrollere"
  },
  {
    "categoryId": "clear",
    "number": 10,
    "id": "clear-10",
    "name": "Fin Elektronik Diverse"
  },
  {
    "id": "clear-2",
    "items": [
      {
        "name": "DHT22 Temperatur & Fugtighedssensor",
        "description": "Præcis digital sensor",
        "quantity": 4,
        "id": "c2-1"
      }
    ],
    "number": 2,
    "name": "Sensorer",
    "categoryId": "clear"
  },
  {
    "name": "LED & Displays",
    "categoryId": "clear",
    "id": "clear-3",
    "number": 3
  },
  {
    "number": 4,
    "categoryId": "clear",
    "id": "clear-4",
    "name": "Modstande"
  },
  {
    "number": 5,
    "name": "Kondensatorer",
    "categoryId": "clear",
    "id": "clear-5"
  },
  {
    "number": 6,
    "id": "clear-6",
    "categoryId": "clear",
    "name": "Transistorer"
  },
  {
    "categoryId": "clear",
    "name": "IC'er",
    "number": 7,
    "id": "clear-7"
  },
  {
    "number": 8,
    "categoryId": "clear",
    "name": "Stik",
    "id": "clear-8"
  },
  {
    "number": 9,
    "id": "clear-9",
    "name": "Kontakter",
    "categoryId": "clear"
  },
  {
    "categoryId": "green",
    "name": "Trælim & Klemmer",
    "id": "green-1",
    "number": 1
  },
  {
    "number": 2,
    "categoryId": "green",
    "name": "Sandpapir",
    "id": "green-2"
  },
  {
    "number": 3,
    "name": "Stemmejern",
    "id": "green-3",
    "categoryId": "green"
  },
  {
    "number": 4,
    "categoryId": "green",
    "id": "green-4",
    "name": "Høvle"
  },
  {
    "name": "Save",
    "categoryId": "green",
    "number": 5,
    "id": "green-5"
  },
  {
    "categoryId": "green",
    "name": "Træskruer & Dyvler",
    "number": 6,
    "id": "green-6"
  },
  {
    "number": 1,
    "name": "Skruetrækkere",
    "items": [
      {
        "quantity": 6,
        "name": "Stjerne & Flad skruetrækkersæt",
        "id": "lb1-1",
        "description": "Isolerede skruetrækkere 1000V"
      }
    ],
    "id": "light-blue-1",
    "categoryId": "light-blue"
  },
  {
    "number": 10,
    "categoryId": "light-blue",
    "name": "Diverse Værktøj",
    "id": "light-blue-10"
  },
  {
    "name": "Skruenøgler",
    "number": 2,
    "items": [
      {
        "quantity": 1,
        "name": "Svensknøgle 10-tommer",
        "description": "Justerbar skruenøgle",
        "id": "lb2-1"
      }
    ],
    "categoryId": "light-blue",
    "id": "light-blue-2"
  },
  {
    "number": 3,
    "categoryId": "light-blue",
    "name": "Tænger",
    "id": "light-blue-3"
  },
  {
    "id": "light-blue-4",
    "categoryId": "light-blue",
    "number": 4,
    "name": "Hamre"
  },
  {
    "id": "light-blue-5",
    "name": "Måleværktøj",
    "categoryId": "light-blue",
    "number": 5
  },
  {
    "categoryId": "light-blue",
    "id": "light-blue-6",
    "name": "Hobbyknive",
    "number": 6
  },
  {
    "name": "Tape & Lim",
    "number": 7,
    "categoryId": "light-blue",
    "id": "light-blue-7"
  },
  {
    "number": 8,
    "name": "Skruer & Bolte",
    "categoryId": "light-blue",
    "id": "light-blue-8"
  },
  {
    "categoryId": "light-blue",
    "name": "Klemmer",
    "number": 9,
    "id": "light-blue-9"
  },
  {
    "number": 1,
    "categoryId": "purple",
    "name": "Sikkerhedsbriller",
    "id": "purple-1"
  },
  {
    "name": "Handsker",
    "id": "purple-2",
    "categoryId": "purple",
    "number": 2
  },
  {
    "categoryId": "purple",
    "number": 3,
    "name": "Masker",
    "id": "purple-3"
  },
  {
    "name": "Høreværn",
    "number": 4,
    "id": "purple-4",
    "categoryId": "purple"
  },
  {
    "number": 5,
    "categoryId": "purple",
    "name": "Filer & Rasp",
    "id": "purple-5"
  },
  {
    "number": 6,
    "id": "purple-6",
    "categoryId": "purple",
    "name": "Borehoveder metal"
  },
  {
    "categoryId": "red",
    "id": "red-1",
    "number": 1,
    "name": "Tråd & Nåle",
    "items": [
      {
        "description": "Polyester sytråd i assorterede farver",
        "name": "Sytråd Sæt (24 farver)",
        "quantity": 24,
        "id": "r1-1"
      },
      {
        "name": "Synåle æske",
        "id": "r1-2",
        "description": "Assorterede nåle til håndsyning",
        "quantity": 1
      }
    ]
  },
  {
    "id": "red-2",
    "number": 2,
    "items": [
      {
        "name": "Bomuldsstof bomuld",
        "description": "Forskellige farvede bomuldsrester",
        "quantity": 5,
        "id": "r2-1"
      }
    ],
    "categoryId": "red",
    "name": "Stofrester"
  },
  {
    "items": [
      {
        "description": "Sorte og grå lynlåse",
        "name": "Metallynlåse 20cm",
        "quantity": 8,
        "id": "r3-1"
      },
      {
        "id": "r3-2",
        "quantity": 50,
        "description": "Dekorative knapper",
        "name": "Træknapper 15mm"
      }
    ],
    "name": "Knapper & Lynlåse",
    "categoryId": "red",
    "number": 3,
    "id": "red-3"
  },
  {
    "number": 4,
    "categoryId": "red",
    "id": "red-4",
    "name": "Måleværktøj"
  },
  {
    "items": [
      {
        "id": "r5-1",
        "quantity": 2,
        "name": "Stofsaks 25cm",
        "description": "Ergonomisk stofsaks i rustfrit stål"
      }
    ],
    "name": "Sakse & Skærere",
    "number": 5,
    "id": "red-5",
    "categoryId": "red"
  },
  {
    "id": "red-6",
    "name": "Symaskine Dele",
    "number": 6,
    "categoryId": "red"
  },
  {
    "name": "Mønstre",
    "id": "red-7",
    "number": 7,
    "categoryId": "red"
  }
];
