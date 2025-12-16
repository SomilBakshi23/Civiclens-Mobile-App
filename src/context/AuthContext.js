import React, { createContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
// We need to import 'auth' from firebase/auth getting initialized app but instructions say init in firebase.js
// Actually, firebase.js exports 'app'. Use getAuth(app).
import { getAuth } from "firebase/auth";
import { app, auth } from '../services/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const [loading, setLoading] = useState(true);

    // const auth = getAuth(app); // Removed: using persistent auth instance from services/firebase

    // Persist login state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsGuest(false);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsGuest(false);
        } catch (error) {
            console.error(error);
        }
    };

    const continueAsGuest = () => {
        setIsGuest(true);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isGuest,
            loading,
            login,
            register,
            logout,
            continueAsGuest
        }}>
            {children}
        </AuthContext.Provider>
    );
};
