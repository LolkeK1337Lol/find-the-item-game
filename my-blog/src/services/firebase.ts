// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "твоя",
  authDomain: "твоё",
  projectId: "твоё",
  storageBucket: "твоё",
  messagingSenderId: "твоё",
  appId: "твоё",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
