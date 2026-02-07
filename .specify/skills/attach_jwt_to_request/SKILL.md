---
name: attach_jwt_to_request
description: Attach JWT to API requests using an Axios/fetch wrapper that adds Authorization header. Use this skill whenever frontend calls backend routes to ensure secure request handling with Claude code.
license: Complete terms in LICENSE.txt
---

# Attach JWT to Request Skill

This skill provides a secure mechanism for attaching JWT tokens to API requests from the frontend to the backend.

## Purpose

Attach JWT tokens to API requests to authenticate and authorize users when making calls from the frontend to backend routes. This skill handles the secure transmission of authentication tokens.

## When to Use

Use this skill whenever the frontend needs to make authenticated calls to backend routes. This includes:
- Making API calls that require user authentication
- Accessing protected endpoints
- Performing CRUD operations on user-specific data
- Calling any backend service that requires a valid JWT token

## Implementation Overview

The JWT attachment is implemented using:
- Axios/fetch wrapper for making API requests
- Automatic addition of Authorization header with JWT token
- Claude code for secure request handling and token management

## Detailed Implementation

### 1. Axios/Fetch Wrapper Implementation

Create a request wrapper that automatically attaches the JWT token to all outgoing requests:

```javascript
// utils/apiClient.js
import axios from 'axios';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the JWT token from wherever it's stored (localStorage, cookies, context, etc.)
    const token = getAuthToken();
    
    if (token) {
      // Add the Authorization header with the JWT token
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized responses (token expired/invalid)
    if (error.response && error.response.status === 401) {
      // Clear the invalid token
      clearAuthToken();
      
      // Optionally redirect to login page
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Helper function to get the auth token
function getAuthToken() {
  // Retrieve token from localStorage, cookies, or context
  // This could be adapted based on your storage mechanism
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

// Helper function to clear the auth token
function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
}

export default apiClient;
```

### 2. Alternative Fetch Wrapper Implementation

If you prefer using the native fetch API instead of Axios:

```javascript
// utils/fetchWrapper.js
// Utility function to make authenticated requests
export async function authenticatedFetch(url, options = {}) {
  // Get the JWT token
  const token = getAuthToken();
  
  // Prepare headers with Authorization
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  
  // Prepare the request options
  const requestOptions = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, requestOptions);
    
    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      // Clear the invalid token
      clearAuthToken();
      
      // Optionally redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      throw new Error('Unauthorized: Please log in again');
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Helper function to get the auth token
function getAuthToken() {
  // Retrieve token from localStorage, cookies, or context
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

// Helper function to clear the auth token
function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
}

// Convenience methods for common HTTP operations
export const api = {
  get: (url, options) => authenticatedFetch(url, { ...options, method: 'GET' }),
  post: (url, data, options) => authenticatedFetch(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (url, data, options) => authenticatedFetch(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (url, options) => authenticatedFetch(url, { ...options, method: 'DELETE' }),
};
```

### 3. React Hook for Secure Requests

Create a custom hook that integrates with React's lifecycle and state management:

```javascript
// hooks/useApiRequest.js
import { useState, useCallback } from 'react';
import { authenticatedFetch } from '../utils/fetchWrapper';

export const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authenticatedFetch(url, options);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return { makeRequest, loading, error };
};

// Example usage in a React component
/*
import { useApiRequest } from '../hooks/useApiRequest';

const MyComponent = () => {
  const { makeRequest, loading, error } = useApiRequest();
  
  const fetchData = async () => {
    try {
      const data = await makeRequest('/api/tasks');
      console.log(data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };
  
  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
};
*/
```

### 4. Claude Code for Enhanced Security

The following Claude-enhanced code provides additional security measures for handling JWT tokens:

```javascript
// utils/secureTokenHandler.js
import { decodeToken } from 'jwt-decode'; // Install: npm install jwt-decode

class SecureTokenHandler {
  constructor() {
    this.tokenRefreshPromise = null;
  }

  // Get token and check if it's still valid
  getValidToken() {
    const token = this.getToken();
    
    if (!token) {
      return null;
    }
    
    try {
      const decoded = decodeToken(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (decoded.exp < currentTime) {
        // Token is expired, try to refresh it
        return this.refreshToken();
      }
      
      // Check if token expires soon (within 5 minutes)
      if (decoded.exp - currentTime < 300) {
        // Token expires soon, initiate refresh in background
        this.refreshTokenSoon();
      }
      
      return token;
    } catch (error) {
      console.error('Error decoding token:', error);
      this.clearToken();
      return null;
    }
  }

  // Store token securely
  setToken(token) {
    if (typeof window !== 'undefined') {
      // Store in localStorage (for demo purposes)
      // In production, consider using httpOnly cookies for better security
      localStorage.setItem('authToken', token);
    }
  }

  // Retrieve token
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // Clear token
  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Refresh token (implementation depends on your backend)
  async refreshToken() {
    if (this.tokenRefreshPromise) {
      // If a refresh is already in progress, return the existing promise
      return this.tokenRefreshPromise;
    }

    try {
      this.tokenRefreshPromise = this.performTokenRefresh();
      const newToken = await this.tokenRefreshPromise;
      this.setToken(newToken);
      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearToken();
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  // Perform the actual token refresh
  async performTokenRefresh() {
    // This is a placeholder - implement based on your backend's refresh token mechanism
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data.accessToken;
  }

  // Get refresh token
  getRefreshToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  // Refresh token soon (in background)
  refreshTokenSoon() {
    // Debounce to avoid multiple simultaneous refresh attempts
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    
    this.refreshTimeout = setTimeout(() => {
      this.refreshToken();
    }, 30000); // Refresh in 30 seconds
  }
}

// Singleton instance
export const secureTokenHandler = new SecureTokenHandler();

// Enhanced API client using the secure token handler
export const secureApiClient = {
  async request(url, options = {}) {
    const token = secureTokenHandler.getValidToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };
    
    const requestOptions = {
      ...options,
      headers,
    };
    
    try {
      const response = await fetch(url, requestOptions);
      
      // Handle 401 Unauthorized responses
      if (response.status === 401) {
        // Clear the invalid token
        secureTokenHandler.clearToken();
        
        // Optionally redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        throw new Error('Unauthorized: Please log in again');
      }
      
      return response;
    } catch (error) {
      console.error('Secure API request failed:', error);
      throw error;
    }
  },

  get: (url, options) => secureApiClient.request(url, { ...options, method: 'GET' }),
  post: (url, data, options) => secureApiClient.request(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (url, data, options) => secureApiClient.request(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (url, options) => secureApiClient.request(url, { ...options, method: 'DELETE' }),
};
```

### 5. Using the JWT Attachment in Components

Here's how to use the JWT attachment in your frontend components:

```jsx
// components/TaskManager.jsx
import { useState, useEffect } from 'react';
import { api } from '../utils/fetchWrapper'; // or use the axios version
import { secureApiClient } from '../utils/secureTokenHandler'; // for enhanced security

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Using the fetch wrapper with automatic JWT attachment
      const response = await api.get('/tasks');
      const data = await response.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      // Using the secure API client with enhanced security features
      const response = await secureApiClient.post('/tasks', taskData);
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <h2>Task Manager</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
      <button onClick={() => createTask({ title: 'New Task', description: 'Sample task' })}>
        Create Task
      </button>
    </div>
  );
};

export default TaskManager;
```

## Additional Security Measures

The implementation includes several security enhancements:
- Automatic token refresh before expiration
- Proper error handling for unauthorized requests
- Secure token storage and retrieval
- Prevention of multiple simultaneous refresh requests
- Client-side token validation

## Security Considerations

- Store JWT tokens securely (preferably in httpOnly cookies for production)
- Implement proper token expiration and refresh mechanisms
- Validate tokens both on the client and server sides
- Use HTTPS to encrypt all communications
- Implement CSRF protection if needed
- Sanitize and validate all data sent to the backend
- Consider using short-lived access tokens with refresh tokens