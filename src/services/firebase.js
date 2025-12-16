// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDxuaX5gLVUBZ9OAQGaK7MfEKfAGY67V1o",
    authDomain: "civiclens-2b167.firebaseapp.com",
    projectId: "civiclens-2b167",
    storageBucket: "civiclens-2b167.firebasestorage.app",
    messagingSenderId: "252555277202",
    appId: "1:252555277202:web:522b1a8734b1819bdf874b",
    measurementId: "G-VJBZX9M50S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (Handling potential React Native env issues gracefully)
// const analytics = getAnalytics(app); // Disabled for React Native / Expo Go to prevent warnings about Cookies/IndexedDB

// Initialize Firestore
const db = getFirestore(app);

export { app, db };
