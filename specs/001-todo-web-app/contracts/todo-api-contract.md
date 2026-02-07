# API Contracts: Todo Web Application

**Created**: 2026-02-07
**Feature**: Todo Web Application
**Input**: Feature specification from `/specs/001-todo-web-app/spec.md`

## Authentication Contract

All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

## API Endpoints

### Todo Items

#### GET /api/todos
Get all todo items for the authenticated user.

**Request**:
- Method: GET
- Headers: Authorization: Bearer <token>
- Query Parameters: None

**Response**:
- Success: 200 OK
- Body: Array of TodoItem objects
```json
[
  {
    "id": "uuid",
    "title": "string",
    "description": "string or null",
    "completed": "boolean",
    "created_at": "ISO datetime string",
    "updated_at": "ISO datetime string"
  }
]
```

#### POST /api/todos
Create a new todo item for the authenticated user.

**Request**:
- Method: POST
- Headers: Authorization: Bearer <token>, Content-Type: application/json
- Body:
```json
{
  "title": "string",
  "description": "string or null"
}
```

**Response**:
- Success: 201 Created
- Body: Created TodoItem object
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string or null",
  "completed": false,
  "created_at": "ISO datetime string",
  "updated_at": "ISO datetime string"
}
```

#### PUT /api/todos/{id}
Update an existing todo item for the authenticated user.

**Request**:
- Method: PUT
- Headers: Authorization: Bearer <token>, Content-Type: application/json
- Path Parameter: id (UUID)
- Body:
```json
{
  "title": "string",
  "description": "string or null"
}
```

**Response**:
- Success: 200 OK
- Body: Updated TodoItem object
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string or null",
  "completed": "boolean",
  "created_at": "ISO datetime string",
  "updated_at": "ISO datetime string"
}
```

#### PATCH /api/todos/{id}/complete
Mark a todo item as complete or incomplete for the authenticated user.

**Request**:
- Method: PATCH
- Headers: Authorization: Bearer <token>, Content-Type: application/json
- Path Parameter: id (UUID)
- Body:
```json
{
  "completed": "boolean"
}
```

**Response**:
- Success: 200 OK
- Body: Updated TodoItem object
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string or null",
  "completed": "boolean",
  "created_at": "ISO datetime string",
  "updated_at": "ISO datetime string"
}
```

#### DELETE /api/todos/{id}
Delete a todo item for the authenticated user.

**Request**:
- Method: DELETE
- Headers: Authorization: Bearer <token>
- Path Parameter: id (UUID)

**Response**:
- Success: 204 No Content
- Body: Empty