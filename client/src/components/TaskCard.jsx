import React from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TaskCard({ task, onClick }) {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const isInteractive = typeof onClick === 'function';

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50';
      case 'high':
        return 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50';
      default:
        return 'bg-slate-50 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={isInteractive ? { y: -3, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)' } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`p-4 bg-white dark:bg-slate-900 border rounded-xl transition-colors ${
        isInteractive 
          ? 'cursor-pointer' 
          : ''
      } ${
        isOverdue 
          ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20 shadow-sm' 
          : 'border-slate-200/80 dark:border-slate-800 shadow-sm'
      }`}
    >
      {/* Title */}
      <h4 className="font-bold text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors text-sm leading-snug mb-3.5 line-clamp-2 tracking-tight">
        {task.title}
      </h4>

      {/* Footer / Row */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        
        {/* Date */}
        <div className="flex items-center gap-1.5 min-h-[24px]">
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-[11px] font-semibold ${
              isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}>
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Priority & Assignee Container */}
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-full uppercase ${getPriorityClasses(task.priority)}`}>
            {task.priority}
          </span>

          {task.assignedTo && (
            <div 
              title={`Assigned to ${task.assignedTo.name}`}
              className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-700 flex items-center justify-center text-white text-[10px] font-black shadow-md border border-white dark:border-slate-900"
            >
              {task.assignedTo.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
      </div>
    </motion.div>
  );
}
