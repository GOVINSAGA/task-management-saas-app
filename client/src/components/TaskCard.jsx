import { FiCheck, FiClock, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';

const priorityConfig = {
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Low' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Medium' },
  high: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'High' },
};

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const isCompleted = task.status === 'completed';

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!task.dueDate || isCompleted) return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div className={`glass-light rounded-xl p-4 transition-all hover:border-primary-500/30 slide-up ${isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Status Toggle */}
        <button
          onClick={() => onToggleStatus(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
            isCompleted
              ? 'bg-success border-success text-white'
              : 'border-surface-500 hover:border-primary-400'
          }`}
        >
          {isCompleted && <FiCheck className="text-xs" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-medium text-sm ${isCompleted ? 'line-through text-surface-400' : 'text-surface-100'}`}>
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p className="text-xs text-surface-400 mb-2 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority Badge */}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${priority.bg} ${priority.color} border ${priority.border}`}>
              {priority.label}
            </span>

            {/* Status Badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
              isCompleted
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-surface-700/50 text-surface-300 border border-surface-600/30'
            }`}>
              {isCompleted ? <FiCheck className="text-xs" /> : <FiClock className="text-xs" />}
              {isCompleted ? 'Completed' : 'Pending'}
            </span>

            {/* Due Date */}
            {task.dueDate && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${
                isOverdue() ? 'text-red-400 bg-red-500/10 border border-red-500/20' : 'text-surface-400'
              }`}>
                <FiCalendar className="text-xs" />
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-surface-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all cursor-pointer"
            title="Edit"
          >
            <FiEdit2 className="text-sm" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-surface-400 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
            title="Delete"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
