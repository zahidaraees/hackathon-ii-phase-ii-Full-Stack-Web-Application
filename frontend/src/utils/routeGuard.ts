// frontend/src/utils/routeGuard.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useAuthGuard = (requireAuth: boolean = true) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const isAuthenticated = !!token;

    // If the route requires authentication but the user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.push('/login');
    }
    // If the route is for non-authenticated users only but the user is authenticated
    else if (!requireAuth && isAuthenticated) {
      router.push('/todos');
    }
  }, [requireAuth, router]);

  return {
    isAuthenticated: !!localStorage.getItem('access_token'),
  };
};