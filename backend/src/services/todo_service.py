from sqlmodel import Session, select
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from .models.todo_item import TodoItem, TodoItemCreate, TodoItemUpdate
from .models.user import User
from .utils.errors import AppException, ErrorCode


class TodoService:
    """Service class for handling todo-related operations."""
    
    @staticmethod
    def get_todos_by_user_id(session: Session, user_id: UUID, skip: int = 0, limit: int = 100) -> List[TodoItem]:
        """Get all todos for a specific user."""
        statement = select(TodoItem).where(TodoItem.user_id == user_id).offset(skip).limit(limit)
        todos = session.exec(statement).all()
        return todos
    
    @staticmethod
    def get_todo_by_id(session: Session, todo_id: UUID, user_id: UUID) -> Optional[TodoItem]:
        """Get a specific todo by ID for a specific user."""
        statement = select(TodoItem).where(TodoItem.id == todo_id, TodoItem.user_id == user_id)
        todo = session.exec(statement).first()
        return todo
    
    @staticmethod
    def create_todo(session: Session, todo_create: TodoItemCreate, user_id: UUID) -> TodoItem:
        """Create a new todo for a specific user."""
        todo = TodoItem.model_validate(todo_create)
        todo.user_id = user_id
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return todo
    
    @staticmethod
    def update_todo(session: Session, todo_id: UUID, todo_update: TodoItemUpdate, user_id: UUID) -> Optional[TodoItem]:
        """Update a specific todo for a specific user."""
        todo = TodoService.get_todo_by_id(session, todo_id, user_id)
        if not todo:
            return None
        
        update_data = todo_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(todo, field, value)
        
        todo.updated_at = datetime.utcnow()
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return todo
    
    @staticmethod
    def delete_todo(session: Session, todo_id: UUID, user_id: UUID) -> bool:
        """Delete a specific todo for a specific user."""
        todo = TodoService.get_todo_by_id(session, todo_id, user_id)
        if not todo:
            return False
        
        session.delete(todo)
        session.commit()
        return True
    
    @staticmethod
    def toggle_todo_completion(session: Session, todo_id: UUID, user_id: UUID, completed: bool) -> Optional[TodoItem]:
        """Toggle the completion status of a specific todo for a specific user."""
        todo = TodoService.get_todo_by_id(session, todo_id, user_id)
        if not todo:
            return None
        
        todo.completed = completed
        todo.updated_at = datetime.utcnow()
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return todo