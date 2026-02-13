import React from 'react';
import { TodoItemRead } from './TodoList'; // Import the type from TodoList

interface TodoDetailProps {
  todo: TodoItemRead;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const TodoDetail: React.FC<TodoDetailProps> = ({ todo, onEdit, onDelete, onBack }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      onDelete(todo.id);
    }
  };

  // Format the date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <button
        onClick={onBack}
        className="mb-4 text-blue-500 hover:text-blue-700 flex items-center"
      >
        ← Back to Todo List
      </button>
      
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-800">{todo.title}</h1>
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
        </div>
        
        <div className="mt-2 flex items-center">
          <span className={`inline-block px-3 py-1 text-sm rounded-full ${
            todo.completion_status === 'completed' ? 'bg-green-100 text-green-800' :
            todo.completion_status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {todo.completion_status.replace('_', ' ').toUpperCase()}
          </span>
          <span className={`ml-2 inline-block px-3 py-1 text-sm rounded-full ${
            todo.priority === 'high' ? 'bg-red-100 text-red-800' :
            todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {todo.priority.toUpperCase()}
          </span>
        </div>
      </div>
      
      {todo.description && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Description</h2>
          <p className="text-gray-600">{todo.description}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Category</h2>
          <p className="text-gray-600">{todo.category || 'Not set'}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Due Date</h2>
          <p className="text-gray-600">{formatDate(todo.due_date)}</p>
        </div>
      </div>
      
      {todo.tags && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {JSON.parse(todo.tags).map((tag: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
        <div>
          <p>Created: {formatDate(todo.created_at)}</p>
        </div>
        <div>
          <p>Updated: {formatDate(todo.updated_at)}</p>
        </div>
        {todo.completed_at && (
          <div>
            <p>Completed: {formatDate(todo.completed_at)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoDetail;