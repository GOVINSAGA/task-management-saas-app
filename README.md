# TaskFlow — Mini SaaS Task Management System

A production-ready, full-stack task management application with secure JWT authentication, multi-user support, and automated CI/CD deployment to OCI.

🔗 **Live Demo:** [https://taskManagement.govinsaga.pp.ua](https://taskManagement.govinsaga.pp.ua)

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js + Express.js |
| **Database** | PostgreSQL + Sequelize ORM |
| **Authentication** | JWT + bcrypt password hashing |
| **Frontend** | React 19 (Vite) + Tailwind CSS v4 |
| **Validation** | express-validator |
| **Containerization** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions |
| **Registry** | GitHub Container Registry (GHCR) |
| **Hosting** | Oracle Cloud Infrastructure (OCI) |
| **Reverse Proxy** | Nginx + Let's Encrypt SSL |

---

## ✅ Features Implemented

### Authentication System
- ✅ User registration with input validation
- ✅ User login with JWT token generation
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ JWT-based authentication with protected routes
- ✅ Auto token validation on app load
- ✅ Secure logout

### Task Management (Multi-User)
- ✅ Create tasks with title, description, priority, and due date
- ✅ View only your own tasks (proper user-task isolation)
- ✅ Update task details (title, description, priority, status)
- ✅ Toggle task status: Pending ↔ Completed
- ✅ Delete tasks
- ✅ Filter tasks by status and priority
- ✅ Task statistics dashboard (total, pending, completed, high priority)

### Backend Architecture
- ✅ Proper folder structure (controllers, routes, models, services, middleware)
- ✅ Error handling middleware with Sequelize error normalization
- ✅ Input validation on all endpoints
- ✅ CORS, Helmet security headers
- ✅ Health check endpoint

### Frontend
- ✅ React + Tailwind CSS with dark theme
- ✅ Glassmorphism UI design
- ✅ API integration with Axios interceptors
- ✅ Proper state handling with React Context
- ✅ Responsive design (mobile-first)
- ✅ Toast notifications for all actions

### DevOps & Deployment
- ✅ Dockerized backend + PostgreSQL
- ✅ Docker Compose for local dev and production
- ✅ GitHub Actions CI/CD pipeline
- ✅ Automated deployment to OCI
- ✅ Nginx reverse proxy with SSL

---

## 📁 Project Structure

```
task-managment-saas-app/
├── server/                       # Backend API
│   ├── src/
│   │   ├── config/database.js    # Sequelize + PostgreSQL connection
│   │   ├── controllers/          # Auth & Task controllers
│   │   ├── middleware/            # Auth, error handler, validators
│   │   ├── models/               # User & Task Sequelize models
│   │   ├── routes/               # Express route definitions
│   │   ├── services/             # Business logic layer
│   │   └── utils/                # ApiError, ApiResponse helpers
│   ├── server.js                 # Entry point
│   ├── Dockerfile
│   └── package.json
├── client/                       # React frontend
│   ├── src/
│   │   ├── api/                  # Axios instance + API services
│   │   ├── components/           # Navbar, TaskCard, TaskForm, ProtectedRoute
│   │   ├── context/              # AuthContext (login/register/logout)
│   │   └── pages/                # Login, Register, Dashboard
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .github/workflows/deploy.yml  # CI/CD pipeline
├── docker-compose.yml            # Local development
├── docker-compose.prod.yml       # Production (OCI)
└── README.md
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (recommended)
- PostgreSQL 16+ (or use Docker)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repo-url>
cd task-managment-saas-app

# Start PostgreSQL + API with Docker Compose
docker compose up -d

# Install and start the frontend
cd client
npm install
npm run dev
```

The API runs at `http://localhost:5002` and frontend at `http://localhost:5173`.

### Option 2: Manual Setup

```bash
# 1. Setup PostgreSQL
# Create a database named 'taskmanager_db'

# 2. Backend
cd server
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm install
npm run dev

# 3. Frontend (new terminal)
cd client
npm install
npm run dev
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Protected | Get current user |

### Tasks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tasks` | Protected | List user's tasks |
| POST | `/api/tasks` | Protected | Create a task |
| GET | `/api/tasks/:id` | Protected | Get task by ID |
| PUT | `/api/tasks/:id` | Protected | Update a task |
| PATCH | `/api/tasks/:id/status` | Protected | Toggle status |
| DELETE | `/api/tasks/:id` | Protected | Delete a task |
| GET | `/api/tasks/stats` | Protected | Task statistics |

### Query Parameters (GET /api/tasks)
- `status` — Filter by: `pending`, `completed`
- `priority` — Filter by: `low`, `medium`, `high`
- `sortBy` — Sort by: `createdAt`, `dueDate`, `priority`, `title`
- `order` — Sort order: `ASC`, `DESC`

---

## 🗄️ Database Schema

### Users
| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | Primary Key |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (bcrypt) |
| createdAt | TIMESTAMP | Auto |
| updatedAt | TIMESTAMP | Auto |

### Tasks
| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | Primary Key |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | Nullable |
| status | ENUM | 'pending' / 'completed' |
| priority | ENUM | 'low' / 'medium' / 'high' |
| dueDate | DATE | Nullable |
| userId | UUID | FK → Users.id, CASCADE |
| createdAt | TIMESTAMP | Auto |
| updatedAt | TIMESTAMP | Auto |

---

## 🚀 Deployment

The app deploys automatically to OCI via GitHub Actions on push to `main`.

### CI/CD Pipeline
1. **Build** — Docker image for API pushed to GHCR
2. **Build** — React frontend built with production API URL
3. **Deploy** — SSH into OCI, pull images, restart containers
4. **Deploy** — Copy frontend build to Nginx web root
5. **Reload** — Nginx configuration reload

### Required GitHub Secrets
| Secret | Description |
|--------|-------------|
| `OCI_SSH_KEY` | SSH private key for OCI server |
| `OCI_HOST` | OCI server IP address |
| `OCI_USER` | SSH username (ubuntu) |
| `DB_PASSWORD` | PostgreSQL password for production |
| `JWT_SECRET` | JWT signing secret for production |

---

## 📝 License

MIT
