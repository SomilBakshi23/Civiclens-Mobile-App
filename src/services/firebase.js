// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// ⚠️ PLACEHOLDER CONFIG - Replace with actual Firebase Project Config
const firebaseConfig = {
  apiKey: "AIzaSyDxuaX5gLVUBZ9OAQGaK7MfEKfAGY67V1o",

  authDomain: "civiclens-2b167.firebaseapp.com",

  projectId: "civiclens-2b167",

  storageBucket: "civiclens-2b167.firebasestorage.app",

  messagingSenderId: "252555277202",

  appId: "1:252555277202:web:522b1a8734b1819bdf874b",

  measurementId: "G-VJBZX9M50S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  // If auth is already initialized (e.g. during hot reload), use the existing instance
  auth = getAuth(app);
}

export { app, db, auth };
