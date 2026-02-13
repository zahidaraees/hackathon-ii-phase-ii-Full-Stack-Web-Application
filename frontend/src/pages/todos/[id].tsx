import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import TodoDetail from '../../components/TodoDetail';
import { TodoItemRead } from '../../components/TodoList';
import TodoService from '../../services/todoService';

const TodoDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, logout } = useAuth();
  const [todo, setTodo] = useState<TodoItemRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTodo();
    }
  }, [id]);

  const fetchTodo = async () => {
    try {
      setLoading(true);
      const response = await TodoService.getById(id as string);
      setTodo(response.data.todo);
    } catch (error) {
      console.error('Failed to fetch todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (todoId: string) => {
    try {
      await TodoService.delete(todoId);
      router.push('/todos'); // Redirect to the todo list after deletion
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleUpdateTodo = async (todoData: any) => {
    if (!todo) return;
    
    try {
      await TodoService.update(todo.id, todoData);
      setShowForm(false);
      // Refresh the todo data
      fetchTodo();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleFormSubmit = (todoData: any) => {
    handleUpdateTodo(todoData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Todo not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">Todo Web Application</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {showForm ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
                {/* TodoForm would go here */}
              </div>
            </div>
          ) : (
            <TodoDetail
              todo={todo}
              onEdit={() => setShowForm(true)}
              onDelete={handleDelete}
              onBack={() => router.push('/todos')}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default TodoDetailPage;