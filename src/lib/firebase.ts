import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD0e-yeuoHNqdqYLHjTHHuCeTB8dL8tCEU",
  authDomain: "kasser-3a26b.firebaseapp.com",
  projectId: "kasser-3a26b",
  storageBucket: "kasser-3a26b.firebasestorage.app",
  messagingSenderId: "198324439749",
  appId: "1:198324439749:web:3fb62e7823ee3e21453eac"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
