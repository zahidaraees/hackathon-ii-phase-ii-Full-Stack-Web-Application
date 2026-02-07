---
name: handle_errors
description: Handle API and UI errors gracefully using error boundaries, toast notifications, and Claude code for error orchestration. Use this skill whenever an error occurs in frontend or backend calls to ensure proper error handling and user experience.
license: Complete terms in LICENSE.txt
---

# Handle Errors Skill

This skill provides a comprehensive error handling solution for both API and UI errors in a Next.js application.

## Purpose

Handle API and UI errors gracefully to provide a better user experience and prevent application crashes. This skill manages error boundaries, displays informative notifications, and orchestrates error handling using Claude code.

## When to Use

Use this skill whenever an error occurs in frontend or backend calls. This includes:
- API request failures
- Network connectivity issues
- Invalid user inputs
- Server-side errors
- Component rendering errors
- Unhandled exceptions in the application

## Implementation Overview

The error handling is implemented using:
- Error boundaries for catching component-level errors
- Toast notifications for displaying error messages
- Claude code for error orchestration and categorization

## Detailed Implementation

### 1. Error Boundary Component

Create an error boundary component to catch JavaScript errors anywhere in the child component tree:

```jsx
// components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Send error to error reporting service
    this.reportError(error, errorInfo);
  }

  reportError = (error, errorInfo) => {
    // Send error to your error reporting service (e.g., Sentry, LogRocket)
    if (process.env.NODE_ENV === 'production') {
      // Example: Report to external service
      // ErrorReportingService.captureException(error, { errorInfo });
    }
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-container p-6 max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-bold text-red-800 mb-4">Something went wrong</h2>
          <div className="bg-white p-4 rounded border border-red-300">
            <p className="text-red-700 mb-2"><strong>Error:</strong> {this.state.error?.toString()}</p>
            <details className="text-sm text-red-600">
              <summary className="cursor-pointer">More details</summary>
              <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto">
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          </div>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 2. Global Error Handler

Create a global error handler for unhandled errors:

```javascript
// utils/globalErrorHandler.js
import { showErrorToast } from './toastNotifications';

// Handle uncaught errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showErrorToast('An unexpected error occurred. Please try again.');
    
    // Report to error tracking service
    reportError(event.error, {
      type: 'global-error',
      message: event.error.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showErrorToast('An unexpected error occurred. Please try again.');
    
    // Report to error tracking service
    reportError(event.reason, {
      type: 'unhandled-rejection',
      reason: event.reason
    });
  });
}

// Server-side error handler for Next.js API routes
export function handleApiError(res, error, defaultMessage = 'Internal server error') {
  console.error('API Error:', error);
  
  // Determine error status based on error type
  let statusCode = 500;
  if (error.statusCode) {
    statusCode = error.statusCode;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
  }
  
  // Send appropriate response
  res.status(statusCode).json({
    error: true,
    message: error.message || defaultMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
  
  // Report to error tracking service
  reportError(error, {
    type: 'api-error',
    statusCode,
    url: res.req.url
  });
}

// Generic error reporting function
function reportError(error, context = {}) {
  if (process.env.NODE_ENV === 'production') {
    // Send error to external error tracking service
    // Example: Sentry.captureException(error, { contexts: context });
  }
  
  // Log error locally for debugging
  console.error('Reported error:', error, context);
}
```

### 3. Toast Notifications System

Set up toast notifications for displaying error messages to users:

```jsx
// components/ToastProvider.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create context for toast notifications
const ToastContext = createContext();

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message, options = {}) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      type,
      message,
      ...options
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after delay
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, options.duration || 5000);
  }, []);

  const showError = useCallback((message, options = {}) => {
    showToast('error', message, { ...options, type: 'error' });
  }, [showToast]);

  const showSuccess = useCallback((message, options = {}) => {
    showToast('success', message, { ...options, type: 'success' });
  }, [showToast]);

  const showWarning = useCallback((message, options = {}) => {
    showToast('warning', message, { ...options, type: 'warning' });
  }, [showToast]);

  const showInfo = useCallback((message, options = {}) => {
    showToast('info', message, { ...options, type: 'info' });
  }, [showToast]);

  const value = {
    showError,
    showSuccess,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast notifications
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Alternative implementation using react-toastify directly
export const showErrorToast = (message, options = {}) => {
  toast.error(message, {
    position: "top-right",
    autoClose: options.autoClose || 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...options
  });
};

export const showSuccessToast = (message, options = {}) => {
  toast.success(message, {
    position: "top-right",
    autoClose: options.autoClose || 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...options
  });
};

export const showWarningToast = (message, options = {}) => {
  toast.warn(message, {
    position: "top-right",
    autoClose: options.autoClose || 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...options
  });
};

export const showInfoToast = (message, options = {}) => {
  toast.info(message, {
    position: "top-right",
    autoClose: options.autoClose || 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...options
  });
};
```

### 4. Error Handling Hook

Create a custom hook for handling errors in components:

```javascript
// hooks/useErrorHandler.js
import { useCallback } from 'react';
import { showErrorToast, showWarningToast, showInfoToast } from '../components/ToastProvider';

export const useErrorHandler = () => {
  const handleError = useCallback((error, context = '') => {
    console.error(`${context ? context + ': ' : ''}${error.message || error}`);

    // Categorize and handle different types of errors
    if (error.response) {
      // Client received an error response (4xx, 5xx)
      const status = error.response.status;
      
      switch (status) {
        case 400:
          showErrorToast('Bad request. Please check your input and try again.');
          break;
        case 401:
          showErrorToast('Unauthorized. Please log in and try again.');
          // Optionally redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;
        case 403:
          showErrorToast('Access forbidden. You do not have permission to perform this action.');
          break;
        case 404:
          showErrorToast('Resource not found. The requested item may have been removed.');
          break;
        case 429:
          showWarningToast('Too many requests. Please slow down and try again later.');
          break;
        case 500:
          showErrorToast('Server error. Please try again later.');
          break;
        default:
          showErrorToast(`Request failed with status ${status}. Please try again.`);
      }
    } else if (error.request) {
      // Request was made but no response received
      showErrorToast('Network error. Please check your connection and try again.');
    } else {
      // Something else happened
      showErrorToast(error.message || 'An unexpected error occurred.');
    }
  }, []);

  return { handleError };
};

// Example usage in a component
/*
import { useErrorHandler } from '../hooks/useErrorHandler';

const MyComponent = () => {
  const { handleError } = useErrorHandler();
  
  const fetchData = async () => {
    try {
      const response = await api.get('/some-endpoint');
      // Handle successful response
    } catch (error) {
      handleError(error, 'Fetching data');
    }
  };
  
  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
};
*/
```

### 5. Claude Code for Error Orchestration

The following Claude-enhanced code provides intelligent error categorization and handling:

```javascript
// utils/errorOrchestrator.js
import { 
  showErrorToast, 
  showWarningToast, 
  showInfoToast, 
  showSuccessToast 
} from '../components/ToastProvider';
import { reportError } from './globalErrorHandler';

// Define error categories and their handlers
const ERROR_CATEGORIES = {
  AUTHENTICATION: {
    codes: ['UNAUTHORIZED', 'TOKEN_EXPIRED', 'INVALID_TOKEN'],
    handler: (error) => {
      showErrorToast('Authentication failed. Please log in again.');
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },
  VALIDATION: {
    codes: ['VALIDATION_ERROR', 'INVALID_INPUT'],
    handler: (error) => {
      showErrorToast(error.details || 'Invalid input provided. Please check your data.');
    }
  },
  NETWORK: {
    codes: ['NETWORK_ERROR', 'CONNECTION_TIMEOUT'],
    handler: (error) => {
      showErrorToast('Network error. Please check your connection and try again.');
    }
  },
  SERVER: {
    codes: ['SERVER_ERROR', 'INTERNAL_ERROR'],
    handler: (error) => {
      showErrorToast('Server error. Our team has been notified. Please try again later.');
    }
  },
  BUSINESS_LOGIC: {
    codes: ['INSUFFICIENT_FUNDS', 'QUOTA_EXCEEDED'],
    handler: (error) => {
      showWarningToast(error.message || 'Operation could not be completed due to business rules.');
    }
  }
};

// Main error orchestration function
export const orchestrateError = (error, context = {}) => {
  // Log the error for debugging
  console.error('Orchestrated error:', error, context);
  
  // Determine error category
  const category = categorizeError(error, context);
  
  // Handle based on category
  if (category && ERROR_CATEGORIES[category]) {
    ERROR_CATEGORIES[category].handler(error);
  } else {
    // Default error handling
    defaultErrorHandler(error);
  }
  
  // Report error for monitoring
  reportError(error, { ...context, category });
};

// Function to categorize errors
export const categorizeError = (error, context = {}) => {
  // Check for specific error codes
  if (error.code) {
    for (const [categoryName, category] of Object.entries(ERROR_CATEGORIES)) {
      if (category.codes.includes(error.code.toUpperCase())) {
        return categoryName;
      }
    }
  }
  
  // Check for HTTP status codes
  if (error.status || (error.response && error.response.status)) {
    const status = error.status || error.response.status;
    
    if (status >= 400 && status < 500) {
      if (status === 401 || status === 403) {
        return 'AUTHENTICATION';
      }
      return 'VALIDATION';
    } else if (status >= 500) {
      return 'SERVER';
    }
  }
  
  // Check for network-related errors
  if (error.isAxiosError && !error.response) {
    return 'NETWORK';
  }
  
  // Check for specific error messages
  const errorMessage = error.message || '';
  if (errorMessage.toLowerCase().includes('network')) {
    return 'NETWORK';
  }
  
  // Check for context clues
  if (context.operation === 'authentication') {
    return 'AUTHENTICATION';
  }
  
  // Default to unknown category
  return null;
};

// Default error handler
const defaultErrorHandler = (error) => {
  const message = error.message || 'An unexpected error occurred.';
  showErrorToast(message);
};

// Enhanced API error handler with orchestration
export const handleApiErrorWithOrchestration = (error, context = {}) => {
  // Add context about the API call
  const enrichedContext = {
    ...context,
    type: 'api_error',
    url: error.config?.url,
    method: error.config?.method,
    timestamp: new Date().toISOString()
  };
  
  // Orchestrated error handling
  orchestrateError(error, enrichedContext);
  
  // Return a rejected promise with the error for further handling
  return Promise.reject(error);
};

// Component error handler with orchestration
export const handleComponentError = (error, context = {}) => {
  // Add context about the component
  const enrichedContext = {
    ...context,
    type: 'component_error',
    component: context.componentName || 'Unknown Component',
    timestamp: new Date().toISOString()
  };
  
  // Orchestrated error handling
  orchestrateError(error, enrichedContext);
};
```

### 6. Using Error Handling in Components

Here's how to implement error handling in your components:

```jsx
// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import { ToastProvider, useToast } from '../components/ToastProvider';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { orchestrateError } from '../utils/errorOrchestrator';

const DashboardContent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      const response = await fetch('/api/dashboard-data');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      // Use orchestrated error handling
      orchestrateError(error, {
        operation: 'fetch_dashboard_data',
        component: 'Dashboard'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {data ? (
        <div>
          <p>Welcome to your dashboard!</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

const Dashboard = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <DashboardContent />
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default Dashboard;
```

### 7. API Route Error Handling

For Next.js API routes, implement error handling as follows:

```javascript
// pages/api/tasks/index.js
import { handleApiError, handleApiErrorWithOrchestration } from '../../../utils/globalErrorHandler';
import { orchestrateError } from '../../../utils/errorOrchestrator';

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        // Handle GET request
        const tasks = await getTasks();
        res.status(200).json({ tasks });
        break;
      
      case 'POST':
        // Handle POST request
        const newTask = await createTask(req.body);
        res.status(201).json({ task: newTask });
        break;
      
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    // Use orchestrated error handling for API routes
    await handleApiErrorWithOrchestration(error, {
      operation: 'api_handler',
      method: req.method,
      url: req.url,
      userId: req.userId // if available
    });
    
    // The error has already been reported and handled by the orchestration
    // Just send a generic error response to the client
    res.status(500).json({ 
      error: true, 
      message: 'Internal server error' 
    });
  }
}

// Example helper functions
async function getTasks() {
  // Implementation for getting tasks
  // This might throw errors that get caught by the try-catch
  throw new Error('Database connection failed');
}

async function createTask(data) {
  // Implementation for creating a task
  // This might throw validation errors or other issues
  if (!data.title) {
    const error = new Error('Title is required');
    error.code = 'VALIDATION_ERROR';
    error.status = 400;
    throw error;
  }
  
  // Create the task...
  return { id: 1, title: data.title, status: 'pending' };
}
```

## Additional Features

The error handling system includes:
- Comprehensive error boundary for component-level errors
- Global error handlers for uncaught exceptions
- Toast notifications for user feedback
- Intelligent error categorization and handling
- Centralized error reporting
- Context-aware error handling
- API-specific error handling utilities

## Security Considerations

- Don't expose sensitive information in error messages to end users
- Log detailed errors server-side but send generic messages to clients
- Implement proper error sanitization before displaying to users
- Use error reporting services to monitor and track errors in production
- Implement rate limiting for error reports to prevent flooding
- Sanitize error data before sending to external services