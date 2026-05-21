import React from 'react';

export default function Loader({ fullScreen = true, message = 'Loading your workspace...' }) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md'
    : 'flex flex-col items-center justify-center py-12 w-full';

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing halo ring */}
        <div className="w-16 h-16 rounded-full border-2 border-indigo-500/10 border-t-indigo-600 animate-spin" />
        
        {/* Inner reverse-spinning halo ring */}
        <div className="absolute w-10 h-10 rounded-full border-2 border-violet-500/10 border-b-violet-600 animate-spin [animation-direction:reverse] [animation-duration:0.8s]" />
        
        {/* Glowing core orb */}
        <div className="absolute w-3.5 h-3.5 rounded-full bg-indigo-600 blur-[2px] animate-pulse" />
      </div>
      
      {/* Loading message */}
      <p className="mt-5 text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wider uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
}
