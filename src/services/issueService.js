// src/services/issueService.js
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc, increment, serverTimestamp, query, orderBy, limit } from "firebase/firestore";

const ISSUES_COLLECTION = 'issues';

// Mock Data for Fallback (if Firebase is empty or offline)
const MOCK_ISSUES = [
    {
        id: 'mock-1',
        title: 'Pothole on 5th Ave',
        description: 'Large pothole causing traffic slowdown.',
        category: 'Roads',
        priority: 'high',
        status: 'resolved',
        upvotes: 342,
        location: 'Downtown',
        createdAt: new Date(),
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
        imageUrl: null
    }
];

export const createIssue = async (issueData) => {
    try {
        const docRef = await addDoc(collection(db, ISSUES_COLLECTION), {
            ...issueData,
            upvotes: 0,
            status: 'open',
            createdAt: serverTimestamp() // Firestore server time
        });
        console.log("Document written with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        return { success: false, error: e };
    }
};

export const getAllIssues = async () => {
    try {
        const q = query(collection(db, ISSUES_COLLECTION), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        let issues = [];
        querySnapshot.forEach((doc) => {
            issues.push({ id: doc.id, ...doc.data() });
        });

        if (issues.length === 0) {
            console.log("No issues found in Firestore, returning MOCK data.");
            return MOCK_ISSUES;
        }

        return issues;
    } catch (e) {
        console.warn("Error fetching issues (likely offline/no config), using MOCK data:", e);
        return MOCK_ISSUES;
    }
};

export const upvoteIssue = async (issueId) => {
    if (issueId.startsWith('mock')) return; // Can't update mock data

    try {
        const issueRef = doc(db, ISSUES_COLLECTION, issueId);
        await updateDoc(issueRef, {
            upvotes: increment(1)
        });
        return true;
    } catch (e) {
        console.error("Error upvoting: ", e);
        return false;
    }
};

export const updateIssueStatus = async (issueId, status) => {
    if (issueId.startsWith('mock')) return;

    try {
        const issueRef = doc(db, ISSUES_COLLECTION, issueId);
        await updateDoc(issueRef, {
            status: status
        });
        return true;
    } catch (e) {
        console.error("Error updating status: ", e);
        return false;
    }
};

export const getDashboardStats = async () => {
    // In a real app, use aggregation queries (count())
    // For now, fetch all and calc client side or use mocks
    try {
        const querySnapshot = await getDocs(collection(db, ISSUES_COLLECTION));
        let total = 0;
        let open = 0;
        let resolved = 0;

        querySnapshot.forEach((doc) => {
            total++;
            const data = doc.data();
            if (data.status === 'resolved') resolved++;
            else open++;
        });

        // Return calculated or default to mock stats if empty
        if (total === 0) {
            return {
                totalIssues: 142,
                resolvedRate: '89%',
                resTime: '48h'
            };
        }

        const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

        return {
            totalIssues: total,
            resolvedRate: `${rate}%`,
            resTime: '48h' // Hardcoded for hackathon demo simplicity
        };

    } catch (e) {
        console.warn("Stats fetch failed, using fallback.");
        return {
            totalIssues: 142,
            resolvedRate: '89%',
            resTime: '48h'
        };
    }
};
