import React from 'react';

export default function TaskCard({ task, onClick }) {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const isInteractive = typeof onClick === 'function';

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-900 text-green-200';
      case 'medium':
        return 'bg-yellow-900 text-yellow-200';
      case 'high':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-slate-700 text-slate-200';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 bg-slate-800 border border-slate-600 rounded-lg transition-all duration-150 ${
        isInteractive ? 'cursor-pointer hover:shadow-lg hover:border-indigo-500' : ''
      } ${
        isOverdue ? 'border-red-500 bg-red-950 bg-opacity-20' : ''
      }`}
    >
      <h4 className="font-semibold text-slate-100 mb-2 line-clamp-2">{task.title}</h4>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          {task.assignedTo && (
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
              {task.assignedTo.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {task.dueDate && (
        <p
          className={`text-xs mt-2 ${
            isOverdue ? 'text-red-400 font-medium' : 'text-slate-400'
          }`}
        >
          {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
