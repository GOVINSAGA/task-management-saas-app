require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize, connectDB } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

// Import models to register associations
require('./src/models');

const app = express();
const PORT = process.env.PORT || 5002;

// ─── Security & Parsing Middleware ──────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Task Manager API is running',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ─── Error Handling ─────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Sync models (creates tables if they don't exist)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synced');

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
