import React, { createContext, useContext, ReactNode } from 'react';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

interface ToastContextType {
  showToast: (title: string, description?: string, variant?: 'default' | 'destructive') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useShowToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useShowToast must be used within a ToastProviderWrapper');
  }
  return context;
};

interface ToastProviderWrapperProps {
  children: ReactNode;
}

export const ToastProviderWrapper: React.FC<ToastProviderWrapperProps> = ({ children }) => {
  const { toasts, toast } = useToast();

  const showToast = (title: string, description?: string, variant: 'default' | 'destructive' = 'default') => {
    toast({
      title,
      description,
      variant,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastProvider>
        {children}
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
              {action}
              <ToastClose />
            </Toast>
          );
        })}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
};