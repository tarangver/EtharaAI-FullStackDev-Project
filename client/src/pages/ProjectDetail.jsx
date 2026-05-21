import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../api/axios';
import toast from 'react-hot-toast';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { ArrowLeft, Users, Sparkles, UserPlus, Trash2, ListTodo, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';

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

  // Implement handleDragEnd for Kanban Board updates
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Drop outside standard columns
    if (!destination) return;

    // Placed in same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskId = draggableId;
    const newStatus = destination.droppableId;
    const originalTasks = [...tasks];

    // Optimistic UI status movement immediately
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    // Call REST endpoint updating status partially
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Task status updated successfully!');
    } catch (error) {
      // Revert changes on failed save
      setTasks(originalTasks);
      toast.error('Failed to update task status. Reverted move.');
    }
  };

  if (loading) {
    return <Loader message="Synchronizing project workspace..." />;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <EmptyState
          iconName="AlertTriangle"
          title="Project not found"
          description="The requested project space could not be found, or you do not have permission to access it."
          actionText="Back to Projects"
          onAction={() => navigate('/projects')}
        />
      </div>
    );
  }

  const todoTasks = getTasksByStatus('todo');
  const inProgressTasks = getTasksByStatus('in-progress');
  const doneTasks = getTasksByStatus('done');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans relative overflow-x-hidden">
      {/* Background Gradient decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.02),transparent_45%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Projects
          </button>
        </div>

        {/* Project Header Card */}
        <div className="mb-8 glassmorphism rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-100/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 tracking-widest bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">Active Workspace</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2.5 mb-3">
                {project.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-3xl">
                {project.description || 'No description provided for this project.'}
              </p>
            </div>
            
            <button
              onClick={() => {
                setSelectedTask(null);
                setShowTaskModal(true);
              }}
              className="btn-primary flex items-center gap-2 !py-2.5 !px-5 !rounded-xl self-start md:self-auto shrink-0 shadow-lg shadow-indigo-600/10"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Members / Team Collaboration */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
            <h2 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Collaborators ({project.members.length})
            </h2>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex flex-wrap gap-2.5">
                {project.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-full pl-2 pr-3.5 py-1.5 transition-all duration-200 shadow-sm group"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-700 flex items-center justify-center text-white text-[10px] font-black shadow-md">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 text-xs font-semibold">{member.name}</span>
                    {isAdmin && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        title="Remove team member"
                        className="ml-1 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors focus:outline-none"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isAdmin && (
                <form onSubmit={handleAddMember} className="flex gap-2 w-full lg:max-w-md shrink-0">
                  <div className="relative flex-1">
                    <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="Add member by email..."
                      className="premium-input !pl-10 !py-2.5 text-xs focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={addingMember}
                    className="btn-secondary font-bold text-xs uppercase tracking-wider !rounded-xl !px-5"
                  >
                    {addingMember ? 'Adding...' : 'Add'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* DragDropContext wraps Kanban Board Columns Grid */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* To Do Column */}
            <div className="bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 flex flex-col min-h-[450px]">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-5 pb-3 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)]" />
                  <span>To Do</span>
                </span>
                <span className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 rounded-full shadow-sm">
                  {todoTasks.length}
                </span>
              </h3>
              
              <Droppable droppableId="todo">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3.5 flex-1 overflow-y-auto max-h-[600px] pr-1 transition-colors duration-200 rounded-lg ${
                      snapshot.isDraggingOver ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    {todoTasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(providedDraggable, snapshotDraggable) => (
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                            style={{
                              ...providedDraggable.draggableProps.style,
                              opacity: snapshotDraggable.isDragging ? 0.9 : 1,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onClick={() => handleTaskClick(task)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {todoTasks.length === 0 && (
                      <EmptyState
                        compact={true}
                        iconName="ListTodo"
                        title="Column is Empty"
                        description="No tasks are currently listed as pending."
                      />
                    )}
                  </div>
                )}
              </Droppable>
            </div>

            {/* In Progress Column */}
            <div className="bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 flex flex-col min-h-[450px]">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-5 pb-3 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                  <span>In Progress</span>
                </span>
                <span className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 rounded-full shadow-sm">
                  {inProgressTasks.length}
                </span>
              </h3>
              
              <Droppable droppableId="in-progress">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3.5 flex-1 overflow-y-auto max-h-[600px] pr-1 transition-colors duration-200 rounded-lg ${
                      snapshot.isDraggingOver ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''
                    }`}
                  >
                    {inProgressTasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(providedDraggable, snapshotDraggable) => (
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                            style={{
                              ...providedDraggable.draggableProps.style,
                              opacity: snapshotDraggable.isDragging ? 0.9 : 1,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onClick={() => handleTaskClick(task)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {inProgressTasks.length === 0 && (
                      <EmptyState
                        compact={true}
                        iconName="Activity"
                        title="Column is Empty"
                        description="No active tasks in progress."
                      />
                    )}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Done Column */}
            <div className="bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 flex flex-col min-h-[450px]">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-5 pb-3 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                  <span>Done</span>
                </span>
                <span className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 rounded-full shadow-sm">
                  {doneTasks.length}
                </span>
              </h3>
              
              <Droppable droppableId="done">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3.5 flex-1 overflow-y-auto max-h-[600px] pr-1 transition-colors duration-200 rounded-lg ${
                      snapshot.isDraggingOver ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''
                    }`}
                  >
                    {doneTasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(providedDraggable, snapshotDraggable) => (
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                            style={{
                              ...providedDraggable.draggableProps.style,
                              opacity: snapshotDraggable.isDragging ? 0.9 : 1,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onClick={() => handleTaskClick(task)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {doneTasks.length === 0 && (
                      <EmptyState
                        compact={true}
                        iconName="CheckCircle2"
                        title="Column is Empty"
                        description="No completed tasks to display."
                      />
                    )}
                  </div>
                )}
              </Droppable>
            </div>

          </div>
        </DragDropContext>
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
