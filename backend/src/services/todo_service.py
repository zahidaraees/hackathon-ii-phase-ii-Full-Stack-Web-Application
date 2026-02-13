from sqlmodel import Session, select
from typing import Optional, List
from uuid import UUID
from ..models.todo_item import TodoItem, TodoItemCreate, TodoItemUpdate, TodoStatus
from ..api.utils import handle_not_found, handle_forbidden

class TodoService:
    def __init__(self, session: Session):
        self.session = session

    def create_todo(self, todo_create: TodoItemCreate, owner_id: UUID) -> TodoItem:
        """
        Create a new todo item for a specific user
        """
        todo = TodoItem(
            title=todo_create.title,
            description=todo_create.description,
            completion_status=todo_create.completion_status,
            priority=todo_create.priority,
            due_date=todo_create.due_date,
            category=todo_create.category,
            tags=todo_create.tags,
            owner_id=owner_id
        )
        
        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)
        
        return todo

    def get_todo_by_id(self, todo_id: UUID, user_id: UUID) -> Optional[TodoItem]:
        """
        Retrieve a specific todo by its ID, ensuring it belongs to the requesting user
        """
        statement = select(TodoItem).where(
            TodoItem.id == todo_id,
            TodoItem.owner_id == user_id
        )
        todo = self.session.exec(statement).first()
        return todo

    def get_todos_by_user(
        self, 
        user_id: UUID, 
        status: Optional[TodoStatus] = None, 
        priority: Optional[str] = None, 
        category: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[TodoItem]:
        """
        Retrieve all todos for a specific user with optional filters
        """
        statement = select(TodoItem).where(TodoItem.owner_id == user_id)
        
        if status:
            statement = statement.where(TodoItem.completion_status == status)
        if priority:
            statement = statement.where(TodoItem.priority == priority)
        if category:
            statement = statement.where(TodoItem.category == category)
            
        statement = statement.offset(offset).limit(limit)
        
        todos = self.session.exec(statement).all()
        return todos

    def update_todo(self, todo_id: UUID, todo_update: TodoItemUpdate, user_id: UUID) -> Optional[TodoItem]:
        """
        Update a todo item, ensuring it belongs to the requesting user
        """
        todo = self.get_todo_by_id(todo_id, user_id)
        if not todo:
            return None
        
        # Update todo fields
        update_data = todo_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(todo, field, value)
        
        # Update the updated_at timestamp
        from datetime import datetime
        todo.updated_at = datetime.utcnow()
        
        # If completion status is being updated to 'completed', set completed_at
        if 'completion_status' in update_data and update_data['completion_status'] == TodoStatus.completed:
            todo.completed_at = datetime.utcnow()
        # If completion status is being changed from 'completed', clear completed_at
        elif todo.completion_status == TodoStatus.completed and update_data.get('completion_status') != TodoStatus.completed:
            todo.completed_at = None
        
        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)
        
        return todo

    def update_todo_status(self, todo_id: UUID, status: TodoStatus, user_id: UUID) -> Optional[TodoItem]:
        """
        Update only the status of a todo item
        """
        todo = self.get_todo_by_id(todo_id, user_id)
        if not todo:
            return None
        
        todo.completion_status = status
        
        # Update completed_at if status is completed
        from datetime import datetime
        if status == TodoStatus.completed:
            todo.completed_at = datetime.utcnow()
        elif todo.completion_status == TodoStatus.completed and status != TodoStatus.completed:
            # Clear completed_at if changing from completed to another status
            todo.completed_at = None
        
        # Update the updated_at timestamp
        todo.updated_at = datetime.utcnow()
        
        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)
        
        return todo

    def delete_todo(self, todo_id: UUID, user_id: UUID) -> bool:
        """
        Delete a todo item, ensuring it belongs to the requesting user
        """
        todo = self.get_todo_by_id(todo_id, user_id)
        if not todo:
            return False
        
        self.session.delete(todo)
        self.session.commit()
        return True