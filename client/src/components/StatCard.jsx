import React from 'react';

export default function StatCard({ title, count, color }) {
  const colorClasses = {
    indigo: 'bg-indigo-900 text-indigo-200',
    slate: 'bg-slate-800 text-slate-200',
    amber: 'bg-amber-900 text-amber-200',
    green: 'bg-green-900 text-green-200',
    red: 'bg-red-900 text-red-200',
  };

  const borderClasses = {
    indigo: 'border-indigo-700',
    slate: 'border-slate-700',
    amber: 'border-amber-700',
    green: 'border-green-700',
    red: 'border-red-700',
  };

  return (
    <div
      className={`${colorClasses[color]} border ${borderClasses[color]} rounded-lg p-6 text-center`}
    >
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className="text-4xl font-bold mt-2">{count}</p>
    </div>
  );
}
