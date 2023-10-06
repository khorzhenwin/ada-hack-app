import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQtmBohdablm1Pm8-pUZrZhjFa5ckPQz8",
  authDomain: "ada-hack-inquisitor.firebaseapp.com",
  projectId: "ada-hack-inquisitor",
  storageBucket: "ada-hack-inquisitor.appspot.com",
  messagingSenderId: "723434593703",
  appId: "1:723434593703:web:3cea8c58e00f9445ebaa82",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
