const express = require('express');
const authMiddleware = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');

const router = express.Router();

router.use(authMiddleware);

// Get dashboard stats (MUST be before /:id route)
router.get('/dashboard', async (req, res) => {
  try {
    const userProjects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    }).populate('members', 'name email role');

    const projectIds = userProjects.map((p) => p._id);

    const tasks = await Task.find({
      project: { $in: projectIds },
    })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name');

    const totalTasks = tasks.length;
    const todoCount = tasks.filter((t) => t.status === 'todo').length;
    const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
    const doneCount = tasks.filter((t) => t.status === 'done').length;

    const now = new Date();
    const overdueCount = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done'
    ).length;

    const recentTasks = tasks
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const projectSummaries = userProjects.map((project) => {
      const projectTasks = tasks.filter(
        (task) => task.project?._id.toString() === project._id.toString()
      );
      const completedTasks = projectTasks.filter((task) => task.status === 'done').length;

      return {
        _id: project._id,
        name: project.name,
        description: project.description,
        memberCount: project.members.length,
        taskCount: projectTasks.length,
        completedTasks,
      };
    });

    const uniqueMembers = new Map();
    userProjects.forEach((project) => {
      project.members.forEach((member) => {
        uniqueMembers.set(member._id.toString(), {
          _id: member._id,
          name: member.name,
          email: member.email,
          role: member.role,
        });
      });
    });

    const assignedToMe = tasks.filter(
      (task) => task.assignedTo?._id?.toString() === req.user.id
    );

    const payload = {
      role: req.user.role,
      totalTasks,
      todoCount,
      inProgressCount,
      doneCount,
      overdueCount,
      recentTasks,
      projectCount: userProjects.length,
      projectSummaries,
    };

    if (req.user.role === 'admin') {
      payload.memberCount = uniqueMembers.size;
      payload.teamMembers = Array.from(uniqueMembers.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      payload.overdueTasks = tasks
        .filter((task) => task.dueDate && new Date(task.dueDate) < now && task.status !== 'done')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 6);
    } else {
      payload.assignedToMeCount = assignedToMe.length;
      payload.myPendingCount = assignedToMe.filter((task) => task.status !== 'done').length;
      payload.myCompletedCount = assignedToMe.filter((task) => task.status === 'done').length;
      payload.myTasks = assignedToMe
        .sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
          return dateA - dateB;
        })
        .slice(0, 6);
    }

    return res.status(200).json(payload);
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

// Get tasks by project
router.get('/', async (req, res) => {
  try {
    const { project: projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some((m) => m.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    return res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, assignedTo } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: 'Title and project are required' });
    }

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isOwner = projectDoc.owner.toString() === req.user.id;
    const isMember = projectDoc.members.some((m) => m.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const task = new Task({
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      project,
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
    });

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    return res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({ message: 'Server error creating task' });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some((m) => m.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error('Get task error:', error);
    return res.status(500).json({ message: 'Server error fetching task' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some((m) => m.toString() === req.user.id);
    const isCreator = task.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    // Members can only update status
    if (!isAdmin && !isCreator && !isOwner) {
      task.status = status || task.status;
    } else {
      // Admin or creator can update all fields
      task.title = title || task.title;
      task.description = description !== undefined ? description : task.description;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
      task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
    }

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    return res.status(200).json(task);
  } catch (error) {
    console.error('Update task error:', error);
    return res.status(500).json({ message: 'Server error updating task' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isCreator = task.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    return res.status(500).json({ message: 'Server error deleting task' });
  }
});

module.exports = router;
