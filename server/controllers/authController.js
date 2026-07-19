const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_cineverse_2026', {
    expiresIn: '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return sendError(res, 'Please provide name, email, and password');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return sendError(res, 'User already exists with this email');
    }

    const user = await User.create({ name: name.trim(), email: cleanEmail, password: cleanPassword });
    const token = generateToken(user._id);

    return sendSuccess(res, 'Account created successfully', {
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      token
    }, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Please provide email and password');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user || !(await user.matchPassword(cleanPassword))) {
      return sendError(res, 'Invalid credentials', [], 401);
    }

    const token = generateToken(user._id);

    return sendSuccess(res, 'Logged in successfully', {
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      token
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('watchlist').populate('favorites');
    return sendSuccess(res, 'User profile retrieved', { user });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};
