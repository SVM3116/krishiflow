const pestService = require('../services/pestService');
const responseUtils = require('../utils/responseUtils');

/**
 * Handle POST /api/pest-detect and POST /api/pest requests
 */
const detectPest = async (req, res) => {
  try {
    const { crop_name, symptoms } = req.body;

    // Resolve missing crop name by defaulting to "General" (frontend only sends symptoms)
    const resolvedCrop = crop_name || 'General';

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return responseUtils.error(res, 'Missing or empty field: symptoms must be a non-empty array of strings.', 400);
    }

    // 2. Invoke diagnosis service
    const diagnosis = await pestService.detectPest({
      cropName: resolvedCrop,
      symptoms
    });

    const responsePayload = {
      name: diagnosis.pest_name,
      confidence: diagnosis.confidence,
      traditional: diagnosis.traditional_remedy,
      chemical: diagnosis.chemical_option,
      prevention: diagnosis.prevention_tips,
      severity: diagnosis.severity,
      description: diagnosis.description
    };

    // Return merged response (flat root for frontend, and success/data wrapper for test diagnostics)
    return res.status(200).json({
      ...responsePayload,
      success: true,
      data: {
        ...diagnosis,
        ...responsePayload
      }
    });
  } catch (error) {
    console.error('Error in pestController.detectPest:', error);
    return responseUtils.error(res, error.message || 'Failed to detect pest. Internal Server Error.', 500);
  }
};

module.exports = {
  detectPest
};
