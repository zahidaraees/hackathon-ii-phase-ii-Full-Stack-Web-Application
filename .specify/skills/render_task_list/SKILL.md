---
name: render_task_list
description: Render the task list UI using a Next.js component with Tailwind CSS styling. Use this skill whenever list_tasks is called to display tasks with dynamic rendering handled by Claude code.
license: Complete terms in LICENSE.txt
---

# Render Task List Skill

This skill provides a user interface for displaying a list of tasks in an organized and visually appealing way.

## Purpose

Render a task list UI that displays all tasks or filtered tasks based on user criteria. This skill handles the presentation layer of task visualization.

## When to Use

Use this skill whenever the `list_tasks` function is called to provide a user interface for viewing tasks. This includes:
- Displaying all tasks assigned to a user
- Showing tasks filtered by status, priority, or date
- Providing a dashboard view of upcoming tasks
- Rendering tasks in a searchable and sortable format

## Implementation Overview

The task list rendering is implemented using:
- Next.js component for the user interface
- Tailwind CSS for responsive styling
- Claude code for dynamic rendering and filtering

## Detailed Implementation

### 1. Next.js Task List Component

Create a task list component in your Next.js application:

```jsx
// components/TaskList.jsx
import { useState, useEffect } from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks = [], filters = {}, onTaskUpdate, onTaskDelete }) => {
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  // Apply filters and search term when they change
  useEffect(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) || 
        task.description.toLowerCase().includes(term) ||
        task.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter(task => task.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority);
    }

    // Apply date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter(task => new Date(task.dueDate) >= startDate);
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      result = result.filter(task => new Date(task.dueDate) <= endDate);
    }

    setFilteredTasks(result);
  }, [tasks, filters, searchTerm]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to filtered tasks
  useEffect(() => {
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setFilteredTasks(sortedTasks);
  }, [sortConfig]);

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    overdue: tasks.filter(t => {
      if (t.status === 'completed') return false;
      return new Date(t.dueDate) < new Date();
    }).length
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {/* Task Statistics */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50">
        <div className="text-center p-2 bg-blue-100 rounded-lg">
          <p className="text-2xl font-bold">{taskStats.total}</p>
          <p className="text-sm text-gray-600">Total Tasks</p>
        </div>
        <div className="text-center p-2 bg-green-100 rounded-lg">
          <p className="text-2xl font-bold">{taskStats.completed}</p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
        <div className="text-center p-2 bg-yellow-100 rounded-lg">
          <p className="text-2xl font-bold">{taskStats.inProgress}</p>
          <p className="text-sm text-gray-600">In Progress</p>
        </div>
        <div className="text-center p-2 bg-red-100 rounded-lg">
          <p className="text-2xl font-bold">{taskStats.overdue}</p>
          <p className="text-sm text-gray-600">Overdue</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">Search</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filters.status || 'all'}
            onChange={(e) => filters.onStatusChange?.(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filters.priority || 'all'}
            onChange={(e) => filters.onPriorityChange?.(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex items-center">
          <span className="mr-2 text-sm font-medium text-gray-700">Sort by:</span>
          <button
            onClick={() => requestSort('title')}
            className={`ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
              sortConfig.key === 'title' 
                ? sortConfig.direction === 'asc' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-blue-100 text-blue-800'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Title
            {sortConfig.key === 'title' && (
              sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
            )}
          </button>
          <button
            onClick={() => requestSort('dueDate')}
            className={`ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
              sortConfig.key === 'dueDate' 
                ? sortConfig.direction === 'asc' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-blue-100 text-blue-800'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Due Date
            {sortConfig.key === 'dueDate' && (
              sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
            )}
          </button>
          <button
            onClick={() => requestSort('priority')}
            className={`ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
              sortConfig.key === 'priority' 
                ? sortConfig.direction === 'asc' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-blue-100 text-blue-800'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Priority
            {sortConfig.key === 'priority' && (
              sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
            )}
          </button>
        </div>
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{filteredTasks.length}</span> of <span className="font-medium">{tasks.length}</span> tasks
        </div>
      </div>

      {/* Task List */}
      <ul className="divide-y divide-gray-200">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onTaskUpdate={onTaskUpdate}
              onTaskDelete={onTaskDelete}
            />
          ))
        ) : (
          <li className="px-6 py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default TaskList;
```

### 2. Task Item Component

Create a reusable component for individual tasks:

```jsx
// components/TaskItem.jsx
import { useState } from 'react';

const TaskItem = ({ task, onTaskUpdate, onTaskDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...task });

  const handleSave = () => {
    onTaskUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...task });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = task.status !== 'completed' && new Date(task.dueDate) < new Date();

  return (
    <li className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0 flex-1">
          {!isEditing ? (
            <>
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={(e) => {
                  onTaskUpdate({
                    ...task,
                    status: e.target.checked ? 'completed' : 'pending'
                  });
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-4 min-w-0 flex-1">
                <p className={`text-sm font-medium text-gray-900 truncate ${
                  task.status === 'completed' ? 'line-through text-gray-500' : ''
                }`}>
                  {task.title}
                </p>
                <p className="text-sm text-gray-500 truncate">{task.description}</p>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(task.status)}`}>
                    {task.status.replace('-', ' ').charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                  </span>
                  {isOverdue && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Overdue
                    </span>
                  )}
                  
                  {task.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`title-${task.id}`} className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id={`title-${task.id}`}
                  value={editData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor={`status-${task.id}`} className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id={`status-${task.id}`}
                  value={editData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor={`priority-${task.id}`} className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id={`priority-${task.id}`}
                  value={editData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label htmlFor={`dueDate-${task.id}`} className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  id={`dueDate-${task.id}`}
                  value={editData.dueDate.split('T')[0]}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="ml-4 flex-shrink-0 flex space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => onTaskDelete(task.id)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-2 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Assigned to: {task.assignee || 'Unassigned'} • Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      </div>
    </li>
  );
};

export default TaskItem;
```

### 3. Tailwind CSS Styling

The components use Tailwind CSS for responsive styling. Make sure your `tailwind.config.js` is properly configured:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

And that Tailwind CSS is properly imported in your global CSS file:

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Claude Code Dynamic Rendering

The task list includes dynamic rendering capabilities that can be enhanced by Claude code. Here's an example of how Claude might orchestrate dynamic updates:

```javascript
// utils/taskRendering.js
export const enhanceTaskList = (tasks, userPreferences) => {
  // Apply user preferences to the task list
  let enhancedTasks = [...tasks];
  
  // Highlight urgent tasks
  enhancedTasks = enhancedTasks.map(task => ({
    ...task,
    isHighlighted: task.priority === 'urgent' || 
                   (task.priority === 'high' && isWithinDays(task.dueDate, 1)) ||
                   (task.status !== 'completed' && isOverdue(task.dueDate))
  }));
  
  // Sort based on user preferences
  if (userPreferences.sortBy) {
    enhancedTasks.sort((a, b) => {
      if (a[userPreferences.sortBy] < b[userPreferences.sortBy]) {
        return userPreferences.sortDirection === 'asc' ? -1 : 1;
      }
      if (a[userPreferences.sortBy] > b[userPreferences.sortBy]) {
        return userPreferences.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  
  // Group tasks by date if requested
  if (userPreferences.groupByDate) {
    return groupTasksByDate(enhancedTasks);
  }
  
  return enhancedTasks;
};

const isWithinDays = (dateStr, days) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(date - now);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days;
};

const isOverdue = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  return date < now;
};

const groupTasksByDate = (tasks) => {
  const groups = {};
  
  tasks.forEach(task => {
    const date = new Date(task.dueDate).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
  });
  
  // Sort groups by date
  const sortedGroups = {};
  Object.keys(groups)
    .sort((a, b) => new Date(a) - new Date(b))
    .forEach(key => {
      sortedGroups[key] = groups[key];
    });
  
  return sortedGroups;
};

// Function to dynamically update the UI based on real-time data
export const setupRealtimeUpdates = (taskId, onUpdate) => {
  // Example WebSocket connection for real-time updates
  const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);
  
  ws.onopen = () => {
    console.log('Connected to task updates');
    ws.send(JSON.stringify({ type: 'subscribe', taskId }));
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'task_update' && data.taskId === taskId) {
      onUpdate(data.task);
    }
  };
  
  return ws;
};
```

### 5. Using the Task List Component

Here's how to use the TaskList component in a Next.js page:

```jsx
// pages/tasks/index.jsx
import { useState, useEffect } from 'react';
import TaskList from '../../components/TaskList';
import { enhanceTaskList } from '../../utils/taskRendering';

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    startDate: '',
    endDate: ''
  });

  // Load tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle task updates
  const handleTaskUpdate = async (updatedTask) => {
    try {
      const response = await fetch(`/api/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const updatedTasks = tasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        );
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Handle task deletion
  const handleTaskDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Handle filter changes
  const handleStatusFilterChange = (status) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handlePriorityFilterChange = (priority) => {
    setFilters(prev => ({ ...prev, priority }));
  };

  // Enhance tasks with Claude-driven logic
  const enhancedTasks = enhanceTaskList(tasks, {
    sortBy: 'dueDate',
    sortDirection: 'asc',
    groupByDate: false
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Task List</h1>
      
      <TaskList
        tasks={enhancedTasks}
        filters={{
          ...filters,
          onStatusChange: handleStatusFilterChange,
          onPriorityChange: handlePriorityFilterChange
        }}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
};

export default TaskListPage;
```

## Additional Features

The task list includes several UX enhancements:
- Filtering by status, priority, and date range
- Sorting by different attributes
- Search functionality
- Visual indicators for task priority and status
- Responsive design for different screen sizes
- Task statistics dashboard
- Inline editing capabilities
- Loading states and empty state handling

## Security Considerations

- Sanitize user inputs before rendering
- Implement proper authentication and authorization checks
- Validate data on the server side as well
- Protect against XSS attacks by properly escaping content
- Implement rate limiting for API requests