// success response
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// error response
const errorResponse = (res, error = 'Server error', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};