import React, { useState, useEffect, useContext } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, FolderGit2, CheckCircle2, Shield, Activity, ListTodo, Star, Sparkles } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import Loader from '../components/Loader';
import EmptyStateComponent from '../components/EmptyState';

const statusClasses = {
  todo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50',
  'in-progress': 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50',
  done: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50',
};

const priorityClasses = {
  low: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/50',
  medium: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-450 border border-amber-200/50 dark:border-amber-900/40',
  high: 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-455 border border-rose-200/50 dark:border-rose-900/40',
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : 'No due date');

const isOverdue = (task) => {
  if (!task?.dueDate || task.status === 'done') return false;
  return new Date(task.dueDate) < new Date();
};

// Polished reusable EmptyState proxy
function EmptyState({ message, iconName = 'Inbox' }) {
  return (
    <EmptyStateComponent 
      iconName={iconName}
      title="No active items"
      description={message}
    />
  );
}

// Interactive Recharts widgets
function DashboardCharts({ stats, isMember = false }) {
  const { theme } = useContext(ThemeContext);
  
  // 1. Task Breakdown data (Pie/Doughnut)
  const doneVal = isMember ? stats.myCompletedCount || 0 : stats.doneCount || 0;
  const progressVal = isMember ? (stats.assignedToMeCount - stats.myCompletedCount - stats.myPendingCount) || 0 : stats.inProgressCount || 0;
  const pendingVal = isMember ? stats.myPendingCount || 0 : Math.max(0, stats.totalTasks - stats.doneCount - stats.inProgressCount);

  const taskData = [
    { name: 'To Do / Backlog', value: pendingVal, color: '#4f46e5' },
    { name: 'In Progress', value: Math.max(0, progressVal), color: '#f59e0b' },
    { name: 'Completed', value: doneVal, color: '#10b981' },
  ].filter(d => d.value > 0);

  const totalSum = isMember ? stats.assignedToMeCount || 0 : stats.totalTasks || 0;
  const hasTasks = totalSum > 0;

  // 2. Project progress data (Bar)
  const projectData = (stats.projectSummaries || []).map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 13) + '..' : p.name,
    'Completed': p.completedTasks || 0,
    'Total': p.taskCount || 0,
  }));

  const hasProjects = projectData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Pie Chart Panel */}
      <div className="lg:col-span-1 glassmorphism rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-50/10 dark:from-indigo-950/10 to-transparent pointer-events-none" />
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Task Allocation
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 tracking-wide mt-1">Breakdown of current task loading</p>
        </div>

        {hasTasks ? (
          <div className="h-52 relative flex items-center justify-center mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={76}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', 
                    border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
                  }}
                  itemStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#0f172a', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Core absolute counter */}
            <div className="absolute text-center">
              <p className="text-2xl font-black text-slate-900 dark:text-white">{totalSum}</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Total</p>
            </div>
          </div>
        ) : (
          <div className="h-52 flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400 text-xs">No tasks registered yet</p>
          </div>
        )}

        {hasTasks && (
          <div className="flex flex-wrap justify-center gap-3 text-[10px] font-bold mt-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            {taskData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600 dark:text-slate-400">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bar Chart Panel */}
      <div className="lg:col-span-2 glassmorphism rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50/10 dark:from-indigo-950/10 to-transparent pointer-events-none" />
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Project Metrics
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 tracking-wide mt-1">Comparative tasks workload vs completions</p>
        </div>

        {hasProjects ? (
          <div className="h-52 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} opacity={0.5} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={10} tickLine={false} />
                <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', 
                    border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
                  }}
                  itemStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#0f172a', fontSize: 12 }}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 10, color: theme === 'dark' ? '#94a3b8' : '#64748b' }} />
                <Bar dataKey="Total" fill="#4f46e5" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Completed" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-52 flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400 text-xs">No active project metrics found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RecentTasksTable({ tasks, emptyMessage }) {
  return tasks.length === 0 ? (
    <EmptyState message={emptyMessage} iconName="ClipboardX" />
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title</th>
            <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Project</th>
            <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
            <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Priority</th>
            <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task._id}
              className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${
                isOverdue(task) ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''
              }`}
            >
              <td className="py-3.5 px-4 text-slate-900 dark:text-slate-100 text-sm font-semibold">{task.title}</td>
              <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs font-medium">{task.project?.name || 'N/A'}</td>
              <td className="py-3.5 px-4">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    statusClasses[task.status] || statusClasses.todo
                  }`}
                >
                  {task.status.replace('-', ' ')}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    priorityClasses[task.priority] || priorityClasses.medium
                  }`}
                >
                  {task.priority}
                </span>
              </td>
              <td
                className={`py-3.5 px-4 text-xs font-medium ${
                  isOverdue(task) ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500 dark:text-slate-400'
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
    <EmptyState message="No projects available yet" iconName="FolderPlus" />
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {projects.map((project) => (
        <div
          key={project._id}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-300 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">{project.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                {project.description || 'No description provided'}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 px-3 py-2 text-right min-w-[90px]">
              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Completed</p>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-450 mt-0.5">
                {project.completedTasks}/{project.taskCount}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-slate-50/60 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Team Size</p>
                <p className="mt-1 text-xl font-extrabold text-slate-800 dark:text-slate-200">{project.memberCount}</p>
              </div>
              <Users className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            </div>
            <div className="rounded-xl bg-slate-50/60 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Total Tasks</p>
                <p className="mt-1 text-xl font-extrabold text-slate-800 dark:text-slate-200">{project.taskCount}</p>
              </div>
              <Activity className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamList({ members }) {
  // Extract initials for profiles
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return members.length === 0 ? (
    <EmptyState message="No team members found" iconName="Users2" />
  ) : (
    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
      {members.map((member) => (
        <div
          key={member._id}
          className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 px-4 py-3 transition-all duration-300 shadow-sm group"
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Initials Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-50 dark:from-indigo-950/20 to-slate-100 dark:to-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs flex items-center justify-center shrink-0 group-hover:border-indigo-200 transition-colors">
              {getInitials(member.name)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{member.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{member.email}</p>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
              member.role === 'admin'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
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
      {/* Welcome Banner */}
      <div className="mb-8 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-50/40 dark:from-indigo-950/10 via-slate-50 dark:via-slate-900 to-violet-50/20 dark:to-violet-950/10 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/[0.03] rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>System Administrator Control</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          Monitor deliveries, audit recent developer sprint actions, manage active projects, and keep all pipelines active.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total Projects" count={stats.projectCount} color="indigo" />
        <StatCard title="Team Directory" count={stats.memberCount} color="slate" />
        <StatCard title="Total Tasks" count={stats.totalTasks} color="amber" />
        <StatCard title="In Progress" count={stats.inProgressCount} color="amber" />
        <StatCard title="Done" count={stats.doneCount} color="green" />
        <StatCard title="Overdue Work" count={stats.overdueCount} color="red" />
      </div>

      {/* Analytics Charts Panel */}
      <DashboardCharts stats={stats} />

      {/* Primary Data Directory grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6 mb-8">
        <section className="glassmorphism rounded-2xl p-6 shadow-sm relative">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Project Portfolio</h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-300 font-bold">
              {stats.projectSummaries?.length || 0}
            </span>
          </div>
          <ProjectSummaryGrid projects={stats.projectSummaries} />
        </section>
        
        <section className="glassmorphism rounded-2xl p-6 shadow-sm relative">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Team Directory</h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-300 font-bold">
              {stats.teamMembers?.length || 0}
            </span>
          </div>
          <TeamList members={stats.teamMembers || []} />
        </section>
      </div>

      {/* Active task activity lists */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <section className="glassmorphism rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-5">Recent Task Activity</h2>
          <RecentTasksTable tasks={stats.recentTasks} emptyMessage="No task activity found in this workspace" />
        </section>
        
        <section className="glassmorphism rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Urgent Attention</h2>
            {stats.overdueTasks?.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-[10px] text-rose-700 dark:text-rose-400 font-bold animate-pulse">
                Overdue
              </span>
            )}
          </div>
          {stats.overdueTasks?.length ? (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {stats.overdueTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          ) : (
            <EmptyState message="No overdue tasks in active pipelines" iconName="CheckSquare" />
          )}
        </section>
      </div>
    </>
  );
}

function MemberView({ stats, user }) {
  return (
    <>
      {/* Welcome Banner */}
      <div className="mb-8 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-gradient-to-r from-emerald-50/40 dark:from-emerald-950/10 via-slate-50 dark:via-slate-900 to-teal-50/20 dark:to-teal-950/10 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.02] rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <Star className="w-3.5 h-3.5" />
          <span>Member Workspace Focus</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Hi {user?.name}, here's your focus
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          Stay on top of your assigned tasks, monitor upcoming milestones, and collaborate across project domains.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <StatCard title="My Workload" count={stats.assignedToMeCount || 0} color="indigo" />
        <StatCard title="Pending Work" count={stats.myPendingCount || 0} color="red" />
        <StatCard title="My Completed" count={stats.myCompletedCount || 0} color="green" />
        <StatCard title="Total Projects" count={stats.projectCount} color="slate" />
        <StatCard title="In Progress" count={stats.inProgressCount} color="amber" />
        <StatCard title="Overdue Work" count={stats.overdueCount} color="red" />
      </div>

      {/* Analytics Charts Panel */}
      <DashboardCharts stats={stats} isMember={true} />

      {/* Member content boards */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 mb-8">
        <section className="glassmorphism rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-5">Assigned To Me</h2>
          {stats.myTasks?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
              {stats.myTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          ) : (
            <EmptyState message="No tasks currently assigned to you" iconName="ClipboardCheck" />
          )}
        </section>
        
        <section className="glassmorphism rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-5">My Projects</h2>
          <ProjectSummaryGrid projects={stats.projectSummaries} />
        </section>
      </div>

      {/* Activity listing */}
      <section className="glassmorphism rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-5">Recent Team Activity</h2>
        <RecentTasksTable tasks={stats.recentTasks} emptyMessage="No recent workspace activity to display" />
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
        setLoading(true);
        const response = await api.get('/tasks/dashboard');
        setStats(response.data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <Loader message="Loading dashboard workspace..." />;
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <EmptyStateComponent 
          iconName="ServerCrash" 
          title="Connection Failure"
          description="We were unable to load workspace parameters from the secure server database."
        />
      </div>
    );
  }

  const activeRole = forcedRole || stats.role || user?.role;

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 font-sans">
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
