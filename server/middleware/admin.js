const { sendError } = require('../utils/responseHandler');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return sendError(res, 'Access denied. Administrator privileges required.', [], 403);
};

module.exports = { adminOnly };
