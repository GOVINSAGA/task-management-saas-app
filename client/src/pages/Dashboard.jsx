import { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { FiPlus, FiFilter, FiInbox } from 'react-icons/fi';
import { HiOutlineClipboardList, HiOutlineClock, HiOutlineCheckCircle, HiOutlineFire } from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, highPriority: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState({ status: '', priority: '' });

  const fetchTasks = useCallback(async () => {
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.priority) params.priority = filter.priority;

      const [tasksRes, statsRes] = await Promise.all([
        tasksAPI.getAll(params),
        tasksAPI.getStats(),
      ]);

      setTasks(tasksRes.data.data.tasks);
      setStats(statsRes.data.data.stats);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.create(taskData);
      toast.success('Task created!');
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create task';
      toast.error(msg);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await tasksAPI.update(editingTask.id, taskData);
      toast.success('Task updated!');
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update task';
      toast.error(msg);
    }
  };

  const handleToggleStatus = async (taskId) => {
    try {
      await tasksAPI.toggleStatus(taskId);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksAPI.delete(taskId);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: HiOutlineClipboardList, color: 'from-primary-500 to-primary-700' },
    { label: 'Pending', value: stats.pending, icon: HiOutlineClock, color: 'from-amber-500 to-amber-700' },
    { label: 'Completed', value: stats.completed, icon: HiOutlineCheckCircle, color: 'from-emerald-500 to-emerald-700' },
    { label: 'High Priority', value: stats.highPriority, icon: HiOutlineFire, color: 'from-red-500 to-red-700' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Welcome */}
        <div className="mb-6 fade-in">
          <h1 className="text-2xl font-bold text-surface-100">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-surface-400 text-sm mt-1">Here&apos;s an overview of your tasks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {statCards.map((stat) => (
            <div key={stat.label} className="glass-light rounded-xl p-4 slide-up">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-surface-100">{stat.value}</p>
                  <p className="text-xs text-surface-400">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <FiFilter className="text-surface-400" />
            <select
              value={filter.status}
              onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value }))}
              className="px-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-600/30 text-surface-200 text-sm focus:outline-none focus:border-primary-500 cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filter.priority}
              onChange={(e) => setFilter((prev) => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-600/30 text-surface-200 text-sm focus:outline-none focus:border-primary-500 cursor-pointer"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm cursor-pointer"
          >
            <FiPlus />
            Add Task
          </button>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center fade-in">
            <FiInbox className="text-5xl text-surface-600 mb-4" />
            <h3 className="text-lg font-semibold text-surface-300 mb-1">No tasks yet</h3>
            <p className="text-surface-500 text-sm mb-4">
              {filter.status || filter.priority
                ? 'No tasks match the current filters.'
                : 'Create your first task to get started!'}
            </p>
            {!filter.status && !filter.priority && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm cursor-pointer"
              >
                <FiPlus />
                Create First Task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEdit}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onClose={() => setShowForm(false)}
        />
      )}
      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={handleUpdateTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
