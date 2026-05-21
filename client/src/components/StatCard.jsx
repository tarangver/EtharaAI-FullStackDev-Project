import React from 'react';
import { FolderGit2, CheckCircle2, Clock, AlertTriangle, Users, BarChart3 } from 'lucide-react';

export default function StatCard({ title, count, color }) {
  // Bind specific Lucide icons to state colors
  const icons = {
    indigo: FolderGit2,
    slate: Users,
    amber: Clock,
    green: CheckCircle2,
    red: AlertTriangle,
  };

  const IconComponent = icons[color] || BarChart3;

  // Custom border & neon glow classes - light theme premium edition with dark mode overrides
  const styles = {
    indigo: {
      border: 'border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-200 dark:hover:border-indigo-850/50',
      glow: 'shadow-indigo-500/5 dark:shadow-indigo-950/10',
      text: 'text-indigo-600 dark:text-indigo-400',
      bgIcon: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100/50 dark:border-indigo-900/30',
      progress: 'bg-indigo-600 dark:bg-indigo-500',
    },
    slate: {
      border: 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
      glow: 'shadow-slate-500/5 dark:shadow-slate-950/10',
      text: 'text-slate-700 dark:text-slate-300',
      bgIcon: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/50',
      progress: 'bg-slate-500 dark:bg-slate-400',
    },
    amber: {
      border: 'border-amber-100 dark:border-amber-900/50 hover:border-amber-200 dark:hover:border-amber-850/50',
      glow: 'shadow-amber-500/5 dark:shadow-amber-950/10',
      text: 'text-amber-600 dark:text-amber-400',
      bgIcon: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/30',
      progress: 'bg-amber-500 dark:bg-amber-400',
    },
    green: {
      border: 'border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-200 dark:hover:border-emerald-850/50',
      glow: 'shadow-emerald-500/5 dark:shadow-emerald-950/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      bgIcon: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30',
      progress: 'bg-emerald-500 dark:bg-emerald-400',
    },
    red: {
      border: 'border-rose-100 dark:border-rose-900/50 hover:border-rose-200 dark:hover:border-rose-850/50',
      glow: 'shadow-rose-500/5 dark:shadow-rose-950/10',
      text: 'text-rose-600 dark:text-rose-400',
      bgIcon: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100/50 dark:border-rose-900/30',
      progress: 'bg-rose-500 dark:bg-rose-400',
    },
  };

  const styleSet = styles[color] || styles.indigo;

  return (
    <div
      className={`glassmorphism rounded-2xl p-5 border ${styleSet.border} ${styleSet.glow} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group`}
    >
      {/* Visual background element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-100/10 dark:from-slate-800/10 to-transparent pointer-events-none" />

      <div className="flex justify-between items-start gap-4">
        <div className="text-left">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2 leading-none tracking-tight">
            {count}
          </p>
        </div>
        
        {/* Sleek icon indicator */}
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${styleSet.bgIcon}`}>
          <IconComponent className="w-5 h-5 group-hover:scale-105 transition-transform" />
        </div>
      </div>

      {/* Embedded progress bar */}
      <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-4.5 overflow-hidden">
        <div 
          className={`h-full rounded-full ${styleSet.progress} transition-all duration-1000`} 
          style={{ width: `${Math.min(100, Math.max(15, count * 6.5))}%` }}
        />
      </div>
    </div>
  );
}
