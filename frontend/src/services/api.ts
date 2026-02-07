// frontend/src/services/api.ts
import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add JWT token to requests if available
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Handle token expiration and refresh
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  getTodos = async () => {
    try {
      const response = await this.client.get('/todos');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  createTodo = async (todo: { title: string; description?: string }) => {
    try {
      const response = await this.client.post('/todos', todo);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  updateTodo = async (id: string, todo: { title?: string; description?: string; completed?: boolean }) => {
    try {
      const response = await this.client.put(`/todos/${id}`, todo);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  toggleTodoCompletion = async (id: string, completed: boolean) => {
    try {
      const response = await this.client.patch(`/todos/${id}/complete`, { completed });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  deleteTodo = async (id: string) => {
    try {
      const response = await this.client.delete(`/todos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  login = async (email: string, password: string) => {
    try {
      // Using basic auth for login (in a real app, you'd use a proper login endpoint)
      const credentials = btoa(`${email}:${password}`);
      const response = await this.client.post('/auth/login', {}, {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });
      
      // Store the token
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  register = async (email: string, password: string) => {
    try {
      const response = await this.client.post('/auth/register', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    localStorage.removeItem('access_token');
  };
}

const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api');

export default apiClient;