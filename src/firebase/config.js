import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCvHlwyIZQqoVD6qmudza4FXvGiL7wH-Ks",
  authDomain: "college-election-portal-4b9ce.firebaseapp.com",
  databaseURL: "https://college-election-portal-4b9ce-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "college-election-portal-4b9ce",
  storageBucket: "college-election-portal-4b9ce.firebasestorage.app",
  messagingSenderId: "915345091059",
  appId: "1:915345091059:web:b8c3a3df8519efd071ca86"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);