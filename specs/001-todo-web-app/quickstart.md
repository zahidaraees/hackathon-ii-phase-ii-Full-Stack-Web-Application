# Quickstart Guide: Todo Web Application

**Created**: 2026-02-07
**Feature**: Todo Web Application
**Input**: Feature specification from `/specs/001-todo-web-app/spec.md`

## Development Environment Setup

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Docker & Docker Compose
- Git

### Initial Setup
1. Clone the repository
2. Install backend dependencies: `cd backend && pip install -r requirements.txt`
3. Install frontend dependencies: `cd frontend && npm install`
4. Set up environment variables (copy `.env.example` to `.env`)
5. Start the database: `docker-compose up -d`
6. Run database migrations
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

## Test Scenarios

### Scenario 1: User Registration and Login
1. Navigate to `/signup` page
2. Enter valid email and password
3. Verify account creation
4. Navigate to `/login` page
5. Enter credentials and verify successful login

### Scenario 2: Todo CRUD Operations
1. Ensure user is logged in
2. Navigate to `/todos` page
3. Create a new todo item
4. Verify the item appears in the list
5. Mark the item as complete
6. Update the item's description
7. Delete the item
8. Verify the item is removed from the list

### Scenario 3: Multi-user Isolation
1. Log in as User A
2. Create several todo items
3. Log out
4. Log in as User B
5. Verify User B cannot see User A's items
6. Create items for User B
7. Log out
8. Log back in as User A
9. Verify User A cannot see User B's items