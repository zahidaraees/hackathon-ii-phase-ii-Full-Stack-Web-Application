import apiClient from './api';
// Define the types locally since they're not available in the frontend
interface TodoItemCreate {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string; // ISO date string
  category?: string;
  tags?: string; // JSON string
}

interface TodoItemUpdate {
  title?: string;
  description?: string;
  completion_status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string; // ISO date string
  category?: string;
  tags?: string; // JSON string
}

interface TodoItemRead extends TodoItemCreate {
  id: string;
  completion_status: 'pending' | 'in_progress' | 'completed';
  owner_id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  completed_at?: string; // ISO date string
}

interface TodoListResponse {
  success: boolean;
  data: {
    todos: TodoItemRead[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
    };
  };
}

interface TodoSingleResponse {
  success: boolean;
  data: {
    todo: TodoItemRead;
  };
}

interface TodoCreateUpdateResponse {
  success: boolean;
  data: {
    todo: TodoItemRead;
  };
}

interface TodoDeleteResponse {
  success: boolean;
  message: string;
}

interface TodoFilterParams {
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  limit?: number;
  offset?: number;
}

class TodoService {
  /**
   * Get all todos for the authenticated user
   */
  static async getAll(filters?: TodoFilterParams): Promise<TodoListResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const queryString = params.toString();
      const url = queryString ? `/todos?${queryString}` : '/todos';
      
      const response = await apiClient.get<TodoListResponse>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch todos');
    }
  }

  /**
   * Get a specific todo by ID
   */
  static async getById(id: string): Promise<TodoSingleResponse> {
    try {
      const response = await apiClient.get<TodoSingleResponse>(`/todos/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch todo');
    }
  }

  /**
   * Create a new todo
   */
  static async create(todoData: TodoItemCreate): Promise<TodoCreateUpdateResponse> {
    try {
      const response = await apiClient.post<TodoCreateUpdateResponse>('/todos', todoData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to create todo');
    }
  }

  /**
   * Update an existing todo
   */
  static async update(id: string, todoData: TodoItemUpdate): Promise<TodoCreateUpdateResponse> {
    try {
      const response = await apiClient.put<TodoCreateUpdateResponse>(`/todos/${id}`, todoData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update todo');
    }
  }

  /**
   * Update only the status of a todo
   */
  static async updateStatus(id: string, status: 'pending' | 'in_progress' | 'completed'): Promise<TodoCreateUpdateResponse> {
    try {
      const response = await apiClient.patch<TodoCreateUpdateResponse>(`/todos/${id}/status`, { completion_status: status });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update todo status');
    }
  }

  /**
   * Delete a todo
   */
  static async delete(id: string): Promise<TodoDeleteResponse> {
    try {
      const response = await apiClient.delete<TodoDeleteResponse>(`/todos/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete todo');
    }
  }
}

export default TodoService;