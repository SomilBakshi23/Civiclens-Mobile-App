// src/utils/priorityEngine.js

/**
 * AI-Assisted Priority Logic (Rule-based for Hackathon Demo)
 * 
 * In a real production environment, this would call a TensorFlow Lite model
 * or a server-side ML API to analyze text sentiment + image severity.
 * 
 * Logic Rules:
 * 1. Urgency keywords in category = HIGH
 * 2. High upvote count (> 50) = HIGH
 * 3. Default = MEDIUM (for review)
 */

export function calculatePriority(category, upvotes = 0) {
    const highPriorityCategories = ['danger', 'hazard', 'urgent', 'electrical', 'fire', 'flood'];
    const lowPriorityCategories = ['graffiti', 'suggestion', 'litter', 'noise'];

    // Normalize inputs
    const cat = category ? category.toLowerCase() : '';

    // Rule 1: Safety/Urgency keywords
    if (highPriorityCategories.some(k => cat.includes(k))) {
        return 'high';
    }

    // Rule 2: Crowd validation (Upvotes)
    if (upvotes > 50) {
        return 'high';
    }

    // Rule 3: Low priority types
    if (lowPriorityCategories.some(k => cat.includes(k))) {
        return 'low';
    }

    // Default Fallback
    return 'medium';
}

export function aiRefinePriority(title, description) {
    // Simulated NLP analysis
    const text = (title + " " + description).toLowerCase();

    if (text.includes('accident') || text.includes('hurt') || text.includes('blocked')) {
        return 'high';
    }
    return null; // No override
}
