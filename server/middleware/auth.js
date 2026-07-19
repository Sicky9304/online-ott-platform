const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/responseHandler');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authorized, token missing', [], 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_cineverse_2026');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return sendError(res, 'User no longer exists', [], 401);
    }
    next();
  } catch (error) {
    return sendError(res, 'Not authorized, invalid token', [error.message], 401);
  }
};

module.exports = { protect };
