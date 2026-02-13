# Data Model: Todo Web Application

## Overview
This document defines the data models for the Todo Web Application, including entities, their attributes, relationships, and validation rules.

## Entities

### User
Represents an authenticated user with unique identifier and associated todo items.

**Attributes:**
- `id` (UUID, Primary Key): Unique identifier for the user
- `email` (String, Unique, Required): User's email address for authentication
- `name` (String, Required): User's display name
- `created_at` (DateTime, Required): Timestamp when the user account was created
- `updated_at` (DateTime, Required): Timestamp when the user account was last updated
- `is_active` (Boolean, Default: True): Indicates if the user account is active

**Validation Rules:**
- Email must be a valid email format
- Name must be between 1 and 100 characters
- Created_at and updated_at timestamps are automatically managed

### TodoItem
Represents a task with comprehensive properties for effective task management.

**Attributes:**
- `id` (UUID, Primary Key): Unique identifier for the todo item
- `title` (String, Required): Brief title of the task (max 200 characters)
- `description` (Text, Optional): Detailed description of the task
- `completion_status` (Enum: 'pending', 'in_progress', 'completed', Default: 'pending'): Current status of the task
- `priority` (Enum: 'high', 'medium', 'low', Required): Priority level of the task
- `due_date` (DateTime, Optional): Deadline for completing the task
- `category` (String, Optional): Category or tag for grouping tasks (max 50 characters)
- `tags` (JSON, Optional): Array of tags associated with the task
- `owner_id` (UUID, Foreign Key): Reference to the User who owns this task
- `created_at` (DateTime, Required): Timestamp when the task was created
- `updated_at` (DateTime, Required): Timestamp when the task was last updated
- `completed_at` (DateTime, Optional): Timestamp when the task was marked as completed

**Validation Rules:**
- Title must be between 1 and 200 characters
- Description can be up to 1000 characters
- Due date cannot be in the past when creating/updating (optional validation)
- Priority must be one of the defined enum values
- Owner_id must reference an existing User
- Completed_at can only be set when completion_status is 'completed'

## Relationships

### User ↔ TodoItem (One-to-Many)
- A User can own many TodoItems
- A TodoItem belongs to exactly one User
- Foreign key constraint: TodoItem.owner_id references User.id
- Cascade delete: When a User is deleted, all their TodoItems are also deleted

## Indexes

### User Table
- Primary index on `id`
- Unique index on `email`
- Index on `created_at` for chronological queries

### TodoItem Table
- Primary index on `id`
- Index on `owner_id` for efficient user filtering
- Index on `completion_status` for status-based queries
- Index on `priority` for priority-based sorting
- Index on `due_date` for deadline-based queries
- Composite index on (`owner_id`, `completion_status`) for common user-status queries

## State Transitions

### TodoItem Completion Status
- `pending` → `in_progress`: When user starts working on the task
- `in_progress` → `completed`: When user marks task as complete
- `completed` → `pending`: When user reopens a completed task
- `in_progress` → `pending`: When user decides not to work on the task

## Constraints

### Business Logic Constraints
1. Users can only access and modify their own TodoItems
2. A TodoItem cannot be marked as completed without a title
3. Due dates must be validated to prevent illogical values
4. Tags array should have a reasonable limit (e.g., max 10 tags per item)

### Data Integrity Constraints
1. Referential integrity between User and TodoItem tables
2. Non-null constraints on required fields
3. Enum constraints on status and priority fields
4. Length constraints on string fields