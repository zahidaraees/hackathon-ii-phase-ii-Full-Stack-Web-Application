import React, { useState } from 'react';

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

interface TodoFormProps {
  initialData?: TodoItemRead; // If initialData is provided, it's an edit form
  onSubmit: (todoData: TodoItemCreate | TodoItemUpdate) => void;
  onCancel: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState<TodoItemCreate | TodoItemUpdate>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    due_date: initialData?.due_date || '',
    category: initialData?.category || '',
    tags: initialData?.tags || '',
    ...(isEditing && { completion_status: initialData.completion_status })
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Edit Todo' : 'Create New Todo'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={(formData as any).title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={(formData as any).description || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={(formData as any).priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={(formData as any).due_date || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={(formData as any).category || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (JSON)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={(formData as any).tags || ''}
                onChange={handleChange}
                placeholder='["tag1", "tag2"]'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {isEditing && (
            <div className="mb-4">
              <label htmlFor="completion_status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="completion_status"
                name="completion_status"
                value={(formData as TodoItemUpdate).completion_status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {isEditing ? 'Update Todo' : 'Create Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;