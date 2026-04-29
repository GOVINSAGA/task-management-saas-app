const authService = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    ApiResponse.created(res, result, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    ApiResponse.success(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    ApiResponse.success(res, { user }, 'Profile retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile };
