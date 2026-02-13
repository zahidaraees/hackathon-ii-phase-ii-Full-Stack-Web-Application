from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional
from enum import Enum

class TodoStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"

class TodoPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class TodoItemBase(SQLModel):
    title: str = Field(nullable=False, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completion_status: TodoStatus = Field(default=TodoStatus.pending)
    priority: TodoPriority = Field(default=TodoPriority.medium)
    due_date: Optional[datetime] = Field(default=None)
    category: Optional[str] = Field(default=None, max_length=50)
    tags: Optional[str] = Field(default=None)  # Store as JSON string
    owner_id: UUID = Field(nullable=False, foreign_key="user.id")

class TodoItem(TodoItemBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = Field(default=None)

class TodoItemRead(TodoItemBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]

class TodoItemCreate(TodoItemBase):
    title: str
    priority: TodoPriority = TodoPriority.medium
    due_date: Optional[datetime] = None
    category: Optional[str] = None
    tags: Optional[str] = None

class TodoItemUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completion_status: Optional[TodoStatus] = None
    priority: Optional[TodoPriority] = None
    due_date: Optional[datetime] = None
    category: Optional[str] = None
    tags: Optional[str] = None