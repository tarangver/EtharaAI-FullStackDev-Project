import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FolderPlus, Users, Activity, Sparkles, FolderKanban } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [taskCounts, setTaskCounts] = useState({});
  const { isAdmin } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data);

      // Fetch task counts for each project
      const counts = {};
      for (const project of response.data) {
        try {
          const tasksResponse = await api.get(`/tasks?project=${project._id}`);
          counts[project._id] = tasksResponse.data.length;
        } catch (error) {
          counts[project._id] = 0;
        }
      }
      setTaskCounts(counts);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    setCreating(true);
    try {
      await api.post('/projects', formData);
      toast.success('Project created successfully!');
      setFormData({ name: '', description: '' });
      setShowCreateModal(false);
      fetchProjects();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create project';
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <Loader message="Loading your projects..." />;
  }

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 font-sans relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.02),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header section */}
        <div className="flex justify-between items-center mb-10 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <FolderKanban className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              Projects Portfolio
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 leading-relaxed">
              Organize sprints, aggregate issues, and collaborate across team members.
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2 !py-2.5 !px-5 !rounded-xl"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          )}
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="w-full max-w-md glassmorphism rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-slate-200 dark:border-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-500/5 dark:from-indigo-500/10 to-transparent pointer-events-none" />
              
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5 mb-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Create Project
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">Establish a secure developer space for tasks</p>
              
              <form onSubmit={handleCreateProject} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="premium-input !pl-4 focus:border-indigo-500 focus:ring-indigo-500/10"
                    placeholder="e.g. Core App Engine"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="premium-input !pl-4 focus:border-indigo-500 focus:ring-indigo-500/10 resize-none h-24"
                    placeholder="Detail the sprint goals..."
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={creating}
                    className="btn-primary flex-1 !rounded-xl !py-2.5"
                  >
                    {creating ? 'Creating...' : 'Create Project'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary flex-1 !rounded-xl !py-2.5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects Grid / Empty State */}
        {projects.length === 0 ? (
          <EmptyState
            iconName="FolderPlus"
            title="No active projects"
            description="Establish a new workspace project to start assigning team tasks and tracking pipeline milestones."
            actionText={isAdmin ? "Create your first project" : undefined}
            onAction={isAdmin ? () => setShowCreateModal(true) : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="glassmorphism rounded-2xl p-6 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 dark:from-indigo-500/10 to-transparent pointer-events-none" />
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                  {project.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 mb-5 line-clamp-2 leading-relaxed min-h-[32px]">
                  {project.description || 'No description provided for this project.'}
                </p>
                
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 relative">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-800 dark:text-slate-200 text-sm font-black">{project.members.length}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Members</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-800 dark:text-slate-200 text-sm font-black">{taskCounts[project._id] || 0}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Tasks</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
