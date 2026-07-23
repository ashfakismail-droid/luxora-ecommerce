const { error } = require('../utils/response');

const notFound = (req, res, next) => {
  return error(res, `Route ${req.originalUrl} not found`, 404);
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  return error(res, message, status);
};

module.exports = {
  notFound,
  errorHandler
};