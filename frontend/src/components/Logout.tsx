// frontend/src/components/Logout.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { toast } from '@/hooks/use-toast';
import apiClient from '../services/api';
import { Button } from '@/components/ui/button';

const Logout: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    apiClient.logout();
    toast({
      title: "Logged out",
      description: "You have successfully logged out.",
    });
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default Logout;