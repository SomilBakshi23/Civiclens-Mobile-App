import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const USERS_COLLECTION = 'users';

/**
 * Generates a unique Civic ID (e.g., CIVIC-9F3A21)
 */
export const generateCivicId = () => {
    // Generate 6 random Hex characters
    const uniquePart = Math.random().toString(16).substring(2, 8).toUpperCase();
    return `CIVIC-${uniquePart}`;
};

/**
 * Creates the initial user skeleton in Firestore (ONLY used on registration)
 * @param {string} uid - Firebase Auth UID
 * @param {string} email - User email
 */
export const createUserSkeleton = async (uid, email) => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { success: true, profile: userSnap.data() };
        }

        const civicId = generateCivicId();
        const initialProfile = {
            uid: uid,
            email: email,
            civicId: civicId,
            name: "", // STRICTLY EMPTY
            area: "", // STRICTLY EMPTY
            isProfileComplete: false, // MANDATORY FLAG
            createdAt: serverTimestamp(),
            civicScore: 100,
            role: 'citizen'
        };

        await setDoc(userRef, initialProfile);
        return { success: true, profile: initialProfile };

    } catch (error) {
        console.error("Error creating user skeleton:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetches the user profile from Firestore
 * @param {string} uid 
 */
export const getUserProfile = async (uid) => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { success: true, profile: userSnap.data() };
        } else {
            return { success: false, error: "Profile not found" };
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Updates the user profile (e.g., completing setup)
 * @param {string} uid 
 * @param {object} data 
 */
export const updateUserProfile = async (uid, data) => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        await updateDoc(userRef, data);
        return { success: true };
    } catch (error) {
        console.error("Error updating user profile:", error);
        return { success: false, error: error.message };
    }
};
