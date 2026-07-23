/**
 * Standardized API response helpers
 */

const success = (res, data, message = 'Success', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

const error = (res, message = 'Error', status = 500, errors = null) => {
  return res.status(status).json({
    success: false,
    message,
    errors
  });
};

const paginated = (res, data, page = 1, limit = 20, total = 0) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
};

module.exports = {
  success,
  error,
  paginated
};