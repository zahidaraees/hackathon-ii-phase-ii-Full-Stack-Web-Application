// frontend/src/pages/todos/index.tsx
import React from 'react';
import TodoList from '../../components/TodoList';
import TodoForm from '../../components/TodoForm';

const TodoPage: React.FC = () => {
  const handleTodoAdded = () => {
    // Refresh the todo list after adding a new todo
    // In a real implementation, this might trigger a refetch
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Todos</h1>
      
      <TodoForm onTodoAdded={handleTodoAdded} />
      <TodoList />
    </div>
  );
};

export default TodoPage;