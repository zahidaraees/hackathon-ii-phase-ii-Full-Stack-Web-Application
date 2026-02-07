# Todo Web Application

This is a full-stack web application for managing todos with user authentication and authorization.

## Features

- User registration and login
- Create, read, update, and delete todo items
- Mark todos as complete/incomplete
- User isolation - each user only sees their own todos
- Responsive UI that works on desktop and mobile

## Tech Stack

- **Backend**: FastAPI, SQLModel, PostgreSQL
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Authentication**: JWT-based with custom auth system
- **Database**: PostgreSQL (with Neon for serverless option)

## Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- Git

### Initial Setup

1. Clone the repository
2. Install backend dependencies: `cd backend && pip install -r requirements.txt`
3. Install frontend dependencies: `cd frontend && npm install`
4. Set up environment variables (copy `.env.example` to `.env`)
5. Start the database: `docker-compose up -d`
6. Run database migrations (when implemented)
7. Start the backend: `cd backend && python -m src.main`
8. Start the frontend: `cd frontend && npm run dev`

## Running Tests

- Backend: `cd backend && pytest`
- Frontend: `cd frontend && npm test`

## API Endpoints

- GET `/api/todos` - Get all todos for authenticated user
- POST `/api/todos` - Create a new todo for authenticated user
- PUT `/api/todos/{id}` - Update a specific todo for authenticated user
- DELETE `/api/todos/{id}` - Delete a specific todo for authenticated user
- PATCH `/api/todos/{id}/complete` - Mark a todo as complete/incomplete

## Architecture

The application follows a monorepo structure with separate frontend and backend components:

```
backend/
├── src/
│   ├── models/      # Data models
│   ├── services/    # Business logic
│   ├── api/         # API routes
│   ├── db/          # Database setup
│   ├── utils/       # Utilities (auth, errors)
│   └── config/      # Configuration
└── tests/           # Backend tests

frontend/
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Page components
│   ├── services/    # API client
│   └── contexts/    # React contexts
└── tests/           # Frontend tests
```

## Development

The application was developed following a spec-driven approach with AI assistance. All features were defined in specifications before implementation, and the code was generated using Claude Code and Spec-Kit Plus tools.