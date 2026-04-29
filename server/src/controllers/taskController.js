const taskService = require('../services/taskService');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Get all tasks for the authenticated user
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks(req.user.id, req.query);
    ApiResponse.success(res, { tasks }, 'Tasks retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user.id);
    ApiResponse.success(res, { task }, 'Task retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    ApiResponse.created(res, { task }, 'Task created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user.id, req.body);
    ApiResponse.success(res, { task }, 'Task updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle task status
 * @route   PATCH /api/tasks/:id/status
 * @access  Private
 */
const toggleStatus = async (req, res, next) => {
  try {
    const task = await taskService.toggleTaskStatus(req.params.id, req.user.id);
    ApiResponse.success(res, { task }, 'Task status updated');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const result = await taskService.deleteTask(req.params.id, req.user.id);
    ApiResponse.success(res, result, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get task statistics
 * @route   GET /api/tasks/stats
 * @access  Private
 */
const getStats = async (req, res, next) => {
  try {
    const stats = await taskService.getTaskStats(req.user.id);
    ApiResponse.success(res, { stats }, 'Task statistics retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, toggleStatus, deleteTask, getStats };
