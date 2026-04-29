const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Register a new user
 */
const register = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw ApiError.conflict('User with this email already exists');
  }

  // Create user (password hashed via model hook)
  const user = await User.create({ name, email, password });

  // Generate token
  const token = generateToken(user.id);

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Login user
 */
const login = async ({ email, password }) => {
  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Compare passwords
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Generate token
  const token = generateToken(user.id);

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Get user profile
 */
const getProfile = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user.toJSON();
};

module.exports = { register, login, getProfile };
