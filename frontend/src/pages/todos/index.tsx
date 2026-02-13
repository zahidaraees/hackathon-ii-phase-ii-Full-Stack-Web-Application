import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TodoList from '../../components/TodoList';
import TodoForm from '../../components/TodoForm';
import { TodoItemRead } from '../../components/TodoList';
import TodoService from '../../services/todoService';
import Layout from '../../components/Layout';

const TodoListPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItemRead | null>(null);

  const handleCreateTodo = async (todoData: any) => {
    try {
      await TodoService.create(todoData);
      setShowForm(false);
      // Refresh the list by reloading the page or updating state
      window.location.reload();
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleUpdateTodo = async (todoData: any) => {
    if (!editingTodo) return;
    
    try {
      await TodoService.update(editingTodo.id, todoData);
      setShowForm(false);
      setEditingTodo(null);
      // Refresh the list by reloading the page or updating state
      window.location.reload();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleFormSubmit = (todoData: any) => {
    if (editingTodo) {
      handleUpdateTodo(todoData);
    } else {
      handleCreateTodo(todoData);
    }
  };

  const handleEdit = (todo: TodoItemRead) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await TodoService.delete(id);
      // Refresh the list by reloading the page or updating state
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <Layout title="Todo Web Application">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Todos</h2>
            <button
              onClick={() => {
                setEditingTodo(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add New Todo
            </button>
          </div>

          {showForm ? (
            <TodoForm
              initialData={editingTodo}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingTodo(null);
              }}
            />
          ) : (
            <TodoList onEdit={handleEdit} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TodoListPage;