---
name: summarize_tasks
description: Summarize tasks in plain language when user asks chatbot "What are my tasks?". Use this skill to combine list_tasks output with Claude code for conversational orchestration.
license: Complete terms in LICENSE.txt
---

# Summarize Tasks Skill

This skill provides functionality to summarize tasks in plain language when users ask the chatbot about their tasks.

## Purpose

Summarize tasks in plain language when a user asks the chatbot "What are my tasks?" This skill transforms raw task data into a conversational, easy-to-understand format.

## When to Use

Use this skill whenever a user asks the chatbot "What are my tasks?" or similar queries. This includes:
- Responding to direct questions about current tasks
- Providing task summaries in natural language
- Converting structured task data to conversational format
- Generating task overviews for voice assistants
- Creating task digests for notifications

## Implementation Overview

The task summarization is implemented using:
- Stub response combining list_tasks output
- Claude code for conversational orchestration

## Detailed Implementation

### 1. Task Summary Service

Create a service to handle task summarization:

```python
# services/task_summary_service.py
from typing import List, Dict, Any
from datetime import datetime, date
from models.task import Task, TaskStatus, PriorityLevel
import re

class TaskSummaryService:
    def __init__(self):
        self.priority_mapping = {
            PriorityLevel.LOW: "low priority",
            PriorityLevel.MEDIUM: "medium priority", 
            PriorityLevel.HIGH: "high priority",
            PriorityLevel.URGENT: "urgent priority"
        }
        
        self.status_mapping = {
            TaskStatus.PENDING: "pending",
            TaskStatus.IN_PROGRESS: "in progress",
            TaskStatus.COMPLETED: "completed"
        }

    def generate_task_summary(self, tasks: List[Dict[str, Any]], user_name: str = "User") -> str:
        """
        Generate a conversational summary of tasks.
        
        Args:
            tasks: List of task dictionaries
            user_name: Name of the user for personalization
        
        Returns:
            Conversational summary of tasks
        """
        if not tasks:
            return f"{user_name}, you currently don't have any tasks."
        
        # Categorize tasks by status
        pending_tasks = [task for task in tasks if task.get('status') == 'pending']
        in_progress_tasks = [task for task in tasks if task.get('status') == 'in-progress']
        completed_tasks = [task for task in tasks if task.get('status') == 'completed']
        
        summary_parts = []
        
        # Add greeting
        summary_parts.append(f"Hi {user_name}! Here's a summary of your tasks:")
        
        # Add pending tasks
        if pending_tasks:
            summary_parts.append(f"\nYou have {len(pending_tasks)} pending task{'s' if len(pending_tasks) != 1 else ''}:")
            for i, task in enumerate(pending_tasks, 1):
                due_info = ""
                if task.get('due_date'):
                    due_date = datetime.fromisoformat(task['due_date'].replace('Z', '+00:00')).date()
                    today = date.today()
                    days_diff = (due_date - today).days
                    
                    if days_diff < 0:
                        due_info = f" (was due {-days_diff} day{'s' if abs(days_diff) != 1 else ''} ago)"
                    elif days_diff == 0:
                        due_info = " (due today)"
                    elif days_diff == 1:
                        due_info = " (due tomorrow)"
                    else:
                        due_info = f" (due in {days_diff} days)"
                
                priority_text = self.priority_mapping.get(task.get('priority', ''), task.get('priority', ''))
                
                summary_parts.append(
                    f"{i}. {task.get('title', 'Untitled task')} - {priority_text}{due_info}"
                )
        
        # Add in-progress tasks
        if in_progress_tasks:
            summary_parts.append(f"\nYou have {len(in_progress_tasks)} task{'s' if len(in_progress_tasks) != 1 else ''} in progress:")
            for i, task in enumerate(in_progress_tasks, 1):
                priority_text = self.priority_mapping.get(task.get('priority', ''), task.get('priority', ''))
                summary_parts.append(
                    f"{i}. {task.get('title', 'Untitled task')} - {priority_text}"
                )
        
        # Add completed tasks (only if there are any to show)
        if completed_tasks:
            summary_parts.append(f"\nYou have completed {len(completed_tasks)} task{'s' if len(completed_tasks) != 1 else ''}.")
        
        # Add recommendations based on priorities and due dates
        recommendations = self._generate_recommendations(pending_tasks)
        if recommendations:
            summary_parts.append("\nRecommendations:")
            summary_parts.extend(recommendations)
        
        return "\n".join(summary_parts)

    def _generate_recommendations(self, pending_tasks: List[Dict[str, Any]]) -> List[str]:
        """
        Generate recommendations based on task priorities and due dates.
        
        Args:
            pending_tasks: List of pending task dictionaries
        
        Returns:
            List of recommendation strings
        """
        recommendations = []
        
        # Find urgent tasks
        urgent_tasks = [task for task in pending_tasks if task.get('priority') == 'urgent']
        if urgent_tasks:
            recommendations.append(f"- You have {len(urgent_tasks)} urgent task{'s' if len(urgent_tasks) != 1 else ''} that need immediate attention.")
        
        # Find tasks due today or overdue
        today = date.today()
        overdue_tasks = []
        due_today_tasks = []
        
        for task in pending_tasks:
            if task.get('due_date'):
                due_date = datetime.fromisoformat(task['due_date'].replace('Z', '+00:00')).date()
                if due_date < today:
                    overdue_tasks.append(task)
                elif due_date == today:
                    due_today_tasks.append(task)
        
        if overdue_tasks:
            recommendations.append(f"- You have {len(overdue_tasks)} task{'s' if len(overdue_tasks) != 1 else ''} that are overdue and should be completed as soon as possible.")
        
        if due_today_tasks:
            recommendations.append(f"- You have {len(due_today_tasks)} task{'s' if len(due_today_tasks) != 1 else ''} that are due today.")
        
        # Find high priority tasks
        high_priority_tasks = [task for task in pending_tasks if task.get('priority') == 'high']
        if high_priority_tasks and not urgent_tasks:
            recommendations.append(f"- You have {len(high_priority_tasks)} high priority task{'s' if len(high_priority_tasks) != 1 else ''} to focus on.")
        
        return recommendations

    def generate_condensed_summary(self, tasks: List[Dict[str, Any]], user_name: str = "User") -> str:
        """
        Generate a condensed summary of tasks.
        
        Args:
            tasks: List of task dictionaries
            user_name: Name of the user for personalization
        
        Returns:
            Condensed summary of tasks
        """
        if not tasks:
            return f"{user_name}, you currently don't have any tasks."
        
        # Count tasks by status
        status_counts = {}
        for task in tasks:
            status = task.get('status', 'unknown')
            status_counts[status] = status_counts.get(status, 0) + 1
        
        # Create summary
        summary_parts = [f"{user_name}'s task summary:"]
        
        for status, count in status_counts.items():
            status_text = self.status_mapping.get(status, status)
            summary_parts.append(f"- {count} {status_text} task{'s' if count != 1 else ''}")
        
        return " ".join(summary_parts)


# Global instance
task_summary_service = TaskSummaryService()
```

### 2. Claude Code for Conversational Orchestration

The following Claude-enhanced code provides conversational orchestration for task summarization:

```python
# utils/conversational_orchestrator.py
from typing import Dict, Any, List
from services.task_summary_service import task_summary_service
import re

class ConversationalOrchestrator:
    def __init__(self):
        self.question_patterns = [
            r"what are my tasks",
            r"what tasks do i have",
            r"show me my tasks",
            r"list my tasks",
            r"what should i do",
            r"what am i supposed to do",
            r"what's on my plate",
            r"what's my to-do list"
        ]
        
        self.personalization_keywords = [
            "today", "tomorrow", "this week", "urgent", "important", 
            "high priority", "work", "personal", "meeting"
        ]

    def is_task_question(self, user_input: str) -> bool:
        """
        Check if the user's input is asking about tasks.
        
        Args:
            user_input: The user's input string
        
        Returns:
            True if the input is asking about tasks, False otherwise
        """
        user_input_lower = user_input.lower().strip()
        
        for pattern in self.question_patterns:
            if re.search(pattern, user_input_lower):
                return True
        
        return False

    def extract_context_from_question(self, user_input: str) -> Dict[str, Any]:
        """
        Extract context from the user's question to refine the summary.
        
        Args:
            user_input: The user's input string
        
        Returns:
            Dictionary with extracted context
        """
        context = {
            "time_frame": None,
            "priority_focus": None,
            "category_focus": None,
            "has_specific_request": False
        }
        
        user_input_lower = user_input.lower()
        
        # Extract time frame
        if "today" in user_input_lower:
            context["time_frame"] = "today"
        elif "tomorrow" in user_input_lower:
            context["time_frame"] = "tomorrow"
        elif "week" in user_input_lower:
            context["time_frame"] = "week"
        elif "month" in user_input_lower:
            context["time_frame"] = "month"
        
        # Extract priority focus
        if "urgent" in user_input_lower or "important" in user_input_lower or "high priority" in user_input_lower:
            context["priority_focus"] = "high"
        elif "low priority" in user_input_lower:
            context["priority_focus"] = "low"
        
        # Check if user has specific request
        context["has_specific_request"] = any(keyword in user_input_lower for keyword in self.personalization_keywords)
        
        return context

    def orchestrate_task_summary(self, tasks: List[Dict[str, Any]], user_input: str, user_name: str = "User") -> str:
        """
        Claude-enhanced orchestration for generating task summaries.
        
        Args:
            tasks: List of task dictionaries
            user_input: The user's input asking about tasks
            user_name: Name of the user for personalization
        
        Returns:
            Conversational summary of tasks
        """
        # Extract context from the user's question
        context = self.extract_context_from_question(user_input)
        
        # Filter tasks based on context if needed
        filtered_tasks = self._filter_tasks_by_context(tasks, context)
        
        # Generate summary based on context
        if context.get("has_specific_request"):
            # For specific requests, use detailed summary
            summary = task_summary_service.generate_task_summary(filtered_tasks, user_name)
        else:
            # For general requests, use condensed summary
            summary = task_summary_service.generate_condensed_summary(filtered_tasks, user_name)
        
        # Enhance with Claude's conversational touch
        enhanced_summary = self._enhance_conversation(summary, context, user_input)
        
        return enhanced_summary

    def _filter_tasks_by_context(self, tasks: List[Dict[str, Any]], context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Filter tasks based on extracted context.
        
        Args:
            tasks: List of task dictionaries
            context: Extracted context from user input
        
        Returns:
            Filtered list of task dictionaries
        """
        filtered_tasks = tasks.copy()
        
        # Filter by time frame
        if context.get("time_frame") == "today":
            from datetime import date
            today = date.today()
            filtered_tasks = [
                task for task in filtered_tasks
                if task.get('due_date') and 
                datetime.fromisoformat(task['due_date'].replace('Z', '+00:00')).date() == today
            ]
        elif context.get("time_frame") == "tomorrow":
            from datetime import date, timedelta
            tomorrow = date.today() + timedelta(days=1)
            filtered_tasks = [
                task for task in filtered_tasks
                if task.get('due_date') and 
                datetime.fromisoformat(task['due_date'].replace('Z', '+00:00')).date() == tomorrow
            ]
        
        # Filter by priority
        if context.get("priority_focus") == "high":
            filtered_tasks = [
                task for task in filtered_tasks
                if task.get('priority') in ['high', 'urgent']
            ]
        elif context.get("priority_focus") == "low":
            filtered_tasks = [
                task for task in filtered_tasks
                if task.get('priority') == 'low'
            ]
        
        return filtered_tasks

    def _enhance_conversation(self, summary: str, context: Dict[str, Any], user_input: str) -> str:
        """
        Enhance the summary with Claude's conversational touch.
        
        Args:
            summary: The base summary
            context: Extracted context from user input
            user_input: Original user input
        
        Returns:
            Enhanced conversational summary
        """
        # Add personalized greeting based on time of day
        from datetime import datetime
        hour = datetime.now().hour
        if 5 <= hour < 12:
            greeting = "Good morning! "
        elif 12 <= hour < 17:
            greeting = "Good afternoon! "
        elif 17 <= hour < 21:
            greeting = "Good evening! "
        else:
            greeting = "Hello! "
        
        # Modify the summary based on the original question
        if "should i do" in user_input.lower() or "supposed to do" in user_input.lower():
            # If user asked what they should do, emphasize recommendations
            summary = summary.replace("Recommendations:", f"{greeting}Based on your tasks, here are some recommendations:")
        else:
            # Otherwise, just add the greeting
            summary = greeting + summary
        
        # Add helpful closing if needed
        if len(summary.split()) > 20:  # If it's a longer summary
            summary += "\n\nLet me know if you'd like more details about any specific task!"
        
        return summary


# Global instance
conversational_orchestrator = ConversationalOrchestrator()
```

### 3. FastAPI Endpoint for Task Summarization

Create an endpoint that handles task summarization requests:

```python
# api/v1/endpoints/chat.py
from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
from typing import Dict, Any
from database import get_session
from services.task_service import get_user_tasks  # Assuming this function exists
from utils.conversational_orchestrator import conversational_orchestrator
from pydantic import BaseModel

router = APIRouter(prefix="/chat", tags=["chat"])

class TaskQuestionRequest(BaseModel):
    question: str
    user_id: int
    user_name: str = "User"

@router.post("/task-summary", response_model=Dict[str, Any])
async def get_task_summary(
    request: TaskQuestionRequest,
    db: Session = Depends(get_session)
) -> Dict[str, Any]:
    """
    Get a conversational summary of tasks based on the user's question.
    
    Args:
        request: Question and user information
        db: Database session dependency
    
    Returns:
        Dictionary with the task summary
    """
    try:
        # Check if the question is asking about tasks
        if not conversational_orchestrator.is_task_question(request.question):
            raise HTTPException(
                status_code=400, 
                detail="This endpoint is specifically for task-related questions"
            )
        
        # Get the user's tasks
        tasks = get_user_tasks(db, request.user_id)
        
        # Generate conversational summary
        summary = conversational_orchestrator.orchestrate_task_summary(
            tasks, 
            request.question, 
            request.user_name
        )
        
        return {
            "question": request.question,
            "summary": summary,
            "task_count": len(tasks),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating task summary: {str(e)}")

# Alternative endpoint that works with list_tasks output directly
@router.post("/summarize-tasks", response_model=str)
async def summarize_tasks(
    tasks: List[Dict[str, Any]],
    question: str,
    user_name: str = "User"
) -> str:
    """
    Summarize a list of tasks in response to a specific question.
    
    Args:
        tasks: List of task dictionaries
        question: The user's question about their tasks
        user_name: Name of the user for personalization
    
    Returns:
        Conversational summary of tasks
    """
    try:
        summary = conversational_orchestrator.orchestrate_task_summary(
            tasks, 
            question, 
            user_name
        )
        
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error summarizing tasks: {str(e)}")
```

### 4. Integration with Chatbot

Here's how to integrate the summarization with a chatbot:

```python
# services/chatbot_service.py
from typing import Dict, Any
from utils.conversational_orchestrator import conversational_orchestrator
from services.task_service import get_user_tasks
from database import get_session

class ChatbotService:
    def __init__(self):
        self.orchestrator = conversational_orchestrator

    def process_message(self, user_input: str, user_id: int, user_name: str = "User") -> Dict[str, Any]:
        """
        Process a user message and return an appropriate response.
        
        Args:
            user_input: The user's input message
            user_id: The user's ID
            user_name: The user's name for personalization
        
        Returns:
            Dictionary with the chatbot's response
        """
        # Check if the user is asking about their tasks
        if self.orchestrator.is_task_question(user_input):
            # Get the user's tasks
            with get_session() as db:
                tasks = get_user_tasks(db, user_id)
            
            # Generate a conversational summary
            summary = self.orchestrator.orchestrate_task_summary(
                tasks, 
                user_input, 
                user_name
            )
            
            return {
                "response": summary,
                "intent": "task_summary",
                "task_count": len(tasks),
                "timestamp": datetime.utcnow().isoformat()
            }
        else:
            # Handle other types of questions (not implemented in this skill)
            return {
                "response": "I can help you with your tasks. Try asking 'What are my tasks?'",
                "intent": "other",
                "timestamp": datetime.utcnow().isoformat()
            }

# Example usage
"""
chatbot = ChatbotService()

# Example user input
user_input = "What are my tasks?"
user_id = 123
user_name = "Alice"

response = chatbot.process_message(user_input, user_id, user_name)
print(response["response"])
"""
```

### 5. Example Usage

Here's an example of how the summarization works:

```python
# example_usage.py
from services.task_summary_service import task_summary_service
from utils.conversational_orchestrator import conversational_orchestrator

# Sample task data
sample_tasks = [
    {
        "id": 1,
        "title": "Complete project proposal",
        "description": "Finish the Q3 project proposal document",
        "priority": "high",
        "status": "pending",
        "due_date": "2023-07-15T10:00:00Z",
        "assignee": "user123"
    },
    {
        "id": 2,
        "title": "Schedule team meeting",
        "description": "Arrange meeting with the development team",
        "priority": "medium",
        "status": "pending",
        "due_date": "2023-07-10T14:00:00Z",
        "assignee": "user123"
    },
    {
        "id": 3,
        "title": "Review quarterly reports",
        "description": "Check and approve Q2 financial reports",
        "priority": "urgent",
        "status": "in-progress",
        "due_date": "2023-07-05T17:00:00Z",
        "assignee": "user123"
    }
]

# Generate a basic summary
basic_summary = task_summary_service.generate_task_summary(sample_tasks, "John")
print("Basic Summary:")
print(basic_summary)
print("\n" + "="*50 + "\n")

# Generate a summary through the conversational orchestrator
question = "What are my tasks?"
orchestrated_summary = conversational_orchestrator.orchestrate_task_summary(sample_tasks, question, "John")
print("Orchestrated Summary:")
print(orchestrated_summary)
```

## Additional Features

The implementation includes:
- Comprehensive task summarization service
- Conversational orchestration with Claude-enhanced logic
- Context-aware responses based on user queries
- Personalization options for user names
- Recommendations based on task priorities and due dates
- FastAPI endpoints for easy integration
- Pattern matching for identifying task-related questions
- Filtering capabilities based on time frames and priorities

## Security Considerations

- Validate user IDs to prevent unauthorized access to others' tasks
- Implement proper authentication for chat endpoints
- Sanitize user inputs to prevent injection attacks
- Limit the amount of data exposed in summaries
- Implement rate limiting for chat endpoints
- Log chat interactions for monitoring and improvement