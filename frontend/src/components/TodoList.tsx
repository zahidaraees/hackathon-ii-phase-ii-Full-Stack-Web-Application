import React, { useState, useEffect } from 'react';
// Define the TodoItemRead type locally since it's not available in the frontend
interface TodoItemRead {
  id: string;
  title: string;
  description?: string;
  completion_status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string; // ISO date string
  category?: string;
  tags?: string; // JSON string
  owner_id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  completed_at?: string; // ISO date string
}
import TodoItem from './TodoItem';
import TodoService from '../services/todoService';

interface TodoListProps {
  onEdit: (todo: TodoItemRead) => void;
}

const TodoList: React.FC<TodoListProps> = ({ onEdit }) => {
  const [todos, setTodos] = useState<TodoItemRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await TodoService.getAll();
      setTodos(response.data.todos);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await TodoService.delete(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  const handleToggleComplete = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const response = await TodoService.updateStatus(id, newStatus as 'pending' | 'in_progress' | 'completed');
      
      // Update the todo in the list
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completion_status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null } : todo
      ));
    } catch (err) {
      setError('Failed to update todo status');
      console.error(err);
    }
  };

  if (loading) return <div>Loading todos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Your Todo List</h2>
      {todos.length === 0 ? (
        <p>You don't have any todos yet. Create one!</p>
      ) : (
        <ul className="space-y-2">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEdit={() => onEdit(todo)}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;