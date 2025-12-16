// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Initialize Auth with persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { app, db, auth };
