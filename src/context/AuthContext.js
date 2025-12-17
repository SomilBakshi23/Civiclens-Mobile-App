import React, { createContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { app, auth } from '../services/firebase';
import { createUserSkeleton, getUserProfile } from '../services/userService';

// Export Auth & Profile Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Firebase Auth User
    const [profile, setProfile] = useState(null); // Firestore User Profile (Civic ID, role, details)
    const [isGuest, setIsGuest] = useState(false);
    const [loading, setLoading] = useState(true);

    // Persist login state & sync profile
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsGuest(false);

                // Fetch Profile from Firestore
                const result = await getUserProfile(currentUser.uid);
                if (result.success) {
                    setProfile(result.profile);
                } else {
                    // Critical fallback if auth exists but no profile (e.g. manual console creation)
                    // Attempt to create one lazily
                    const createRes = await createUserSkeleton(currentUser.uid, currentUser.email);
                    if (createRes.success) setProfile(createRes.profile);
                }
            } else {
                // Fully Reset State on Logout
                setUser(null);
                setProfile(null);
                setIsGuest(false);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Refresh Profile (helper for after setup completion)
    const refreshProfile = async () => {
        if (user) {
            const result = await getUserProfile(user.uid);
            if (result.success) setProfile(result.profile);
        }
    };

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged will handle fetching profile
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Immediately create profile doc
            await createUserSkeleton(user.uid, user.email);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            // State reset is handled by onAuthStateChanged
        } catch (error) {
            console.error(error);
        }
    };

    const continueAsGuest = () => {
        setIsGuest(true);
        setUser(null);
        setProfile(null); // Guests have no profile
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            isGuest,
            loading,
            login,
            register,
            logout,
            continueAsGuest,
            refreshProfile // Expose this to update state after profile completion
        }}>
            {children}
        </AuthContext.Provider>
    );
};
