import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, addDoc, collection } from "firebase/firestore";

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
            role: 'citizen',
            totalReports: 0,
            rank: '🟢 New User',
            isVerified: false
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

/**
 * Updates the user's Civic Score
 * @param {string} uid - User ID
 * @param {number} change - Amount to add (positive) or subtract (negative)
 */
export const updateCivicScore = async (uid, change) => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        await updateDoc(userRef, {
            civicScore: increment(change)
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating civic score:", error);
        return { success: false, error: error.message };
    }
};

export const RANK_TIERS = [
    { threshold: 0, title: 'New User' },
    { threshold: 2, title: 'Active Reporter' },
    { threshold: 6, title: 'Trusted Citizen' },
    { threshold: 16, title: 'Civic Champion' }
];

export const calculateRank = (totalReports) => {
    let rank = '🟢 New User';
    for (const tier of RANK_TIERS) {
        if (totalReports >= tier.threshold) {
            rank = tier.title;
        }
    }
    return rank;
};

/**
 * Creates a notification for the user
 * @param {string} uid 
 * @param {string} title 
 * @param {string} message 
 */
export const createNotification = async (uid, title, message) => {
    try {
        await addDoc(collection(db, 'notifications'), {
            uid: uid,
            title: title,
            message: message,
            read: false,
            createdAt: serverTimestamp(),
            type: 'reward'
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating notification:", error);
        return { success: false };
    }
};

/**
 * Verifies the user (Mock)
 * @param {string} uid 
 * @param {string} idType 
 * @param {string} idNumber 
 */
export const verifyUser = async (uid, idType, idNumber) => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        await updateDoc(userRef, {
            isVerified: true,
            verifiedAt: serverTimestamp(),
            verificationDetails: {
                type: idType,
                number: idNumber
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Error verifying user:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Updates user stats (report count) and recalculates rank
 * @param {string} uid 
 */
export const incrementUserReportCount = async (uid) => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const currentTotal = (userSnap.data().totalReports || 0) + 1;
            const newRank = calculateRank(currentTotal);

            await updateDoc(userRef, {
                totalReports: currentTotal,
                rank: newRank
            });
        }
    } catch (error) {
        console.error("Error updating user stats:", error);
    }
};
