const { supabase } = require('../services/supabaseClient');
const responseUtils = require('../utils/responseUtils');

/**
 * Express middleware to verify Supabase Auth JWT token
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return responseUtils.error(res, 'Authorization header must be provided as Bearer <token>.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return responseUtils.error(res, 'Token missing from Authorization header.', 401);
    }

    // Call Supabase auth service to get the user object for this JWT
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.warn('Authentication token verification failed:', error?.message || 'User not found');
      return responseUtils.error(res, 'Invalid or expired authentication token.', 401);
    }

    // Attach user information to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Crash in authMiddleware:', error);
    return responseUtils.error(res, 'Internal server error during authentication.', 500);
  }
};

module.exports = requireAuth;
