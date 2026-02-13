from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from typing import List, Optional
from uuid import UUID

from ...database.session import get_session
from ...middleware.auth import require_authentication
from ...models.todo_item import (
    TodoItemRead, TodoItemCreate, TodoItemUpdate, TodoStatus, TodoPriority
)
from ...services.todo_service import TodoService
from ...api.utils import create_success_response, handle_not_found, handle_forbidden

router = APIRouter()

@router.get("/", response_model=dict)
def get_todos(
    current_user: str = Depends(require_authentication),
    status: Optional[TodoStatus] = Query(None, description="Filter by completion status"),
    priority: Optional[TodoPriority] = Query(None, description="Filter by priority"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(20, ge=1, le=100, description="Number of items to return"),
    offset: int = Query(0, ge=0, description="Number of items to skip"),
    session: Session = Depends(get_session)
):
    """
    Retrieve all todo items for the authenticated user with optional filters.
    """
    # Convert user email to user ID (in a real app, you'd get the user ID from the token)
    # For now, we'll simulate getting the user ID from the email
    from ..services.user_service import UserService
    user_service = UserService(session)
    user_obj = user_service.get_user_by_email(current_user)
    
    if not user_obj:
        handle_forbidden("Invalid user")
    
    user_id = user_obj.id
    
    todo_service = TodoService(session)
    todos = todo_service.get_todos_by_user(
        user_id=user_id,
        status=status,
        priority=priority,
        category=category,
        limit=limit,
        offset=offset
    )
    
    # Convert to response format
    todo_list = [TodoItemRead.from_orm(todo) if hasattr(TodoItemRead, 'from_orm') else TodoItemRead(**todo.dict()) for todo in todos]
    
    return create_success_response(
        data={
            "todos": todo_list,
            "pagination": {
                "total": len(todos),  # In a real app, this would come from a separate count query
                "limit": limit,
                "offset": offset
            }
        }
    )


@router.post("/", response_model=dict)
def create_todo(
    todo_create: TodoItemCreate,
    current_user: str = Depends(require_authentication),
    session: Session = Depends(get_session)
):
    """
    Create a new todo item for the authenticated user.
    """
    # Convert user email to user ID (in a real app, you'd get the user ID from the token)
    from ..services.user_service import UserService
    user_service = UserService(session)
    user_obj = user_service.get_user_by_email(current_user)
    
    if not user_obj:
        handle_forbidden("Invalid user")
    
    user_id = user_obj.id
    
    todo_service = TodoService(session)
    new_todo = todo_service.create_todo(todo_create, user_id)
    
    return create_success_response(
        data={"todo": TodoItemRead.from_orm(new_todo) if hasattr(TodoItemRead, 'from_orm') else TodoItemRead(**new_todo.dict())}
    )


@router.get("/{todo_id}", response_model=dict)
def get_todo(
    todo_id: UUID,
    current_user: str = Depends(require_authentication),
    session: Session = Depends(get_session)
):
    """
    Retrieve a specific todo item by ID.
    """
    # Convert user email to user ID (in a real app, you'd get the user ID from the token)
    from ..services.user_service import UserService
    user_service = UserService(session)
    user_obj = user_service.get_user_by_email(current_user)
    
    if not user_obj:
        handle_forbidden("Invalid user")
    
    user_id = user_obj.id
    
    todo_service = TodoService(session)
    todo = todo_service.get_todo_by_id(todo_id, user_id)
    
    if not todo:
        handle_not_found("Todo item")
    
    return create_success_response(
        data={"todo": TodoItemRead.from_orm(todo) if hasattr(TodoItemRead, 'from_orm') else TodoItemRead(**todo.dict())}
    )


@router.put("/{todo_id}", response_model=dict)
def update_todo(
    todo_id: UUID,
    todo_update: TodoItemUpdate,
    current_user: str = Depends(require_authentication),
    session: Session = Depends(get_session)
):
    """
    Update an existing todo item.
    """
    # Convert user email to user ID (in a real app, you'd get the user ID from the token)
    from ..services.user_service import UserService
    user_service = UserService(session)
    user_obj = user_service.get_user_by_email(current_user)
    
    if not user_obj:
        handle_forbidden("Invalid user")
    
    user_id = user_obj.id
    
    todo_service = TodoService(session)
    updated_todo = todo_service.update_todo(todo_id, todo_update, user_id)
    
    if not updated_todo:
        handle_not_found("Todo item")
    
    return create_success_response(
        data={"todo": TodoItemRead.from_orm(updated_todo) if hasattr(TodoItemRead, 'from_orm') else TodoItemRead(**updated_todo.dict())}
    )


@router.patch("/{todo_id}/status", response_model=dict)
def update_todo_status(
    todo_id: UUID,
    completion_status: TodoStatus,
    current_user: str = Depends(require_authentication),
    session: Session = Depends(get_session)
):
    """
    Update only the status of a todo item.
    """
    # Convert user email to user ID (in a real app, you'd get the user ID from the token)
    from ..services.user_service import UserService
    user_service = UserService(session)
    user_obj = user_service.get_user_by_email(current_user)
    
    if not user_obj:
        handle_forbidden("Invalid user")
    
    user_id = user_obj.id
    
    todo_service = TodoService(session)
    updated_todo = todo_service.update_todo_status(todo_id, completion_status, user_id)
    
    if not updated_todo:
        handle_not_found("Todo item")
    
    return create_success_response(
        data={"todo": TodoItemRead.from_orm(updated_todo) if hasattr(TodoItemRead, 'from_orm') else TodoItemRead(**updated_todo.dict())}
    )


@router.delete("/{todo_id}", response_model=dict)
def delete_todo(
    todo_id: UUID,
    current_user: str = Depends(require_authentication),
    session: Session = Depends(get_session)
):
    """
    Delete a specific todo item.
    """
    # Convert user email to user ID (in a real app, you'd get the user ID from the token)
    from ..services.user_service import UserService
    user_service = UserService(session)
    user_obj = user_service.get_user_by_email(current_user)
    
    if not user_obj:
        handle_forbidden("Invalid user")
    
    user_id = user_obj.id
    
    todo_service = TodoService(session)
    success = todo_service.delete_todo(todo_id, user_id)
    
    if not success:
        handle_not_found("Todo item")
    
    return create_success_response(message="Todo item deleted successfully")