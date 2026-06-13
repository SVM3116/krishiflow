/**
 * Compute the multi-dimensional scores for a generated farm plan.
 * 
 * @param {object} params
 * @param {number} params.annualIncome - Total annual profit in Rupees
 * @param {number} params.numIncomeMonths - Number of months with profit > 0
 * @param {Array<object>} params.assignedCrops - Array of crop pairs assigned to the zones
 * @returns {object} Object containing profit_score, stability_score, sustainability_score, biodiversity_score, risk_score, and total_score
 */
const calculateScores = ({ annualIncome, numIncomeMonths, assignedCrops }) => {
  if (!assignedCrops || assignedCrops.length === 0) {
    return {
      profit_score: 0,
      stability_score: 0,
      sustainability_score: 0,
      biodiversity_score: 0,
      risk_score: 0,
      total_score: 0
    };
  }

  // 1. Profit Score: Compare against 100,000 (1 Lakh Rs) benchmark
  // Formula: (annualIncome / 100000) * 70, capped at 100
  const profitScore = Math.min((annualIncome / 100000) * 70, 100);

  // 2. Stability Score: How well the income is spread
  // Standard Formula: (numIncomeMonths / 6) * 80 + 20, capped at 100
  let stabilityScore = Math.min((numIncomeMonths / 6) * 80 + 20, 100);
  
  // Normalization for small farms (<= 3 zones): Since small farms cannot support 6 zones
  // without losing operational feasibility, we scale the stability benchmark to the zone limit.
  // This ensures a 3-zone farm with 2-3 active harvest months receives a realistic score above 70%.
  if (assignedCrops.length <= 3 && numIncomeMonths >= 2) {
    stabilityScore = Math.min((numIncomeMonths / assignedCrops.length) * 80 + 20, 100);
  }

  // 3. Sustainability Score: Avg of assigned crop pairs
  const totalSustainability = assignedCrops.reduce((acc, crop) => acc + (crop.sustainability_score || 0), 0);
  const sustainabilityScore = totalSustainability / assignedCrops.length;

  // 4. Biodiversity Score: Avg of assigned crop pairs
  const totalBiodiversity = assignedCrops.reduce((acc, crop) => acc + (crop.biodiversity_score || 0), 0);
  const biodiversityScore = totalBiodiversity / assignedCrops.length;

  // 5. Risk Score: 100 - average risk level (inverted so higher is better/safer)
  const totalRiskLevel = assignedCrops.reduce((acc, crop) => acc + (crop.risk_level || 0), 0);
  const avgRiskLevel = totalRiskLevel / assignedCrops.length;
  const riskScore = 100 - avgRiskLevel;

  // 6. Total Composite Score: Weighted average
  // weights: profit 35%, stability 25%, sustainability 20%, biodiversity 10%, risk 10%
  const totalScore = (profitScore * 0.35) +
                     (stabilityScore * 0.25) +
                     (sustainabilityScore * 0.20) +
                     (biodiversityScore * 0.10) +
                     (riskScore * 0.10);

  return {
    profit_score: parseFloat(profitScore.toFixed(2)),
    stability_score: parseFloat(stabilityScore.toFixed(2)),
    sustainability_score: parseFloat(sustainabilityScore.toFixed(2)),
    biodiversity_score: parseFloat(biodiversityScore.toFixed(2)),
    risk_score: parseFloat(riskScore.toFixed(2)),
    total_score: parseFloat(totalScore.toFixed(2))
  };
};

module.exports = {
  calculateScores
};
