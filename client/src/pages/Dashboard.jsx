import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import { AuthContext } from '../context/AuthContext';

const statusClasses = {
  todo: 'bg-slate-700 text-slate-200',
  'in-progress': 'bg-amber-900 text-amber-200',
  done: 'bg-green-900 text-green-200',
};

const priorityClasses = {
  low: 'bg-green-900 text-green-200',
  medium: 'bg-yellow-900 text-yellow-200',
  high: 'bg-red-900 text-red-200',
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : 'No due date');

const isOverdue = (task) => {
  if (!task?.dueDate || task.status === 'done') return false;
  return new Date(task.dueDate) < new Date();
};

function EmptyState({ message }) {
  return <p className="text-slate-400 py-8 text-center">{message}</p>;
}

function RecentTasksTable({ tasks, emptyMessage }) {
  return tasks.length === 0 ? (
    <EmptyState message={emptyMessage} />
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-3 px-4 text-slate-400 font-medium">Title</th>
            <th className="text-left py-3 px-4 text-slate-400 font-medium">Project</th>
            <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
            <th className="text-left py-3 px-4 text-slate-400 font-medium">Priority</th>
            <th className="text-left py-3 px-4 text-slate-400 font-medium">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task._id}
              className={`border-b border-slate-700 hover:bg-slate-800 transition-colors ${
                isOverdue(task) ? 'bg-red-950 bg-opacity-20' : ''
              }`}
            >
              <td className="py-3 px-4 text-slate-100">{task.title}</td>
              <td className="py-3 px-4 text-slate-300 text-sm">{task.project?.name || 'N/A'}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusClasses[task.status] || statusClasses.todo
                  }`}
                >
                  {task.status.replace('-', ' ')}
                </span>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    priorityClasses[task.priority] || priorityClasses.medium
                  }`}
                >
                  {task.priority}
                </span>
              </td>
              <td
                className={`py-3 px-4 text-sm ${
                  isOverdue(task) ? 'text-red-400 font-medium' : 'text-slate-400'
                }`}
              >
                {formatDate(task.dueDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProjectSummaryGrid({ projects }) {
  return projects.length === 0 ? (
    <EmptyState message="No projects available yet" />
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {projects.map((project) => (
        <div
          key={project._id}
          className="rounded-xl border border-slate-700 bg-slate-900/80 p-5"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">{project.name}</h3>
              <p className="text-sm text-slate-400 mt-1">
                {project.description || 'No description provided'}
              </p>
            </div>
            <div className="rounded-lg bg-slate-800 px-3 py-2 text-right">
              <p className="text-xs uppercase tracking-wide text-slate-500">Completed</p>
              <p className="text-lg font-semibold text-emerald-300">
                {project.completedTasks}/{project.taskCount}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-800 px-4 py-3">
              <p className="text-slate-400">Members</p>
              <p className="mt-1 text-2xl font-bold text-slate-100">{project.memberCount}</p>
            </div>
            <div className="rounded-lg bg-slate-800 px-4 py-3">
              <p className="text-slate-400">Tasks</p>
              <p className="mt-1 text-2xl font-bold text-slate-100">{project.taskCount}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamList({ members }) {
  return members.length === 0 ? (
    <EmptyState message="No team members found" />
  ) : (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member._id}
          className="flex items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3"
        >
          <div className="min-w-0">
            <p className="font-medium text-slate-100">{member.name}</p>
            <p className="text-sm text-slate-400 truncate">{member.email}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
              member.role === 'admin'
                ? 'bg-indigo-900 text-indigo-200'
                : 'bg-slate-700 text-slate-200'
            }`}
          >
            {member.role}
          </span>
        </div>
      ))}
    </div>
  );
}

function AdminView({ stats, user }) {
  return (
    <>
      <div className="mb-8 rounded-2xl border border-indigo-700/40 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-indigo-300">Admin Control</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-100">Welcome back, {user?.name}</h1>
        <p className="mt-2 max-w-3xl text-slate-300">
          Track delivery, unblock overdue work, and keep every active project staffed.
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Projects" count={stats.projectCount} color="indigo" />
        <StatCard title="Team Members" count={stats.memberCount} color="slate" />
        <StatCard title="Total Tasks" count={stats.totalTasks} color="amber" />
        <StatCard title="In Progress" count={stats.inProgressCount} color="amber" />
        <StatCard title="Done" count={stats.doneCount} color="green" />
        <StatCard title="Overdue" count={stats.overdueCount} color="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6 mb-8">
        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Project Portfolio</h2>
          <ProjectSummaryGrid projects={stats.projectSummaries} />
        </section>
        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Team Directory</h2>
          <TeamList members={stats.teamMembers || []} />
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Recent Task Activity</h2>
          <RecentTasksTable tasks={stats.recentTasks} emptyMessage="No task activity yet" />
        </section>
        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Urgent Attention</h2>
          {stats.overdueTasks?.length ? (
            <div className="space-y-3">
              {stats.overdueTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          ) : (
            <EmptyState message="No overdue tasks right now" />
          )}
        </section>
      </div>
    </>
  );
}

function MemberView({ stats, user }) {
  return (
    <>
      <div className="mb-8 rounded-2xl border border-emerald-700/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Member Workspace</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-100">Hi {user?.name}, here's your focus</h1>
        <p className="mt-2 max-w-3xl text-slate-300">
          Stay on top of assigned work, watch upcoming deadlines, and keep your projects moving.
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="My Tasks" count={stats.assignedToMeCount || 0} color="indigo" />
        <StatCard title="Pending" count={stats.myPendingCount || 0} color="red" />
        <StatCard title="Completed" count={stats.myCompletedCount || 0} color="green" />
        <StatCard title="Projects" count={stats.projectCount} color="slate" />
        <StatCard title="In Progress" count={stats.inProgressCount} color="amber" />
        <StatCard title="Overdue" count={stats.overdueCount} color="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 mb-8">
        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Assigned To Me</h2>
          {stats.myTasks?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.myTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          ) : (
            <EmptyState message="No tasks assigned to you yet" />
          )}
        </section>
        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">My Projects</h2>
          <ProjectSummaryGrid projects={stats.projectSummaries} />
        </section>
      </div>

      <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Recent Team Activity</h2>
        <RecentTasksTable tasks={stats.recentTasks} emptyMessage="No recent activity yet" />
      </section>
    </>
  );
}

export default function Dashboard({ forcedRole }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/tasks/dashboard');
        setStats(response.data);
      } catch (error) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 md:p-8">
        <div className="space-y-4">
          <div className="h-20 bg-slate-800 rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
          <div className="h-96 bg-slate-800 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  const activeRole = forcedRole || stats.role || user?.role;

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {activeRole === 'admin' ? (
          <AdminView stats={stats} user={user} />
        ) : (
          <MemberView stats={stats} user={user} />
        )}
      </div>
    </div>
  );
}
