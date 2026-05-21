import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Trash2, AlertTriangle, Calendar, User, List, Clock, X } from 'lucide-react';

export default function TaskModal({ task, projectId, projectMembers, onClose, onSuccess }) {
  const { user, isAdmin } = useContext(AuthContext);
  const isEditing = !!task;
  const isCreator = isEditing && task.createdBy?._id === user?.id;

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    assignedTo: task?.assignedTo?._id || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        assignedTo: formData.assignedTo || null,
      };

      if (isEditing) {
        await api.put(`/tasks/${task._id}`, payload);
        toast.success('Task updated successfully!');
      } else {
        await api.post('/tasks', {
          ...payload,
          project: projectId,
        });
        toast.success('Task created successfully!');
      }
      onSuccess();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success('Task deleted successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const canEditAll = isAdmin || isCreator;

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="w-full max-w-lg glassmorphism rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/[0.02] to-transparent pointer-events-none" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center transition-colors shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5 mb-2">
          {isEditing ? (
            <>
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Edit Task Details</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Create Workspace Task</span>
            </>
          )}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">
          {isEditing ? 'Modify sprint metrics, assignee, and state trackers' : 'Initialize a secure team issue inside the project'}
        </p>

        {showDeleteConfirm ? (
          <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl p-5 text-center my-6 animate-in zoom-in-95 duration-200 shadow-sm">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950 border border-rose-200 dark:border-rose-900 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-rose-900 dark:text-rose-200 mb-1">Confirm Deletion</h4>
            <p className="text-rose-700 dark:text-rose-450 text-xs mb-5 max-w-sm mx-auto leading-relaxed">
              Are you sure you want to delete this task? This action cannot be reverted and will remove the task completely.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="btn-primary !bg-gradient-to-r !from-rose-600 !to-red-600 hover:!from-rose-500 hover:!to-red-500 flex-1 !rounded-xl !py-2.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/10"
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1 !rounded-xl !py-2.5 text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                Task Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={!canEditAll}
                className={`premium-input !pl-4 focus:border-indigo-500 focus:ring-indigo-500/10 text-sm ${
                  errors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                }`}
                placeholder="e.g. Implement OIDC Client Handshake"
              />
              {errors.title && <p className="text-rose-600 dark:text-rose-400 text-xs mt-1 font-semibold">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={!canEditAll}
                className="premium-input !pl-4 focus:border-indigo-500 focus:ring-indigo-500/10 text-sm resize-none h-24"
                placeholder="Optional sprint details..."
              />
            </div>

            {/* Responsive Dual Column for Status and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <List className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="premium-input !pl-4 pr-10 cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm"
                >
                  <option value="todo" className="bg-white dark:bg-slate-900">To Do</option>
                  <option value="in-progress" className="bg-white dark:bg-slate-900">In Progress</option>
                  <option value="done" className="bg-white dark:bg-slate-900">Done</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={!canEditAll}
                  className="premium-input !pl-4 pr-10 cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm disabled:opacity-50"
                >
                  <option value="low" className="bg-white dark:bg-slate-900">Low</option>
                  <option value="medium" className="bg-white dark:bg-slate-900">Medium</option>
                  <option value="high" className="bg-white dark:bg-slate-900">High</option>
                </select>
              </div>
            </div>

            {/* Responsive Dual Column for Due Date and Assign To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  disabled={!canEditAll}
                  className="premium-input !pl-4 cursor-pointer text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <User className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  Assignee
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  disabled={!canEditAll}
                  className="premium-input !pl-4 pr-10 cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm disabled:opacity-50"
                >
                  <option value="" className="bg-white dark:bg-slate-900">Unassigned</option>
                  {projectMembers.map((member) => (
                    <option key={member._id} value={member._id} className="bg-white dark:bg-slate-900">
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 relative">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 !rounded-xl !py-2.5 text-xs font-bold uppercase tracking-wider"
              >
                {loading ? (isEditing ? 'Updating...' : 'Creating...') : isEditing ? 'Save Changes' : 'Create Task'}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary !rounded-xl !py-2.5 text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>

              {isEditing && (isAdmin || isCreator) && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-secondary !text-rose-600 hover:!bg-rose-50 dark:hover:!bg-rose-950/20 hover:!border-rose-200 dark:hover:!border-rose-900/50 border-transparent !rounded-xl !py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
