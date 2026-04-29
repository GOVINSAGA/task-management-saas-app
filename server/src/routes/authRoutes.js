const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validators');

// POST /api/auth/register — Register a new user
router.post('/register', registerValidation, authController.register);

// POST /api/auth/login — Login user
router.post('/login', loginValidation, authController.login);

// GET /api/auth/me — Get current user profile (protected)
router.get('/me', authenticate, authController.getProfile);

module.exports = router;
