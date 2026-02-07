# Data Model: Todo Web Application

**Created**: 2026-02-07
**Feature**: Todo Web Application
**Input**: Feature specification from `/specs/001-todo-web-app/spec.md`

## Entity Definitions

### User
Represents an authenticated user with unique identifier and associated todo items.

**Attributes**:
- id: UUID (primary key)
- email: String (unique, required)
- password_hash: String (required)
- created_at: DateTime (required)
- updated_at: DateTime (required)

**Relationships**:
- One-to-Many: User → TodoItem (via user_id foreign key)

### TodoItem
Represents a task with properties: id, title, description, completion status, creation timestamp, owner (User).

**Attributes**:
- id: UUID (primary key)
- title: String (required)
- description: Text (optional)
- completed: Boolean (default: false)
- user_id: UUID (foreign key to User.id, required)
- created_at: DateTime (required)
- updated_at: DateTime (required)

**Relationships**:
- Many-to-One: TodoItem → User (via user_id foreign key)

## Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Todo items table
CREATE TABLE todo_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_todo_items_user_id ON todo_items(user_id);
CREATE INDEX idx_todo_items_completed ON todo_items(completed);
```

## Access Patterns

1. Retrieve all todo items for a specific user
2. Create a new todo item for a specific user
3. Update a specific todo item for a specific user
4. Delete a specific todo item for a specific user
5. Mark a specific todo item as complete/incomplete for a specific user

## Validation Rules

- User email must be a valid email format
- Todo item title must not be empty
- Todo items can only be accessed by their owner
- User authentication required for all operations