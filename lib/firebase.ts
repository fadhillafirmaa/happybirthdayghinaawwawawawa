import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAT6THcuGNy_HA-alXjpMYdyTdl6vbPDuc",
  authDomain: "ultahghina.firebaseapp.com",
  projectId: "ultahghina",
  storageBucket: "ultahghina.firebasestorage.app",
  messagingSenderId: "848637780610",
  appId: "1:848637780610:web:fdf6b1e1850eddeef60a9b",
  measurementId: "G-ECJT0MWM56"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);