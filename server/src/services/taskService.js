const { Task } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get all tasks for a user with optional filtering and sorting
 */
const getAllTasks = async (userId, query = {}) => {
  const { status, priority, sortBy = 'createdAt', order = 'DESC' } = query;

  const where = { userId };

  if (status && ['pending', 'completed'].includes(status)) {
    where.status = status;
  }

  if (priority && ['low', 'medium', 'high'].includes(priority)) {
    where.priority = priority;
  }

  // Validate sort options
  const validSortFields = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'];
  const validOrders = ['ASC', 'DESC'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const sortOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

  const tasks = await Task.findAll({
    where,
    order: [[sortField, sortOrder]],
  });

  return tasks;
};

/**
 * Get a single task by ID (owner only)
 */
const getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  return task;
};

/**
 * Create a new task
 */
const createTask = async (userId, taskData) => {
  const task = await Task.create({
    ...taskData,
    userId,
  });

  return task;
};

/**
 * Update a task (owner only)
 */
const updateTask = async (taskId, userId, updates) => {
  const task = await Task.findOne({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  // Only update provided fields
  const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate'];
  const filteredUpdates = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  }

  await task.update(filteredUpdates);

  return task;
};

/**
 * Toggle task status between pending and completed
 */
const toggleTaskStatus = async (taskId, userId) => {
  const task = await Task.findOne({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  const newStatus = task.status === 'pending' ? 'completed' : 'pending';
  await task.update({ status: newStatus });

  return task;
};

/**
 * Delete a task (owner only)
 */
const deleteTask = async (taskId, userId) => {
  const task = await Task.findOne({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  await task.destroy();

  return { message: 'Task deleted successfully' };
};

/**
 * Get task statistics for a user
 */
const getTaskStats = async (userId) => {
  const tasks = await Task.findAll({ where: { userId } });

  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const highPriority = tasks.filter((t) => t.priority === 'high' && t.status === 'pending').length;

  return { total, pending, completed, highPriority };
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  getTaskStats,
};
