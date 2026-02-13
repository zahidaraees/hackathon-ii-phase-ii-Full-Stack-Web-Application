import React from 'react';
import { TodoItemRead } from './TodoList'; // Import the type from TodoList

interface TodoItemProps {
  todo: TodoItemRead;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, currentStatus: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, onDelete, onToggleComplete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      onDelete(todo.id);
    }
  };

  const handleToggleComplete = () => {
    onToggleComplete(todo.id, todo.completion_status);
  };

  // Format the due date if it exists
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Determine the priority class for styling
  const priorityClass = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }[todo.priority];

  return (
    <li className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={todo.completion_status === 'completed'}
            onChange={handleToggleComplete}
            className="h-5 w-5"
          />
          <span className={`text-lg ${todo.completion_status === 'completed' ? 'line-through text-gray-500' : ''}`}>
            {todo.title}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityClass}`}>
            {todo.priority}
          </span>
        </div>
        {todo.description && (
          <p className="text-gray-600 mt-1 ml-8">{todo.description}</p>
        )}
        {todo.due_date && (
          <p className="text-sm text-gray-500 mt-1 ml-8">
            Due: {formatDate(todo.due_date)}
          </p>
        )}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TodoItem;