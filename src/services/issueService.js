// src/services/issueService.js
import { db } from './firebase';
import { updateCivicScore, createNotification, incrementUserReportCount } from './userService';
import { collection, addDoc, getDocs, updateDoc, doc, increment, serverTimestamp, query, orderBy, arrayUnion, getDoc, getCountFromServer, where } from "firebase/firestore";
import { calculatePriority } from '../utils/priorityEngine';

const ISSUES_COLLECTION = 'issues';

// --- IN-MEMORY CACHE FOR DEMO PERSISTENCE ---
// This ensures that even if Firestore is slow/offline, the app "feels" instant
// and retains data across screens during the session.
let localIssues = [
    {
        id: 'mock-1',
        title: 'Pothole on 5th Ave',
        description: 'Large pothole causing traffic slowdown.',
        category: 'Infrastructure',
        priority: 'high',
        status: 'resolved',
        upvotes: 342,
        location: 'Downtown',
        createdAt: new Date(),
        latitude: 37.78925,
        longitude: -122.4334,
        imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 'mock-2',
        title: 'Broken Street Light',
        description: 'Street light flickering for 3 days.',
        category: 'Electrical',
        priority: 'medium',
        status: 'open',
        upvotes: 125,
        location: 'Sector 4',
        createdAt: new Date(),
        latitude: 37.78725,
        longitude: -122.4314,
        imageUrl: null
    },
    {
        id: 'mock-3',
        title: 'Graffiti on Wall',
        description: 'Offensive graffiti near school.',
        category: 'Vandalism',
        priority: 'low',
        status: 'open',
        upvotes: 12,
        location: 'Main St',
        createdAt: new Date(),
        latitude: 37.78855,
        longitude: -122.4344,
        imageUrl: null
    }
];

export const createIssue = async (issueData) => {
    // 1. Fetch User Profile to snapshot trust signals
    let reporterInfo = {
        reportedByVerified: false,
        reportedByRank: '🟢 New User',
        reportedByCivicId: 'Unknown'
    };

    if (issueData.reportedBy) {
        try {
            const userSnap = await getDoc(doc(db, 'users', issueData.reportedBy));
            if (userSnap.exists()) {
                const userData = userSnap.data();
                reporterInfo = {
                    reportedByVerified: userData.isVerified || false,
                    reportedByRank: userData.rank || '🟢 New User',
                    reportedByCivicId: userData.civicId || 'Unknown'
                };
            }
        } catch (e) {
            console.error("Error fetching reporter info:", e);
        }
    }

    // 2. Optimistic Update (Immediate Local Save)
    const newIssue = {
        id: 'local-' + Date.now(),
        ...issueData,
        ...reporterInfo, // Snapshot trust signals
        upvotes: 0,
        status: 'open',
        createdAt: new Date(),
        // Ensure coords are present or fallback
        latitude: issueData.latitude || 37.78825,
        longitude: issueData.longitude || -122.4324,
    };
    localIssues.unshift(newIssue); // Add to top of list

    // 3. Async Backend Save
    try {
        const docRef = await addDoc(collection(db, ISSUES_COLLECTION), {
            ...issueData,
            ...reporterInfo, // Snapshot trust signals
            upvotes: 0,
            status: 'open',
            createdAt: serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);

        // REWARD: +10 Civic Score
        if (issueData.reportedBy) {
            updateCivicScore(issueData.reportedBy, 10);
            incrementUserReportCount(issueData.reportedBy); // Update Rank & Stats
            createNotification(issueData.reportedBy, "Civic Score Update", "You earned +10 Civic Score for reporting an issue!");
        }

        // Update the local ID with real ID (optional for demo)
        return { success: true, id: docRef.id };
    } catch (e) {
        console.warn("Backend save failed, keeping local copy.", e);
        // Return success true anyway because for the USER, it worked locally.
        return { success: true, id: newIssue.id };
    }
};

export const getAllIssues = async () => {
    try {
        // For production, we would fetch from DB and merge.
        // For this Hackathon Demo, we rely on the in-memory cache we built up.
        // This guarantees that what the user JUST created is definitely there.
        return localIssues;
    } catch (e) {
        console.warn("Error fetching issues:", e);
        return localIssues;
    }
};

export const upvoteIssue = async (issueId, userId) => {
    // Local Update (Optimistic)
    const issue = localIssues.find(i => i.id === issueId);
    if (issue) {
        // Prevent local double count if we tracked it locally (simplified for demo)
        issue.upvotes = (issue.upvotes || 0) + 1;

        // Recalculate Priority Dynamically
        const { priority, reason } = calculatePriority({
            category: issue.category,
            upvotes: issue.upvotes,
            imageUri: issue.imageUrl || issue.imageUri,
            title: issue.title
        });
        issue.priority = priority;
        issue.priorityReason = reason;
    }

    if (issueId.startsWith('mock') || issueId.startsWith('local')) return true;

    try {
        const issueRef = doc(db, ISSUES_COLLECTION, issueId);

        // Use arrayUnion to ensure uniqueness. 
        // If userId is already in 'likedBy', this won't change anything (idempotent).
        // But we still increment for the UI counter (imperfect for consistency but good for perf).
        // Best practice: Transaction or check first. For simple app: just update.

        // We will do a check to be nicer
        const docSnap = await getDoc(issueRef);

        if (!docSnap.exists()) {
            console.error("Issue not found");
            return false;
        }

        const data = docSnap.data();
        const likedBy = data.likedBy || [];

        if (likedBy.includes(userId)) {
            return false; // Already liked
        }

        const currentUpvotes = (data.upvotes || 0) + 1;

        // Recalculate Priority for Real Backend Data
        const { priority, reason } = calculatePriority({
            category: data.category,
            upvotes: currentUpvotes,
            imageUri: data.imageUrl || data.imageUri,
            title: data.title
        });

        await updateDoc(issueRef, {
            upvotes: increment(1),
            likedBy: arrayUnion(userId),
            priority: priority,
            priorityReason: reason
        });
        return true;
    } catch (e) {
        console.error("Error upvoting: ", e);
        return false;
    }
};

export const updateIssueStatus = async (issueId, status) => {
    // Local Update
    const issue = localIssues.find(i => i.id === issueId);
    if (issue) {
        issue.status = status;
    }

    if (issueId.startsWith('mock') || issueId.startsWith('local')) return true;

    try {
        const issueRef = doc(db, ISSUES_COLLECTION, issueId);
        await updateDoc(issueRef, { status: status });
        return true;
    } catch (e) {
        console.error("Error updating status: ", e);
        return false;
    }
};


export const deleteIssue = async (issueId, userId) => {
    try {
        const issueRef = doc(db, ISSUES_COLLECTION, issueId);

        // Fetch to confirm owner or just trust caller (for demo trusting)
        // PENALTY: -10 Civic Score
        if (userId) {
            updateCivicScore(userId, -10);
            createNotification(userId, "Civic Score Update", "You lost -10 Civic Score for deleting a report.");
        }

        await updateDoc(issueRef, {
            status: 'deleted'
        });
        return true;
    } catch (e) {
        console.error("Error deleting issue: ", e);
        return false;
    }
};

export const getDashboardStats = async () => {
    try {
        const coll = collection(db, ISSUES_COLLECTION);
        // Exclude deleted issues from total count
        const qTotal = query(coll, where("status", "!=", "deleted"));
        const snapshot = await getCountFromServer(qTotal);
        const total = snapshot.data().count;

        const qResolved = query(coll, where("status", "==", "resolved"));
        const snapshotResolved = await getCountFromServer(qResolved);
        const resolved = snapshotResolved.data().count;

        const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

        return {
            totalIssues: total,
            resolvedRate: `${rate}%`,
            resTime: '48h'
        };
    } catch (e) {
        console.warn("Error fetching stats:", e);
        return {
            totalIssues: 0,
            resolvedRate: '0%',
            resTime: '48h'
        };
    }
};
