/**
 * AI-Assisted Priority Logic (Rule-based for Hackathon Demo)
 * 
 * Rules:
 * 1. Category Severity: High risk categories get higher base score.
 * 2. Community Signal: Upvotes increase score significantly.
 * 3. Evidence: Image presence boosts score meant for validation.
 * 
 * Logic:
 * Score = Base Category Score + (Upvotes * Multiplier) + Image Bonus
 * 
 * Thresholds:
 * Score >= 80 -> HIGH
 * Score >= 40 -> MEDIUM
 * Score < 40  -> LOW
 */

export function calculatePriority({ category, upvotes = 0, imageUri, title = '' }) {
    let score = 0;
    let reasons = [];

    // Clean inputs
    const cat = category ? category.toLowerCase() : '';
    const cleanTitle = title.toLowerCase();

    // 1. BASE CATEGORY SCORE
    // High Severity
    if (['danger', 'hazard', 'urgent', 'electrical', 'fire', 'flood', 'accident', 'traffic'].some(k => cat.includes(k) || cleanTitle.includes(k))) {
        score += 60;
        reasons.push('high-risk category');
    }
    // Medium Severity
    else if (['pothole', 'water', 'road', 'infrastructure', 'broken'].some(k => cat.includes(k) || cleanTitle.includes(k))) {
        score += 40;
        reasons.push('infrastructure issue');
    }
    // Low Severity
    else {
        score += 10;
        reasons.push('civil report');
    }

    // 2. COMMUNITY VALIDATION (Upvotes)
    const voteScore = upvotes * 5; // Each vote is worth 5 points
    if (voteScore > 0) {
        score += voteScore;
        reasons.push(`${upvotes} community validations`);
    }

    // 3. EVIDENCE FACTOR (Image)
    if (imageUri) {
        score += 20;
        reasons.push('visual evidence provided');
    } else {
        // Penalty for no image? Or just no bonus.
        // Prompt says "Image present -> small boost".
    }

    // 4. DETERMINE LEVEL
    let level = 'low';
    if (score >= 80) level = 'high';
    else if (score >= 40) level = 'medium';

    return {
        priority: level,
        score: score,
        reason: reasons.join(', ')
    };
}
