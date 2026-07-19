const logger = require('../utils/logger');
const { sendError } = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.message}`, { stack: err.stack });
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  return sendError(res, err.message || 'Internal Server Error', [err.stack], statusCode);
};

module.exports = errorHandler;
