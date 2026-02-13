# Todo Web Application API Contract

## Overview
This document specifies the API contracts for the Todo Web Application, detailing endpoints, request/response formats, and authentication requirements.

## Base URL
```
https://api.todo-web-app.com/v1
```

## Authentication
All endpoints require JWT authentication in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": { /* optional error details */ }
  }
}
```

## API Endpoints

### User Management

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "name": "John Doe",
      "created_at": "2023-01-01T00:00:00Z"
    },
    "token": "jwt_token"
  }
}
```

#### POST /auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token"
  }
}
```

#### POST /auth/logout
Logout user and invalidate session.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### Todo Items Management

#### GET /todos
Retrieve all todo items for the authenticated user.

**Query Parameters:**
- `status` (optional): Filter by completion status ('pending', 'in_progress', 'completed')
- `priority` (optional): Filter by priority ('high', 'medium', 'low')
- `category` (optional): Filter by category
- `limit` (optional): Number of items to return (default: 20, max: 100)
- `offset` (optional): Number of items to skip (for pagination)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "todos": [
      {
        "id": "uuid-string",
        "title": "Sample task",
        "description": "Detailed description of the task",
        "completion_status": "pending",
        "priority": "high",
        "due_date": "2023-12-31T23:59:59Z",
        "category": "Work",
        "tags": ["important", "deadline"],
        "created_at": "2023-01-01T00:00:00Z",
        "updated_at": "2023-01-01T00:00:00Z",
        "completed_at": null
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 20,
      "offset": 0
    }
  }
}
```

#### POST /todos
Create a new todo item for the authenticated user.

**Request Body:**
```json
{
  "title": "New task",
  "description": "Description of the new task",
  "priority": "medium",
  "due_date": "2023-12-31T23:59:59Z",
  "category": "Personal",
  "tags": ["personal", "important"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "todo": {
      "id": "uuid-string",
      "title": "New task",
      "description": "Description of the new task",
      "completion_status": "pending",
      "priority": "medium",
      "due_date": "2023-12-31T23:59:59Z",
      "category": "Personal",
      "tags": ["personal", "important"],
      "owner_id": "user-uuid",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z",
      "completed_at": null
    }
  }
}
```

#### GET /todos/{id}
Retrieve a specific todo item by ID.

**Path Parameters:**
- `id`: UUID of the todo item

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "todo": {
      "id": "uuid-string",
      "title": "Sample task",
      "description": "Detailed description of the task",
      "completion_status": "pending",
      "priority": "high",
      "due_date": "2023-12-31T23:59:59Z",
      "category": "Work",
      "tags": ["important", "deadline"],
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z",
      "completed_at": null
    }
  }
}
```

#### PUT /todos/{id}
Update an existing todo item.

**Path Parameters:**
- `id`: UUID of the todo item

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "completion_status": "in_progress",
  "priority": "high",
  "due_date": "2023-12-31T23:59:59Z",
  "category": "Work",
  "tags": ["urgent", "important"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "todo": {
      "id": "uuid-string",
      "title": "Updated task title",
      "description": "Updated description",
      "completion_status": "in_progress",
      "priority": "high",
      "due_date": "2023-12-31T23:59:59Z",
      "category": "Work",
      "tags": ["urgent", "important"],
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z",
      "completed_at": null
    }
  }
}
```

#### PATCH /todos/{id}/status
Update only the status of a todo item.

**Path Parameters:**
- `id`: UUID of the todo item

**Request Body:**
```json
{
  "completion_status": "completed"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "todo": {
      "id": "uuid-string",
      "title": "Sample task",
      "description": "Detailed description of the task",
      "completion_status": "completed",
      "priority": "high",
      "due_date": "2023-12-31T23:59:59Z",
      "category": "Work",
      "tags": ["important", "deadline"],
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z",
      "completed_at": "2023-01-02T00:00:00Z"
    }
  }
}
```

#### DELETE /todos/{id}
Delete a specific todo item.

**Path Parameters:**
- `id`: UUID of the todo item

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo item deleted successfully"
}
```

## Error Codes

- `UNAUTHORIZED`: Invalid or missing authentication token
- `FORBIDDEN`: User does not have permission to access the resource
- `NOT_FOUND`: Requested resource does not exist
- `VALIDATION_ERROR`: Request data failed validation
- `INTERNAL_ERROR`: An unexpected server error occurred