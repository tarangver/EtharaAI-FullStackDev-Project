import React from 'react';
import * as Icons from 'lucide-react';

export default function EmptyState({ 
  iconName = 'FolderOpen', 
  title = 'No data available', 
  description = 'There is currently no information to display.', 
  actionText, 
  onAction,
  compact = false
}) {
  // Resolve Lucide icon dynamically from the lucide-react library
  const IconComponent = Icons[iconName] || Icons.FolderOpen;

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-100/50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800/60 py-8 animate-in fade-in duration-200">
        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3 shadow-sm">
          <IconComponent className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 tracking-tight">{title}</h4>
        {description && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-[180px] mx-auto leading-relaxed">{description}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glassmorphism rounded-2xl max-w-md mx-auto my-6 animate-in fade-in duration-300">
      
      {/* Floating Animated Icon Container */}
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5 animate-float shadow-sm">
        <IconComponent className="w-7 h-7" />
      </div>

      {/* Typography */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-sm">
        {description}
      </p>

      {/* Action Button */}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn-primary mt-6 !py-2.5 !px-5 text-sm !rounded-xl"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
