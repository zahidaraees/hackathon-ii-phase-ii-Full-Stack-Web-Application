# Quickstart Guide: Todo Web Application

## Overview
This guide provides a quick introduction to setting up and running the Todo Web Application for development.

## Prerequisites
- Node.js 18+ with npm/yarn
- Python 3.11+
- Docker and Docker Compose
- Git
- A Neon PostgreSQL account

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hackathon-ii/phase-ii-latest
```

### 2. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables
Copy the example environment file and update with your values:

```bash
# In the project root
cp .env.example .env
```

Required environment variables:
```
# Backend
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
JWT_SECRET=your_jwt_secret_key
NEON_DATABASE_URL=your_neon_database_url

# Frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret_key
```

### 5. Set Up Database
```bash
# Using Docker Compose
docker-compose up -d

# Or run migrations directly
cd backend
python -m src.database.migrate
```

### 6. Run the Applications

#### Backend (API Server)
```bash
cd backend
python -m src.main
```
The API will be available at `http://localhost:8000`

#### Frontend (Web Application)
```bash
cd frontend
npm run dev
```
The web app will be available at `http://localhost:3000`

## Development Commands

### Backend Commands
```bash
# Run tests
cd backend
pytest

# Run with auto-reload
python -m src.main --reload

# Run database migrations
python -m src.database.migrate
```

### Frontend Commands
```bash
# Run development server
cd frontend
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Lint code
npm run lint
```

## API Endpoints
Once running, the API endpoints will be available at `http://localhost:8000`:
- Authentication: `/auth/register`, `/auth/login`, `/auth/logout`
- Todo items: `/todos` (GET, POST, PUT, PATCH, DELETE)

## Database Models
The application uses the following main models:
- `User`: Stores user account information
- `TodoItem`: Stores todo items with title, description, status, priority, etc.

## Key Features
1. **Authentication**: JWT-based authentication with Better Auth
2. **Todo Management**: Full CRUD operations for todo items
3. **Multi-user Isolation**: Users only see their own todos
4. **Priority System**: Tasks can be marked with High/Medium/Low priority
5. **Due Dates**: Tasks can have due dates for scheduling
6. **Categories & Tags**: Organize tasks with categories and tags
7. **Responsive UI**: Works on mobile, tablet, and desktop
8. **Offline Capability**: Queues actions when offline and syncs when connected

## Troubleshooting

### Common Issues
1. **Database Connection Errors**: Ensure PostgreSQL is running and credentials are correct
2. **Authentication Failures**: Verify JWT secret keys match between frontend and backend
3. **CORS Errors**: Check that frontend origin is allowed in backend configuration

### Resetting the Database
```bash
cd backend
python -m src.database.reset
```

## Architecture Overview
- **Frontend**: Next.js 16+ with TypeScript and Tailwind CSS
- **Backend**: FastAPI with Python 3.11
- **Database**: Neon PostgreSQL with SQLModel ORM
- **Authentication**: Better Auth with JWT
- **Deployment**: Vercel for frontend, Docker Compose for backend

## Next Steps
1. Explore the API documentation at `/docs` when running the backend
2. Review the data models in `specs/001-todo-web-app/data-model.md`
3. Check the API contracts in `specs/001-todo-web-app/contracts/api-contract.md`
4. Look at the task breakdown in `specs/001-todo-web-app/tasks.md`