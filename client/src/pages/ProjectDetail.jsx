import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { AuthContext } from '../context/AuthContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  const fetchProjectDetail = async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?project=${id}`),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) {
      toast.error('Email is required');
      return;
    }

    setAddingMember(true);
    try {
      const response = await api.post(`/projects/${id}/members`, {
        email: newMemberEmail,
      });
      setProject(response.data);
      setNewMemberEmail('');
      toast.success('Member added successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add member';
      toast.error(message);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const response = await api.delete(`/projects/${id}/members/${userId}`);
      setProject(response.data);
      toast.success('Member removed successfully!');
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleTaskSuccess = () => {
    fetchProjectDetail();
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 md:p-8">
        <div className="space-y-4">
          <div className="h-12 bg-slate-800 rounded-lg animate-pulse w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-slate-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Project not found</p>
      </div>
    );
  }

  const todoTasks = getTasksByStatus('todo');
  const inProgressTasks = getTasksByStatus('in-progress');
  const doneTasks = getTasksByStatus('done');

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">{project.name}</h1>
          <p className="text-slate-400 mb-6">{project.description}</p>

          {/* Members Section */}
          <div className="bg-slate-900 rounded-lg border border-slate-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Team Members</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-2"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-100 text-sm">{member.name}</span>
                  {isAdmin && (
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="ml-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isAdmin && (
              <form onSubmit={handleAddMember} className="flex gap-2">
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Add member by email"
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
                <button
                  type="submit"
                  disabled={addingMember}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 text-sm"
                >
                  {addingMember ? 'Adding...' : 'Add'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setSelectedTask(null);
              setShowTaskModal(true);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            + Add Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* To Do Column */}
          <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
            <h3 className="text-lg font-semibold text-slate-300 mb-4 pb-2 border-b border-slate-700">
              <span className="text-slate-500 mr-2">●</span>To Do ({todoTasks.length})
            </h3>
            <div className="space-y-3">
              {todoTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onClick={() => handleTaskClick(task)}
                />
              ))}
              {todoTasks.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-8">No tasks</p>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
            <h3 className="text-lg font-semibold text-slate-300 mb-4 pb-2 border-b border-slate-700">
              <span className="text-amber-400 mr-2">●</span>In Progress (
              {inProgressTasks.length})
            </h3>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onClick={() => handleTaskClick(task)}
                />
              ))}
              {inProgressTasks.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-8">No tasks</p>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
            <h3 className="text-lg font-semibold text-slate-300 mb-4 pb-2 border-b border-slate-700">
              <span className="text-green-400 mr-2">●</span>Done ({doneTasks.length})
            </h3>
            <div className="space-y-3">
              {doneTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onClick={() => handleTaskClick(task)}
                />
              ))}
              {doneTasks.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-8">No tasks</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          projectId={id}
          projectMembers={project.members}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onSuccess={handleTaskSuccess}
        />
      )}
    </div>
  );
}
