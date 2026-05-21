const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const clientDir = path.join(__dirname, '../client');
const clientBuildPath = path.join(clientDir, 'dist/index.html');

const ensureClientBuild = () => {
  if (fs.existsSync(clientBuildPath)) {
    console.log(`✓ Client build detected at ${clientBuildPath}`);
    return;
  }

  console.warn('Client build not found. Building frontend before starting server...');

  const result = spawnSync('npm', ['run', 'build'], {
    cwd: clientDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0 || !fs.existsSync(clientBuildPath)) {
    console.error('✗ Frontend build failed or dist/index.html is still missing.');
    process.exit(result.status || 1);
  }

  console.log(`✓ Client build created at ${clientBuildPath}`);
};

ensureClientBuild();
require('./index');
