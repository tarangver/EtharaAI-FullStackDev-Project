# TaskFlow - Team Task Manager

A complete, production-ready team task management application built with Node.js, Express, React, and MongoDB. Successfully deployed on Railway with environment-based production configuration.

## Live Demo

Live Application:
https://etharaai-fullstackdev-project-production.up.railway.app

📁 Project Assets (Demo Video + Screenshots):   
[https://drive.google.com/drive/folders/1MYL6xguXJCMCwSZQoJKlZ0NO_-myqEox?usp=sharing](https://drive.google.com/drive/folders/1MYL6xguXJCMCwSZQoJKlZ0NO_-myqEox?usp=sharing)

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: Admin and Member roles with permission management
- **Project Management**: Create, manage, and collaborate on projects
- **Task Management**: Full CRUD operations on tasks with status tracking
- **Kanban Board**: Drag-and-drop style Kanban view (visual columns for To Do, In Progress, Done)
- **Dashboard Analytics**: Real-time statistics and recent task activity
- **Member Management**: Add/remove team members from projects
- **Task Assignment**: Assign tasks to team members
- **Due Date Tracking**: Set deadlines and track overdue tasks
- **Priority Levels**: Low, Medium, High priority task classification
- **Dark Professional UI**: Modern dark theme with Tailwind CSS
- **Fully Responsive**: Mobile-first design that works on all devices
- **Real-time Notifications**: Toast notifications for all user actions

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18.3.1 |
| **Frontend Build** | Vite | 5.3.1 |
| **Styling** | Tailwind CSS | 3.4.4 |
| **Backend** | Node.js + Express | 18.0.0+ / 4.19.2 |
| **Database** | MongoDB (Atlas) | Latest |
| **Authentication** | JWT + bcryptjs | 9.0.2 / 2.4.3 |
| **ORM** | Mongoose | 8.4.1 |
| **Deployment** | Railway | - |

## Local Development Setup 

### Prerequisites

- Node.js >= 18.0.0 (install via `https://nodejs.org/`)
- MongoDB Atlas account (free tier: `https://www.mongodb.com/cloud/atlas`)
- Git

### Step-by-Step Setup

#### 1. Clone or Create Project
```bash
# Create project directory
mkdir team_task_manager
cd team_task_manager

# Initialize git (optional)
git init
```

#### 2. Install Root Dependencies
```bash
npm install
```

#### 3. MongoDB Atlas Configuration
```
IMPORTANT: Complete these steps before running the app

a) Create MongoDB Cluster:
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free account (or login)
   - Click "Create" on the "Build a Cluster" option
   - Choose "Free" tier
   - Select your region (closest to you)
   - Click "Create Cluster" and wait 2-3 minutes

b) Create Database User:
   - In cluster view, click "Security" → "Database Access"
   - Click "Add New Database User"
   - Username: taskmanager
   - Password: Generate secure password (copy it!)
   - Role: Atlas Admin
   - Click "Add User"

c) Whitelist IP Address:
   - Click "Security" → "Network Access"
   - Click "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0)
   - Click "Confirm"

d) Get Connection String:
   - Go to "Databases" tab
   - Click "Connect" button on your cluster
   - Select "Drivers" (Node.js)
   - Copy the connection string
   - Replace <user> with username and <password> with password
   - Replace cluster-name with your cluster name (from URL)
```

#### 4. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your MongoDB URI and settings
nano .env
# or use your preferred editor

# Required values:
# MONGODB_URI=mongodb+srv://taskmanager:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
# JWT_SECRET=generate_a_random_string_here
# NODE_ENV=development
# CLIENT_URL=http://localhost:5173
```

#### 5. Seed Demo Data
```bash
# This creates demo users for testing
npm run seed
# Output: Demo users created (admin@demo.com / Admin@123 and member@demo.com / Member@123)
```

#### 6. Development Servers

##### Terminal 1 - Backend Server
```bash
npm run dev:server
# Runs on http://localhost:5000
# Watches for changes and auto-reloads
```

##### Terminal 2 - Frontend Dev Server (new terminal)
```bash
npm run dev:client
# Runs on http://localhost:5173
# Hot module replacement enabled
```

#### 7. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Login with demo credentials:
  - Admin: `admin@demo.com` / `Admin@123`
  - Member: `member@demo.com` / `Member@123`

## Environment Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Express server port |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas connection string |
| `JWT_SECRET` | `super_secret_key` | Secret key for JWT signing (min 32 chars) |
| `NODE_ENV` | `production` or `development` | Environment mode |
| `CLIENT_URL` | `https://app.railway.app` | Frontend deployment URL (for CORS) |

## Railway Deployment

### Prerequisites for Railway

- Railway account: `https://railway.app`
- GitHub account with this repo pushed
- Environment variables configured

### Deployment Steps

#### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. Login to Railway
```bash
railway login
# Opens browser, authorize and return to terminal
```

#### 3. Initialize Railway Project
```bash
railway init
# Select: "Create a new project"
# Enter project name: "task-manager" or your choice
# Select your region
```

#### 4. Link GitHub Repository (optional but recommended)
```bash
# If you haven't pushed to GitHub yet:
git add .
git commit -m "Initial commit: Team Task Manager"
git push origin main
```

#### 5. Set Environment Variables
```bash
railway variables set MONGODB_URI="mongodb+srv://taskmanager:YOUR_PASSWORD@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority"
railway variables set JWT_SECRET="generate_a_random_string_minimum_32_characters"
railway variables set NODE_ENV="production"
railway variables set CLIENT_URL="https://your-app.railway.app"
```

#### 6. Deploy
```bash
# Deploy to Railway
railway up

# Wait for deployment to complete
# Once done, Railway will show your deployment URL
```

#### 7. Verify Deployment
```bash
# Railway will provide your app URL
# Visit: https://your-app.railway.app
# Login with demo credentials to verify
```

#### 8. View Logs (if needed)
```bash
railway logs
```

#### 9. Redeploy (after code changes)
```bash
git add .
git commit -m "Your changes"
git push origin main
railway up
```

## Complete API Reference

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user (name, email, password) |
| POST | `/api/auth/login` | ❌ | Login user (email, password) returns JWT token |

### Project Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/projects` | ✅ | All | Get all projects user belongs to |
| POST | `/api/projects` | ✅ | Admin | Create new project |
| GET | `/api/projects/:id` | ✅ | Member | Get single project with members |
| PUT | `/api/projects/:id` | ✅ | Admin | Update project name & description |
| DELETE | `/api/projects/:id` | ✅ | Admin | Delete project and all tasks |
| POST | `/api/projects/:id/members` | ✅ | Admin | Add member by email |
| DELETE | `/api/projects/:id/members/:userId` | ✅ | Admin | Remove member from project |

### Task Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks/dashboard` | ✅ | Get dashboard statistics |
| GET | `/api/tasks?project=:projectId` | ✅ | Get all tasks for project |
| POST | `/api/tasks` | ✅ | Create new task |
| GET | `/api/tasks/:id` | ✅ | Get single task |
| PUT | `/api/tasks/:id` | ✅ | Update task (status/full edit) |
| DELETE | `/api/tasks/:id` | ✅ | Delete task |

### Request/Response Examples

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (201):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

#### Create Task
```bash
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design Homepage",
  "description": "Create mockups for new homepage",
  "status": "todo",
  "priority": "high",
  "dueDate": "2024-06-30",
  "project": "507f1f77bcf86cd799439011",
  "assignedTo": "507f1f77bcf86cd799439012"
}

Response (201):
{
  "_id": "507f1f77bcf86cd799439013",
  "title": "Design Homepage",
  ...
}
```

## Role Permissions

| Feature | Admin | Member |
|---------|-------|--------|
| Create Projects | ✅ | ❌ |
| Edit Own Projects | ✅ | ❌ |
| Delete Projects | ✅ | ❌ |
| Add/Remove Members | ✅ | ❌ |
| Create Tasks | ✅ | ✅ |
| Edit Own Tasks | ✅ | ✅ |
| Edit All Tasks | ✅ | ❌ |
| Delete Own Tasks | ✅ | ✅ |
| Delete All Tasks | ✅ | ❌ |
| Update Task Status | ✅ | ✅ |
| View Projects | ✅ | ✅ |
| Access Dashboard | ✅ | ✅ |

## Demo Credentials

Test the application with these accounts:

| Email | Password | Role |
|-------|----------|------|
| `admin@demo.com` | `Admin@123` | Admin |
| `member@demo.com` | `Member@123` | Member |

**Note**: Demo accounts are created by running `npm run seed` after MongoDB setup.

## Project Structure

```
team_task_manager/
├── server/
│   ├── index.js                 # Express server entry point
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── role.js              # Role-based access control
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Project.js           # Project schema
│   │   └── Task.js              # Task schema
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── projects.js          # Project endpoints
│   │   └── tasks.js             # Task endpoints
│   └── seed.js                  # Demo data seeding
├── client/
│   ├── index.html               # HTML entry point
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── postcss.config.js        # PostCSS config
│   └── src/
│       ├── main.jsx             # React entry point
│       ├── App.jsx              # Main app component
│       ├── index.css            # Global styles
│       ├── api/
│       │   └── axios.js         # Axios instance with interceptors
│       ├── context/
│       │   └── AuthContext.jsx  # Authentication context
│       ├── pages/
│       │   ├── Login.jsx        # Login page
│       │   ├── Register.jsx     # Register page
│       │   ├── Dashboard.jsx    # Dashboard with stats
│       │   ├── Projects.jsx     # Projects list
│       │   ├── ProjectDetail.jsx # Kanban board
│       │   └── NotFound.jsx     # 404 page
│       └── components/
│           ├── Navbar.jsx       # Navigation bar
│           ├── ProtectedRoute.jsx
│           ├── TaskCard.jsx     # Task card component
│           ├── TaskModal.jsx    # Task create/edit modal
│           └── StatCard.jsx     # Statistics card
├── package.json                 # Root dependencies
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── railway.json                 # Railway deployment config
└── README.md                    # This file
```

## Development Tips

### Debugging

#### Backend
```bash
# Enable debug logs
DEBUG=* npm run dev:server
```

#### Frontend
```bash
# React DevTools browser extension recommended
# Open DevTools: F12 or Ctrl+Shift+I
```

### Testing Login Flow

1. Register a new account
2. Use that account to create a project
3. Add another user as a member
4. Use member account to view and edit tasks

### Common Issues

**MongoDB Connection Error**
- Verify MongoDB URI in .env
- Check IP whitelist on MongoDB Atlas (should be 0.0.0.0/0)
- Ensure database user credentials are correct

**CORS Error**
- Check NODE_ENV and CLIENT_URL env vars match
- Verify CLIENT_URL doesn't have trailing slash

**Port Already in Use**
- Change PORT in .env
- Or kill process: `lsof -i :5000` then `kill -9 <PID>`

## Performance Optimizations

- JWT tokens cached in localStorage
- API requests debounced
- React components use memo for optimization
- Tailwind CSS for minimal bundle size
- MongoDB indexes on frequently queried fields

## Security Features

- Passwords hashed with bcryptjs (salt: 10 rounds)
- JWT tokens with 7-day expiration
- CORS configured for production
- Password validation on register (min 6 chars)
- Email uniqueness checks
- Role-based access control
- Protected routes on frontend

## Future Enhancements (Optional)

- Task comments and activity log
- File attachments on tasks
- Recurring tasks
- Task templates
- Real-time collaboration with WebSockets
- Email notifications
- Calendar view
- Advanced filtering and search
- Custom user avatars

## Assignment Requirement Checklist

✅ User Authentication (Signup/Login)
✅ JWT Authentication
✅ Project Creation & Team Management
✅ Task Creation & Assignment
✅ Task Status Tracking
✅ Dashboard Analytics
✅ Role-Based Access Control
✅ REST APIs
✅ MongoDB Database
✅ Railway Deployment
✅ Public Live URL

## Troubleshooting

### Build Fails on Railway
```
Error: npm ERR! code ENOENT
```
Solution: Ensure all dependencies in package.json match versions

### Tasks Not Loading
```
Check:
1. User is project member
2. MongoDB URI is correct
3. Indexes are created (automatic with Mongoose)
```

### Logout Not Working
```
Clear browser cache/localStorage:
- DevTools → Application → Clear Storage
- Then reload page
```

## Support & Resources

- **Node.js**: https://nodejs.org/docs/
- **Express**: https://expressjs.com/
- **React**: https://react.dev/
- **MongoDB**: https://docs.mongodb.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Railway**: https://railway.app/docs
- **JWT**: https://jwt.io/

## License

Apache License 2.0 - Free for personal and commercial use, modification, and distribution, provided you include the license/notice and note any changes.

## Author

Tarang Verma   
B.Tech CSE (AI)  
NIET Greater Noida   

---

**Last Updated**: May 2026   
**Status**: Production Ready ✅
