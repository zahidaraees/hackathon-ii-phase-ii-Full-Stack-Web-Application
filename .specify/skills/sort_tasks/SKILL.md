---
name: sort_tasks
description: Sort tasks by date or priority using FastAPI GET endpoint with query parameters. Use this skill whenever user selects sort option to ensure proper sorting orchestration with Claude code.
license: Complete terms in LICENSE.txt
---

# Sort Tasks Skill

This skill provides functionality to sort tasks by various criteria such as date or priority.

## Purpose

Sort tasks by date or priority to help users organize and prioritize their work. This skill handles the backend logic for sorting tasks based on user-selected criteria.

## When to Use

Use this skill whenever the user selects a sort option in the UI. This includes:
- Sorting tasks by creation date (ascending/descending)
- Sorting tasks by due date (ascending/descending)
- Sorting tasks by priority (low to high or high to low)
- Sorting tasks by title alphabetically
- Any other sorting criteria requested by the user

## Implementation Overview

The task sorting is implemented using:
- FastAPI GET endpoint with query parameters for sorting
- Claude code for sorting orchestration and validation

## Detailed Implementation

### 1. SQLModel Task Model

First, ensure you have the task model defined for querying:

```python
# models/task.py
from sqlmodel import SQLModel, Field, Column, DateTime
from datetime import datetime
from enum import Enum
from typing import Optional

class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"

class PriorityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: PriorityLevel = Field(default=PriorityLevel.MEDIUM)
    status: TaskStatus = Field(default=TaskStatus.PENDING)
    due_date: Optional[datetime] = Field(sa_column=Column(DateTime))
    assignee: Optional[str] = Field(default=None, max_length=100)
    tags: Optional[str] = Field(default=None)  # Could be JSON or comma-separated values

class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
```

### 2. FastAPI Endpoint for Sorting Tasks

Create an endpoint that sorts tasks based on query parameters:

```python
# api/v1/endpoints/tasks.py
from fastapi import APIRouter, Query, HTTPException
from sqlmodel import Session, select, asc, desc
from typing import List, Optional
from datetime import datetime
from database import get_session
from models.task import Task, TaskStatus, PriorityLevel
from utils.sort_orchestrator import validate_sort_params, orchestrate_sorting

router = APIRouter(prefix="/tasks", tags=["tasks"])

class SortField(str, Enum):
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"
    DUE_DATE = "due_date"
    PRIORITY = "priority"
    TITLE = "title"
    STATUS = "status"

class SortOrder(str, Enum):
    ASC = "asc"
    DESC = "desc"

@router.get("/", response_model=List[dict])
async def get_sorted_tasks(
    sort_field: SortField = Query(SortField.CREATED_AT, description="Field to sort by"),
    sort_order: SortOrder = Query(SortOrder.DESC, description="Sort order (asc or desc)"),
    status: Optional[TaskStatus] = Query(None, description="Filter by task status"),
    priority: Optional[PriorityLevel] = Query(None, description="Filter by priority level"),
    assignee: Optional[str] = Query(None, description="Filter by assignee"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of tasks to return"),
    offset: int = Query(0, ge=0, description="Number of tasks to skip"),
    db: Session = Depends(get_session)
):
    """
    Get tasks sorted by the specified field and order.
    
    Args:
        sort_field: Field to sort by (created_at, updated_at, due_date, priority, title, status)
        sort_order: Sort order (asc or desc)
        status: Optional status to filter tasks
        priority: Optional priority to filter tasks
        assignee: Optional assignee to filter tasks
        limit: Maximum number of tasks to return
        offset: Number of tasks to skip
        db: Database session dependency
    
    Returns:
        List of tasks sorted according to the specified criteria
    """
    try:
        # Validate sort parameters using Claude-enhanced validation
        validated_params = validate_sort_params(sort_field, sort_order)
        
        # Build the query with filters
        query = select(Task)
        
        # Apply filters if provided
        if status:
            query = query.where(Task.status == status)
        
        if priority:
            query = query.where(Task.priority == priority)
        
        if assignee:
            query = query.where(Task.assignee == assignee)
        
        # Apply sorting
        if validated_params["sort_order"] == "asc":
            query = query.order_by(asc(getattr(Task, validated_params["sort_field"])))
        else:
            query = query.order_by(desc(getattr(Task, validated_params["sort_field"])))
        
        # Apply pagination
        query = query.offset(offset).limit(limit)
        
        # Execute query
        tasks = db.exec(query).all()
        
        # Convert to dictionaries for response
        task_dicts = [task.dict() for task in tasks]
        
        # Use Claude code for additional orchestration if needed
        sorted_tasks = orchestrate_sorting(task_dicts, validated_params)
        
        return sorted_tasks
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving sorted tasks: {str(e)}")
```

### 3. Claude Code for Sorting Orchestration

The following Claude-enhanced code provides additional validation and orchestration for sorting:

```python
# utils/sort_orchestrator.py
from typing import List, Dict, Any, Union
from enum import Enum
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class SortField(str, Enum):
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"
    DUE_DATE = "due_date"
    PRIORITY = "priority"
    TITLE = "title"
    STATUS = "status"

class SortOrder(str, Enum):
    ASC = "asc"
    DESC = "desc"

def validate_sort_params(sort_field: SortField, sort_order: SortOrder) -> Dict[str, str]:
    """
    Validate sorting parameters using Claude-enhanced validation logic.
    
    Args:
        sort_field: Field to sort by
        sort_order: Sort order (asc or desc)
    
    Returns:
        Dictionary with validated parameters
    """
    # Validate sort field
    if sort_field not in SortField.__members__.values():
        raise ValueError(f"Invalid sort field: {sort_field}. Valid fields are: {list(SortField.__members__.keys())}")
    
    # Validate sort order
    if sort_order not in SortOrder.__members__.values():
        raise ValueError(f"Invalid sort order: {sort_order}. Valid orders are: {list(SortOrder.__members__.keys())}")
    
    # Log the validation
    logger.info(f"Validated sort parameters: field={sort_field}, order={sort_order}")
    
    return {
        "sort_field": sort_field.value,
        "sort_order": sort_order.value
    }

def orchestrate_sorting(tasks: List[Dict[str, Any]], params: Dict[str, str]) -> List[Dict[str, Any]]:
    """
    Claude-enhanced orchestration for sorting tasks.
    
    Args:
        tasks: List of task dictionaries to sort
        params: Sorting parameters
    
    Returns:
        Sorted list of task dictionaries
    """
    sort_field = params["sort_field"]
    sort_order = params["sort_order"]
    
    # Perform the sorting based on the field and order
    try:
        if sort_field == "priority":
            # Define priority order for sorting
            priority_order = {
                "low": 0,
                "medium": 1,
                "high": 2,
                "urgent": 3
            }
            
            if sort_order == "asc":
                tasks.sort(key=lambda x: priority_order[x[sort_field]])
            else:
                tasks.sort(key=lambda x: priority_order[x[sort_field]], reverse=True)
        elif sort_field == "status":
            # Define status order for sorting
            status_order = {
                "pending": 0,
                "in-progress": 1,
                "completed": 2
            }
            
            if sort_order == "asc":
                tasks.sort(key=lambda x: status_order[x[sort_field]])
            else:
                tasks.sort(key=lambda x: status_order[x[sort_field]], reverse=True)
        elif sort_field in ["created_at", "updated_at", "due_date"]:
            # Sort date fields
            if sort_order == "asc":
                tasks.sort(key=lambda x: x[sort_field] or datetime.min)
            else:
                tasks.sort(key=lambda x: x[sort_field] or datetime.min, reverse=True)
        else:
            # Sort other fields (title, etc.)
            if sort_order == "asc":
                tasks.sort(key=lambda x: x[sort_field] or "")
            else:
                tasks.sort(key=lambda x: x[sort_field] or "", reverse=True)
        
        logger.info(f"Successfully sorted {len(tasks)} tasks by {sort_field} in {sort_order} order")
        
        return tasks
    except Exception as e:
        logger.error(f"Error during sorting orchestration: {str(e)}")
        raise ValueError(f"Error during sorting: {str(e)}")

def validate_and_enhance_sort_query(
    sort_field: str, 
    sort_order: str, 
    filters: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Claude-enhanced validation and enhancement of sort queries.
    
    Args:
        sort_field: Field to sort by
        sort_order: Sort order (asc or desc)
        filters: Additional filters applied to the query
    
    Returns:
        Enhanced query parameters
    """
    # Validate the basic parameters
    validated_params = validate_sort_params(SortField(sort_field), SortOrder(sort_order))
    
    # Enhance with additional logic based on filters
    enhanced_params = {
        **validated_params,
        "filters_applied": bool(filters),
        "filter_count": len([f for f in filters.values() if f is not None]),
        "optimized_for": determine_optimization_strategy(validated_params, filters)
    }
    
    logger.info(f"Enhanced sort query parameters: {enhanced_params}")
    
    return enhanced_params

def determine_optimization_strategy(params: Dict[str, str], filters: Dict[str, Any]) -> str:
    """
    Determine the optimal strategy for executing the sort query based on parameters.
    
    Args:
        params: Validated sort parameters
        filters: Applied filters
    
    Returns:
        Optimization strategy
    """
    # If sorting by priority with status filter, we might want to optimize differently
    if params["sort_field"] == "priority" and filters.get("status"):
        return "priority_status_index"
    
    # If sorting by date with many results, consider pagination strategy
    if params["sort_field"] in ["created_at", "updated_at", "due_date"]:
        return "date_index"
    
    # Default strategy
    return "standard"
```

### 4. Using the Sorting Functionality

Here's how to use the sorting functionality in your application:

```python
# services/task_service.py
from typing import List, Dict, Any
from sqlmodel import Session, select
from models.task import Task, TaskStatus, PriorityLevel
from utils.sort_orchestrator import validate_and_enhance_sort_query, orchestrate_sorting

def get_sorted_tasks(
    session: Session,
    sort_field: str = "created_at",
    sort_order: str = "desc",
    filters: Dict[str, Any] = None
) -> List[Dict[str, Any]]:
    """
    Get tasks sorted by the specified field and order.
    
    Args:
        session: Database session
        sort_field: Field to sort by
        sort_order: Sort order (asc or desc)
        filters: Additional filters to apply
    
    Returns:
        List of sorted task dictionaries
    """
    # Validate and enhance the sort query
    enhanced_params = validate_and_enhance_sort_query(sort_field, sort_order, filters or {})
    
    # Build the query
    query = select(Task)
    
    # Apply filters if provided
    if filters:
        for field, value in filters.items():
            if value is not None:
                query = query.where(getattr(Task, field) == value)
    
    # Execute query
    tasks = session.exec(query).all()
    
    # Convert to dictionaries
    task_dicts = [task.dict() for task in tasks]
    
    # Sort using Claude orchestration
    sorted_tasks = orchestrate_sorting(
        task_dicts, 
        {"sort_field": enhanced_params["sort_field"], "sort_order": enhanced_params["sort_order"]}
    )
    
    return sorted_tasks

# Example usage in a FastAPI endpoint
"""
@router.get("/sorted-tasks", response_model=List[dict])
async def get_tasks_with_sorting(
    sort_field: SortField = Query(SortField.CREATED_AT),
    sort_order: SortOrder = Query(SortOrder.DESC),
    status: Optional[TaskStatus] = Query(None),
    priority: Optional[PriorityLevel] = Query(None),
    db: Session = Depends(get_session)
):
    filters = {}
    if status:
        filters["status"] = status
    if priority:
        filters["priority"] = priority
    
    tasks = get_sorted_tasks(db, sort_field.value, sort_order.value, filters)
    return tasks
"""
```

### 5. Frontend Integration

Here's how the frontend can interact with the sorting endpoint:

```javascript
// utils/taskApi.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const fetchSortedTasks = async (sortBy = 'created_at', sortOrder = 'desc', filters = {}) => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams({
      sort_field: sortBy,
      sort_order: sortOrder,
      ...filters
    });
    
    const response = await fetch(`${API_BASE_URL}/tasks?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error('Error fetching sorted tasks:', error);
    throw error;
  }
};

// Example usage in a React component
/*
import { useState, useEffect } from 'react';
import { fetchSortedTasks } from '../utils/taskApi';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [sortBy, sortOrder]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasks = await fetchSortedTasks(sortBy, sortOrder);
      setTasks(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <div className="sort-controls">
        <button onClick={() => handleSortChange('created_at', 'asc')}>Sort by Date (Old to New)</button>
        <button onClick={() => handleSortChange('created_at', 'desc')}>Sort by Date (New to Old)</button>
        <button onClick={() => handleSortChange('priority', 'asc')}>Sort by Priority (Low to High)</button>
        <button onClick={() => handleSortChange('priority', 'desc')}>Sort by Priority (High to Low)</button>
      </div>
      
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>Priority: {task.priority}</p>
            <p>Status: {task.status}</p>
            <p>Created: {new Date(task.created_at).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
*/
```

## Additional Features

The implementation includes:
- Comprehensive FastAPI endpoint for sorting tasks
- Multiple sorting options (by date, priority, title, etc.)
- Filtering capabilities combined with sorting
- Claude-enhanced validation and orchestration
- Proper error handling and logging
- Type hints for better code maintainability
- Pagination support

## Security Considerations

- Validate all input parameters to prevent injection attacks
- Implement proper authentication and authorization checks
- Limit the number of results returned to prevent excessive resource usage
- Use parameterized queries to prevent SQL injection
- Implement rate limiting for API endpoints
- Sanitize and validate all query parameters