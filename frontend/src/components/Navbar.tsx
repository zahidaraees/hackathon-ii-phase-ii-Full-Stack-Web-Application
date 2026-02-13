import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logout } from '@/components/Logout';

const Navbar = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Todo App
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <Link href="/dashboard" className="hover:text-gray-300 transition-colors">
                  Dashboard
                </Link>
                <Link href="/todos" className="hover:text-gray-300 transition-colors">
                  Todos
                </Link>
                <Logout />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;