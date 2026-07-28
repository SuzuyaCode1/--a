// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3J8tDWIDtba3hq31yZFyR9hEqNcvbkDk",
  authDomain: "avto-c8011.firebaseapp.com",
  projectId: "avto-c8011",
  storageBucket: "avto-c8011.appspot.com",
  messagingSenderId: "1001471451873",
  appId: "1:1001471451873:web:6c7f3e4b2a1d9c8f5e"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, serverTimestamp, getDocs, query, orderBy };
