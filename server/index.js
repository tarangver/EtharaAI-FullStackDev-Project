require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_URL
      : 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const clientPath = path.join(__dirname, '../client/dist');
const hasClientBuild = fs.existsSync(path.join(clientPath, 'index.html'));

// Serve the built React app whenever the bundle exists.
if (hasClientBuild) {
  app.use(express.static(clientPath));

  // Catch-all route - serve index.html for all routes (AFTER API routes)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'API server is running',
      frontend: 'Client build not found. Run the frontend dev server or build the client for production.',
    });
  });
}

// Error handling for undefined routes in development
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const DEFAULT_PORT = Number(process.env.PORT) || 5000;
const MAX_PORT_ATTEMPTS = 10;

const startServer = (port, attempt = 0) => {
  const server = app.listen(port, () => {
    console.log(`✓ Server running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attempt < MAX_PORT_ATTEMPTS) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Trying port ${nextPort}...`);
      startServer(nextPort, attempt + 1);
      return;
    }

    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  });
};

startServer(DEFAULT_PORT);
