const cropService = require('../services/cropService');
const responseUtils = require('../utils/responseUtils');

/**
 * Handle GET /api/crop-pairs requests
 */
const getCropPairs = async (req, res) => {
  try {
    const { soil, water, region, season, limit } = req.query;
    
    // Parse limit (default 5)
    const resultLimit = limit ? parseInt(limit, 10) : 5;
    
    // Call the matching/suitability ranking logic
    const rankedCrops = await cropService.getRankedCropPairs({
      soil,
      water,
      region,
      season
    });
    
    // Slice results to respect limit
    const slicedCrops = rankedCrops.slice(0, resultLimit);
    
    return responseUtils.success(res, {
      crops: slicedCrops,
      total_found: rankedCrops.length
    }, 'Crop recommendations retrieved and ranked successfully.');
  } catch (error) {
    console.error('Error in cropController.getCropPairs:', error);
    return responseUtils.error(res, 'Failed to retrieve crop pairs. Please check parameters.', 500);
  }
};

module.exports = {
  getCropPairs
};
