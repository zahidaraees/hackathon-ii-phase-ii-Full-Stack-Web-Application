// frontend/src/components/Logout.tsx
import React from 'react';
import { useRouter } from 'next/router';
import apiClient from '../services/api';

const Logout: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    apiClient.logout();
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <button
      onClick={handleLogout}
      className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      Logout
    </button>
  );
};

export default Logout;