// frontend/src/pages/index.tsx
import React from 'react';
import { useRouter } from 'next/router';

const HomePage: React.FC = () => {
  const router = useRouter();

  React.useEffect(() => {
    // Redirect to the todos page if the user is authenticated
    // Otherwise, redirect to the login page
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/todos');
    } else {
      router.push('/login');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Todo App</h1>
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default HomePage;