/**
 * Standard Success Response
 * @param {object} res - Express response object
 * @param {any} data - Data payload to return
 * @param {string} message - Human-readable success message
 * @param {number} statusCode - HTTP status code (default 200)
 */
const success = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Standard Error Response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {any} errors - Detailed errors object/array (optional)
 */
const error = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };
  if (errors) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};

module.exports = {
  success,
  error
};
