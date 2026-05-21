import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-black text-indigo-600 dark:text-indigo-400 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
          The page you're looking for doesn't exist or has been shifted.
        </p>
        <Link
          to="/dashboard"
          className="btn-primary inline-block"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
