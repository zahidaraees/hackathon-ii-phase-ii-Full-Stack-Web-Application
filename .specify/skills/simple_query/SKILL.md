---
name: simple_query
description: Answer simple natural language queries about tasks. Use this skill whenever user asks chatbot basic questions, mapping queries to TaskAgent skills with Claude code ensuring query orchestration.
license: Complete terms in LICENSE.txt
---

# Simple Query Skill

This skill provides functionality to answer simple natural language queries about tasks by mapping them to appropriate TaskAgent skills.

## Purpose

Answer simple natural language queries about tasks by mapping user questions to appropriate TaskAgent skills. This skill handles basic questions and delegates more complex queries to specialized agents.

## When to Use

Use this skill whenever the user asks the chatbot basic questions about tasks. This includes:
- Questions about task counts ("How many tasks do I have?")
- Questions about task status ("What's my progress?")
- Simple task-related inquiries that don't require complex processing
- Queries that can be answered with basic information
- Routing questions to appropriate specialized agents

## Implementation Overview

The simple query handling is implemented using:
- Stub response mapping queries to TaskAgent skills
- Claude code for query orchestration and routing

## Detailed Implementation

### 1. Query Mapping Service

Create a service to map natural language queries to appropriate TaskAgent skills:

```python
# services/query_mapper.py
from typing import Dict, Any, Optional
import re
from enum import Enum

class QueryType(Enum):
    TASK_COUNT = "task_count"
    TASK_STATUS = "task_status"
    TASK_LIST = "task_list"
    TASK_FILTER = "task_filter"
    TASK_SORT = "task_sort"
    UNKNOWN = "unknown"

class QueryMapper:
    def __init__(self):
        # Define patterns for different query types
        self.patterns = {
            QueryType.TASK_COUNT: [
                r"how many task",
                r"number of task",
                r"count of task",
                r"total task",
                r"task count"
            ],
            QueryType.TASK_STATUS: [
                r"progress",
                r"status",
                r"completed",
                r"done",
                r"finished",
                r"remaining",
                r"left"
            ],
            QueryType.TASK_LIST: [
                r"show me task",
                r"list task",
                r"what task",
                r"my task",
                r"task list"
            ],
            QueryType.TASK_FILTER: [
                r"pending task",
                r"incomplete task",
                r"overdue task",
                r"high priority task",
                r"urgent task",
                r"filter task"
            ],
            QueryType.TASK_SORT: [
                r"sort task",
                r"order task",
                r"arrange task",
                r"by date",
                r"by priority"
            ]
        }

    def classify_query(self, query: str) -> QueryType:
        """
        Classify a natural language query into a specific type.
        
        Args:
            query: Natural language query from user
        
        Returns:
            QueryType classification
        """
        query_lower = query.lower()
        
        for query_type, patterns in self.patterns.items():
            for pattern in patterns:
                if re.search(pattern, query_lower):
                    return query_type
        
        return QueryType.UNKNOWN

    def map_query_to_skill(self, query: str) -> Dict[str, Any]:
        """
        Map a query to the appropriate skill and parameters.
        
        Args:
            query: Natural language query from user
        
        Returns:
            Dictionary with skill mapping information
        """
        query_type = self.classify_query(query)
        
        # Extract parameters from the query
        params = self._extract_parameters(query, query_type)
        
        # Map to appropriate skill
        skill_mapping = {
            QueryType.TASK_COUNT: {
                "skill": "count_completed",
                "endpoint": "/analytics/completed-tasks-count",
                "method": "GET",
                "params": params
            },
            QueryType.TASK_STATUS: {
                "skill": "count_completed",
                "endpoint": "/analytics/completion-statistics",
                "method": "GET",
                "params": params
            },
            QueryType.TASK_LIST: {
                "skill": "list_tasks",
                "endpoint": "/tasks",
                "method": "GET",
                "params": params
            },
            QueryType.TASK_FILTER: {
                "skill": "filter_by_status",
                "endpoint": "/tasks",
                "method": "GET",
                "params": params
            },
            QueryType.TASK_SORT: {
                "skill": "sort_tasks",
                "endpoint": "/tasks",
                "method": "GET",
                "params": params
            },
            QueryType.UNKNOWN: {
                "skill": "unknown",
                "endpoint": None,
                "method": None,
                "params": params,
                "fallback": True
            }
        }
        
        return skill_mapping[query_type]

    def _extract_parameters(self, query: str, query_type: QueryType) -> Dict[str, Any]:
        """
        Extract parameters from the query based on its type.
        
        Args:
            query: Natural language query from user
            query_type: Classified query type
        
        Returns:
            Dictionary with extracted parameters
        """
        params = {}
        query_lower = query.lower()
        
        # Extract common parameters
        if "completed" in query_lower or "done" in query_lower or "finished" in query_lower:
            params["status"] = "completed"
        elif "pending" in query_lower or "not done" in query_lower:
            params["status"] = "pending"
        elif "in progress" in query_lower or "working on" in query_lower:
            params["status"] = "in-progress"
        
        # Extract priority parameters
        if "high priority" in query_lower or "urgent" in query_lower or "important" in query_lower:
            params["priority"] = "high"
        elif "low priority" in query_lower:
            params["priority"] = "low"
        elif "medium priority" in query_lower:
            params["priority"] = "medium"
        
        # Extract date-related parameters
        if "today" in query_lower:
            params["date_filter"] = "today"
        elif "this week" in query_lower:
            params["date_filter"] = "this_week"
        elif "this month" in query_lower:
            params["date_filter"] = "this_month"
        
        # Extract sort parameters
        if "by date" in query_lower:
            params["sort_field"] = "created_at"
            params["sort_order"] = "desc"
        elif "by priority" in query_lower:
            params["sort_field"] = "priority"
            params["sort_order"] = "desc"
        elif "alphabetical" in query_lower or "by title" in query_lower:
            params["sort_field"] = "title"
            params["sort_order"] = "asc"
        
        return params


# Global instance
query_mapper = QueryMapper()
```

### 2. Claude Code for Query Orchestration

The following Claude-enhanced code provides sophisticated query orchestration:

```python
# utils/query_orchestrator.py
from typing import Dict, Any, List
from services.query_mapper import query_mapper, QueryType
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class QueryOrchestrator:
    def __init__(self):
        self.confidence_threshold = 0.7
        self.fallback_skills = ["summarize_tasks", "list_tasks"]

    def orchestrate_query(self, query: str, user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Claude-enhanced orchestration for handling natural language queries.
        
        Args:
            query: Natural language query from user
            user_context: Additional context about the user
        
        Returns:
            Dictionary with orchestration results
        """
        # Classify the query
        query_type = query_mapper.classify_query(query)
        
        # Map to appropriate skill
        skill_mapping = query_mapper.map_query_to_skill(query)
        
        # Calculate confidence in the mapping
        confidence = self._calculate_confidence(query, query_type)
        
        # Log the orchestration
        logger.info(f"Orchestrated query '{query}' to skill '{skill_mapping['skill']}' with confidence {confidence:.2f}")
        
        # Prepare orchestration result
        result = {
            "query": query,
            "query_type": query_type.value,
            "mapped_skill": skill_mapping,
            "confidence": confidence,
            "timestamp": datetime.utcnow().isoformat(),
            "user_context": user_context or {}
        }
        
        # If confidence is low, suggest fallback options
        if confidence < self.confidence_threshold:
            result["fallback_suggestions"] = self._get_fallback_suggestions(query)
        
        # Validate the mapping
        result["is_valid_mapping"] = self._validate_mapping(skill_mapping, query)
        
        return result

    def _calculate_confidence(self, query: str, query_type: QueryType) -> float:
        """
        Calculate confidence in the query classification.
        
        Args:
            query: Natural language query
            query_type: Classified query type
        
        Returns:
            Confidence score between 0 and 1
        """
        # Base confidence on the number of matching patterns
        matches = 0
        total_patterns = 0
        
        for qt, patterns in query_mapper.patterns.items():
            total_patterns += len(patterns)
            if qt == query_type:
                for pattern in patterns:
                    if re.search(pattern, query.lower()):
                        matches += 1
        
        # Calculate confidence as ratio of matches to total patterns for this type
        if query_type in query_mapper.patterns:
            max_possible_matches = len(query_mapper.patterns[query_type])
            if max_possible_matches > 0:
                confidence = min(1.0, matches / max_possible_matches)
                # Boost confidence slightly if there are multiple matches
                if matches > 1:
                    confidence = min(1.0, confidence * 1.2)
                return confidence
        
        return 0.1  # Low confidence if no patterns match

    def _get_fallback_suggestions(self, query: str) -> List[str]:
        """
        Get fallback skill suggestions when confidence is low.
        
        Args:
            query: Natural language query
        
        Returns:
            List of suggested fallback skills
        """
        # Simple heuristic: if query mentions "task", suggest task-related skills
        query_lower = query.lower()
        suggestions = []
        
        if any(word in query_lower for word in ["task", "work", "todo", "list"]):
            suggestions.extend(["list_tasks", "summarize_tasks"])
        
        if any(word in query_lower for word in ["count", "many", "number", "total"]):
            suggestions.append("count_completed")
        
        if any(word in query_lower for word in ["filter", "show", "only"]):
            suggestions.append("filter_by_status")
        
        # Add default suggestions if none match
        if not suggestions:
            suggestions = self.fallback_skills[:]
        
        return list(set(suggestions))  # Remove duplicates

    def _validate_mapping(self, skill_mapping: Dict[str, Any], query: str) -> bool:
        """
        Validate that the skill mapping makes sense for the query.
        
        Args:
            skill_mapping: Mapped skill information
            query: Original query
        
        Returns:
            True if mapping is valid, False otherwise
        """
        # Check if the mapped skill has appropriate parameters for the query
        skill = skill_mapping.get("skill")
        params = skill_mapping.get("params", {})
        query_lower = query.lower()
        
        # Validation rules
        if skill == "count_completed" and "status" in params:
            # Count skill should work with status filter
            return True
        elif skill == "filter_by_status" and "status" in params:
            # Filter skill should work with status filter
            return True
        elif skill == "sort_tasks" and "sort_field" in params:
            # Sort skill should work with sort parameters
            return True
        elif skill == "list_tasks":
            # List skill is generally appropriate
            return True
        elif skill == "summarize_tasks":
            # Summarize skill is appropriate for general queries
            return True
        
        # Default validation
        return skill != "unknown"

    def generate_stub_response(self, query: str, orchestration_result: Dict[str, Any]) -> str:
        """
        Generate a stub response based on the orchestration result.
        
        Args:
            query: Original user query
            orchestration_result: Result from orchestration
        
        Returns:
            Stub response string
        """
        skill = orchestration_result["mapped_skill"]["skill"]
        confidence = orchestration_result["confidence"]
        
        if skill == "unknown":
            return f"I'm not sure how to handle your request: '{query}'. Could you rephrase or ask something else?"
        
        if confidence < self.confidence_threshold:
            fallback_skills = orchestration_result.get("fallback_suggestions", [])
            fallback_str = ", ".join(fallback_skills[:2])  # Take first 2 suggestions
            return f"I think you're asking about your tasks, but I'm not completely sure. I can try to {skill.replace('_', ' ')}, or you could ask about {fallback_str}."
        
        # Generate appropriate response based on skill
        skill_responses = {
            "count_completed": "I can count your completed tasks for you.",
            "list_tasks": "I can list all your tasks.",
            "filter_by_status": f"I can filter your tasks by {list(orchestration_result['mapped_skill']['params'].keys())}.",
            "sort_tasks": f"I can sort your tasks by {list(orchestration_result['mapped_skill']['params'].keys())}.",
            "summarize_tasks": "I can provide a summary of your tasks."
        }
        
        return skill_responses.get(skill, f"I can help with {skill.replace('_', ' ')} tasks.")


# Global instance
query_orchestrator = QueryOrchestrator()
```

### 3. FastAPI Endpoint for Query Handling

Create an endpoint that handles simple queries:

```python
# api/v1/endpoints/simple_queries.py
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from pydantic import BaseModel
from utils.query_orchestrator import query_orchestrator

router = APIRouter(prefix="/queries", tags=["queries"])

class QueryRequest(BaseModel):
    query: str
    user_id: int
    user_context: Dict[str, Any] = {}

class QueryResponse(BaseModel):
    original_query: str
    mapped_skill: str
    stub_response: str
    confidence: float
    timestamp: str

@router.post("/simple", response_model=QueryResponse)
async def handle_simple_query(request: QueryRequest) -> QueryResponse:
    """
    Handle a simple natural language query about tasks.
    
    Args:
        request: Query and user information
    
    Returns:
        Query handling response with skill mapping
    """
    try:
        # Perform orchestration
        orchestration_result = query_orchestrator.orchestrate_query(
            request.query, 
            request.user_context
        )
        
        # Generate stub response
        stub_response = query_orchestrator.generate_stub_response(
            request.query,
            orchestration_result
        )
        
        return QueryResponse(
            original_query=request.query,
            mapped_skill=orchestration_result["mapped_skill"]["skill"],
            stub_response=stub_response,
            confidence=orchestration_result["confidence"],
            timestamp=orchestration_result["timestamp"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error handling query: {str(e)}")

# Alternative endpoint that returns the full orchestration result
@router.post("/analyze", response_model=Dict[str, Any])
async def analyze_query(request: QueryRequest) -> Dict[str, Any]:
    """
    Analyze a query and return the full orchestration result.
    
    Args:
        request: Query and user information
    
    Returns:
        Full orchestration result
    """
    try:
        result = query_orchestrator.orchestrate_query(
            request.query, 
            request.user_context
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing query: {str(e)}")
```

### 4. Integration with Chatbot

Here's how to integrate the simple query handling with a chatbot:

```python
# services/chatbot_integration.py
from typing import Dict, Any
from utils.query_orchestrator import query_orchestrator
from services.task_service import get_user_tasks
from services.task_summary_service import task_summary_service

class SimpleQueryChatbot:
    def __init__(self):
        self.orchestrator = query_orchestrator

    def process_simple_query(self, query: str, user_id: int, user_name: str = "User") -> Dict[str, Any]:
        """
        Process a simple query and return an appropriate response.
        
        Args:
            query: Natural language query from user
            user_id: User ID for context
            user_name: User name for personalization
        
        Returns:
            Dictionary with the chatbot's response
        """
        # Perform orchestration
        orchestration_result = self.orchestrator.orchestrate_query(query)
        
        # Get user tasks for context
        tasks = get_user_tasks(user_id)  # Assuming this function exists
        
        # Generate response based on the mapped skill
        skill = orchestration_result["mapped_skill"]["skill"]
        params = orchestration_result["mapped_skill"]["params"]
        
        if skill == "count_completed":
            completed_count = len([t for t in tasks if t.status == "completed"])
            response = f"You have completed {completed_count} task{'s' if completed_count != 1 else ''}."
        elif skill == "list_tasks":
            if not tasks:
                response = f"You don't have any tasks right now, {user_name}."
            else:
                response = f"You currently have {len(tasks)} task{'s' if len(tasks) != 1 else ''}. Would you like me to list them?"
        elif skill == "filter_by_status":
            if "status" in params:
                filtered_tasks = [t for t in tasks if t.status == params["status"]]
                response = f"You have {len(filtered_tasks)} {params['status']} task{'s' if len(filtered_tasks) != 1 else ''}."
            else:
                response = f"You have {len(tasks)} tasks in total."
        elif skill == "sort_tasks":
            # For simplicity, just return the task count
            response = f"You have {len(tasks)} tasks that can be sorted."
        elif skill == "summarize_tasks":
            response = task_summary_service.generate_condensed_summary(tasks, user_name)
        else:
            # For unknown or fallback cases
            response = self.orchestrator.generate_stub_response(query, orchestration_result)
        
        return {
            "query": query,
            "response": response,
            "mapped_skill": skill,
            "confidence": orchestration_result["confidence"],
            "timestamp": orchestration_result["timestamp"],
            "task_count": len(tasks)
        }

# Example usage
"""
chatbot = SimpleQueryChatbot()

# Example queries
examples = [
    "How many tasks do I have?",
    "Show me my completed tasks",
    "What's my progress?",
    "List my tasks",
    "Do I have any urgent tasks?"
]

for query in examples:
    result = chatbot.process_simple_query(query, user_id=123, user_name="Alice")
    print(f"Q: {query}")
    print(f"A: {result['response']}")
    print(f"Skill: {result['mapped_skill']}, Confidence: {result['confidence']:.2f}")
    print("-" * 50)
"""
```

### 5. Example Usage

Here's an example of how the simple query system works:

```python
# example_usage.py
from utils.query_orchestrator import query_orchestrator
from services.query_mapper import query_mapper

# Example queries
example_queries = [
    "How many tasks do I have?",
    "Show me my completed tasks",
    "What's my progress?",
    "List my tasks",
    "Sort my tasks by priority",
    "Do I have any urgent tasks?",
    "What should I work on today?"
]

print("Simple Query Analysis Examples:")
print("=" * 50)

for query in example_queries:
    print(f"Query: {query}")
    
    # Classify the query
    query_type = query_mapper.classify_query(query)
    print(f"Type: {query_type.value}")
    
    # Map to skill
    skill_mapping = query_mapper.map_query_to_skill(query)
    print(f"Skill: {skill_mapping['skill']}")
    print(f"Params: {skill_mapping['params']}")
    
    # Orchestrate
    orchestration_result = query_orchestrator.orchestrate_query(query)
    print(f"Confidence: {orchestration_result['confidence']:.2f}")
    
    # Generate stub response
    stub_response = query_orchestrator.generate_stub_response(query, orchestration_result)
    print(f"Stub Response: {stub_response}")
    
    print("-" * 30)
```

## Additional Features

The implementation includes:
- Sophisticated query classification using pattern matching
- Confidence scoring for query mappings
- Fallback suggestions when confidence is low
- Parameter extraction from natural language
- FastAPI endpoints for easy integration
- Claude-enhanced orchestration logic
- Chatbot integration examples
- Validation of skill mappings

## Security Considerations

- Validate user IDs to prevent unauthorized access to others' task data
- Implement proper authentication for query endpoints
- Sanitize user inputs to prevent injection attacks
- Limit the complexity of queries to prevent resource exhaustion
- Log query patterns for monitoring and improvement
- Implement rate limiting for query endpoints