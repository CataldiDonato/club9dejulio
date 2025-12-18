/**
 * Calculates the points for a prediction based on the real match result.
 * 
 * Rules:
 * - 3 Points (Pleno): Exact match (e.g. Predicted 2-1, Result 2-1).
 * - 1 Point (Tendencia): Correct outcome (Win/Loss/Draw) but not exact score.
 *   - Example: Predicted 2-0 (Home Win), Result 1-0 (Home Win).
 *   - Example: Predicted 1-1 (Draw), Result 0-0 (Draw).
 * - 0 Points: Incorrect outcome.
 * 
 * @param {number} predHome - Predicted home score
 * @param {number} predAway - Predicted away score
 * @param {number} realHome - Real home score
 * @param {number} realAway - Real away score
 * @returns {number} Points awarded (3, 1, or 0)
 */
export const calculatePoints = (predHome, predAway, realHome, realAway) => {
    // Ensure inputs are numbers
    const pHome = Number(predHome);
    const pAway = Number(predAway);
    const rHome = Number(realHome);
    const rAway = Number(realAway);

    // 1. Exact Match (Pleno)
    if (pHome === rHome && pAway === rAway) {
        return 3;
    }

    // 2. Determine Outcome (Tendencia)
    const predDiff = pHome - pAway;
    const realDiff = rHome - rAway;

    // Check if both are Home Wins (diff > 0), Away Wins (diff < 0), or Draws (diff === 0)
    // We check if the sign of the difference matches.
    // Math.sign returns 1 for pos, -1 for neg, 0 for zero.
    if (Math.sign(predDiff) === Math.sign(realDiff)) {
        return 1;
    }

    // 3. Lose
    return 0;
};
