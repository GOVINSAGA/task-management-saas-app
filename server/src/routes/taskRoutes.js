const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');
const {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
} = require('../middleware/validators');

// All task routes are protected
router.use(authenticate);

// GET /api/tasks/stats — Get task statistics (must be before /:id)
router.get('/stats', taskController.getStats);

// GET /api/tasks — List user's tasks
router.get('/', taskController.getTasks);

// POST /api/tasks — Create a new task
router.post('/', createTaskValidation, taskController.createTask);

// GET /api/tasks/:id — Get a specific task
router.get('/:id', taskIdValidation, taskController.getTask);

// PUT /api/tasks/:id — Update a task
router.put('/:id', updateTaskValidation, taskController.updateTask);

// PATCH /api/tasks/:id/status — Toggle task status
router.patch('/:id/status', taskIdValidation, taskController.toggleStatus);

// DELETE /api/tasks/:id — Delete a task
router.delete('/:id', taskIdValidation, taskController.deleteTask);

module.exports = router;
