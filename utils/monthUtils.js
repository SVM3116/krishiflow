const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

/**
 * Get the name of a month from its index (0-11)
 * @param {number} index - 0 to 11
 * @returns {string} Month name
 */
const getMonthName = (index) => {
  const normalizedIndex = ((index % 12) + 12) % 12; // Handle negative indices & wrap
  return MONTHS[normalizedIndex];
};

/**
 * Get base planting month index for a farming season
 * @param {string} season - kharif, rabi, or zaid
 * @returns {number} Month index (0-11)
 */
const getBaseMonthIndex = (season) => {
  const cleanSeason = season.toLowerCase().trim();
  if (cleanSeason === 'kharif') return 5;  // June
  if (cleanSeason === 'rabi') return 10;  // November
  if (cleanSeason === 'zaid') return 2;   // March
  return 5; // Default to June if invalid
};

/**
 * Calculate the staggered planting month name for a zone
 * @param {number} baseMonthIndex - Starting month index
 * @param {number} zoneIndex - Offset for this zone (e.g. 0 for Zone A, 1 for Zone B)
 * @returns {string} Planting month name
 */
const getPlantingMonth = (baseMonthIndex, zoneIndex) => {
  const plantingIndex = (baseMonthIndex + zoneIndex) % 12;
  return getMonthName(plantingIndex);
};

/**
 * Calculate the harvest month name based on planting month and crop duration
 * @param {number} baseMonthIndex - Starting month index
 * @param {number} zoneIndex - Offset for this zone
 * @param {number} durationDays - Crop duration in days
 * @returns {string} Harvest month name
 */
const getHarvestMonth = (baseMonthIndex, zoneIndex, durationDays) => {
  const plantingIndex = (baseMonthIndex + zoneIndex) % 12;
  const durationMonths = Math.floor(durationDays / 30);
  const harvestIndex = (plantingIndex + durationMonths) % 12;
  return getMonthName(harvestIndex);
};

module.exports = {
  MONTHS,
  getMonthName,
  getBaseMonthIndex,
  getPlantingMonth,
  getHarvestMonth
};
