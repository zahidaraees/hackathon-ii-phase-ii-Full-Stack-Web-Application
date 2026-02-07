---
name: render_task_form
description: Render the task creation form using a Next.js form component with Tailwind CSS styling. Use this skill whenever create_task is called to provide a user interface for task creation with validation and orchestration handled by Claude code.
license: Complete terms in LICENSE.txt
---

# Render Task Form Skill

This skill provides a user interface for creating new tasks through a form component.

## Purpose

Render a task creation form that allows users to input task details and submit them for processing. This skill handles the presentation layer of task creation.

## When to Use

Use this skill whenever the `create_task` function is called to provide a user interface for task creation. This includes:
- Displaying a form for new task entry
- Collecting task details from users
- Validating user input before submission
- Handling form submission and orchestration

## Implementation Overview

The task form rendering is implemented using:
- Next.js form component for the user interface
- Tailwind CSS for responsive styling
- Claude code for validation and orchestration

## Detailed Implementation

### 1. Next.js Form Component

Create a task form component in your Next.js application:

```jsx
// components/TaskForm.jsx
import { useState } from 'react';

const TaskForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignee: '',
    tags: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTagChange = (e) => {
    const tagString = e.target.value;
    const tags = tagString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit the form data
      await onSubmit(formData);
      
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignee: '',
        tags: []
      });
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Title *
        </label>
        <input
          className={`shadow appearance-none border ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="title"
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          name="description"
          placeholder="Task description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        {formData.description.length > 400 && (
          <p className="text-yellow-500 text-xs italic mt-1">
            Approaching character limit ({formData.description.length}/500)
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
            Priority
          </label>
          <select
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
            Due Date *
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dueDate ? 'border-red-500' : 'border-gray-300'
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dueDate"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
          {errors.dueDate && <p className="text-red-500 text-xs italic mt-1">{errors.dueDate}</p>}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignee">
          Assignee
        </label>
        <input
          className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="assignee"
          type="text"
          name="assignee"
          placeholder="Assign to user"
          value={formData.assignee}
          onChange={handleChange}
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
          Tags (comma-separated)
        </label>
        <input
          className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="tags"
          type="text"
          name="tags"
          placeholder="tag1, tag2, tag3"
          value={formData.tags.join(', ')}
          onChange={handleTagChange}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
```

### 2. Tailwind CSS Styling

The form uses Tailwind CSS for responsive styling. Make sure your `tailwind.config.js` is properly configured:

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

### 3. Claude Code Validation and Orchestration

The form includes validation logic that can be enhanced by Claude code. Here's an example of how Claude might orchestrate additional validation:

```javascript
// utils/taskValidation.js
export const validateTaskData = (taskData) => {
  const errors = {};
  
  // Title validation
  if (!taskData.title || taskData.title.trim().length === 0) {
    errors.title = 'Task title is required';
  } else if (taskData.title.length > 100) {
    errors.title = 'Task title must be less than 100 characters';
  }
  
  // Description validation
  if (taskData.description && taskData.description.length > 500) {
    errors.description = 'Task description must be less than 500 characters';
  }
  
  // Due date validation
  if (!taskData.dueDate) {
    errors.dueDate = 'Due date is required';
  } else {
    const dueDate = new Date(taskData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dueDate < today) {
      errors.dueDate = 'Due date cannot be in the past';
    }
  }
  
  // Priority validation
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (!validPriorities.includes(taskData.priority)) {
    errors.priority = 'Invalid priority level';
  }
  
  // Assignee validation (example with email format)
  if (taskData.assignee && !isValidEmail(taskData.assignee)) {
    errors.assignee = 'Invalid assignee email format';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Additional orchestration function
export const processTaskSubmission = async (taskData) => {
  // Validate the task data
  const validation = validateTaskData(taskData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
  }
  
  // Perform any additional orchestration steps
  // e.g., check for duplicate tasks, notify assignees, etc.
  
  // Submit the task to the backend
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};
```

### 4. Using the Task Form Component

Here's how to use the TaskForm component in a Next.js page:

```jsx
// pages/tasks/create.jsx
import TaskForm from '../../components/TaskForm';
import { processTaskSubmission } from '../../utils/taskValidation';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

const CreateTaskPage = () => {
  const router = useRouter();

  const handleSubmit = async (taskData) => {
    try {
      // Process the task submission with Claude-enhanced validation
      const result = await processTaskSubmission(taskData);
      
      // Show success notification
      toast.success('Task created successfully!');
      
      // Redirect to the task list or dashboard
      router.push('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.message || 'Failed to create task');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Task</h1>
      <TaskForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateTaskPage;
```

## Additional Features

The form includes several UX enhancements:
- Real-time validation feedback
- Character count warnings
- Loading states during submission
- Responsive layout using Tailwind's grid system
- Accessible form labels and error messages
- Proper focus states for keyboard navigation

## Security Considerations

- Sanitize user inputs before processing
- Implement CSRF protection
- Validate and sanitize data on the server side as well
- Use proper authentication and authorization checks
- Implement rate limiting for form submissions