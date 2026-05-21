const express = require('express');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

const router = express.Router();

router.use(authMiddleware);

// Get all projects where user is owner or member
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    }).populate('members', 'name email');

    return res.status(200).json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({ message: 'Server error fetching projects' });
  }
});

// Create new project (admin only)
router.post('/', roleMiddleware('admin'), async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = new Project({
      name,
      description: description || '',
      owner: req.user.id,
      members: [req.user.id],
    });

    await project.save();
    await project.populate('members', 'name email');

    return res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ message: 'Server error creating project' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'members',
      'name email role'
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some((m) => m._id.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error('Get project error:', error);
    return res.status(500).json({ message: 'Server error fetching project' });
  }
});

// Update project (admin only)
router.put('/:id', roleMiddleware('admin'), async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.name = name || project.name;
    project.description = description !== undefined ? description : project.description;

    await project.save();
    await project.populate('members', 'name email');

    return res.status(200).json(project);
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ message: 'Server error updating project' });
  }
});

// Delete project (admin only)
router.delete('/:id', roleMiddleware('admin'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Task.deleteMany({ project: req.params.id });

    await Project.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Project and its tasks deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ message: 'Server error deleting project' });
  }
});

// Add member to project (admin only)
router.post('/:id/members', roleMiddleware('admin'), async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some((m) => m.toString() === user._id.toString());
    if (isMember) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    project.members.push(user._id);
    await project.save();
    await project.populate('members', 'name email');

    return res.status(200).json(project);
  } catch (error) {
    console.error('Add member error:', error);
    return res.status(500).json({ message: 'Server error adding member' });
  }
});

// Remove member from project (admin only)
router.delete('/:id/members/:userId', roleMiddleware('admin'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.members = project.members.filter(
      (m) => m.toString() !== req.params.userId
    );

    await project.save();
    await project.populate('members', 'name email');

    return res.status(200).json(project);
  } catch (error) {
    console.error('Remove member error:', error);
    return res.status(500).json({ message: 'Server error removing member' });
  }
});

module.exports = router;
