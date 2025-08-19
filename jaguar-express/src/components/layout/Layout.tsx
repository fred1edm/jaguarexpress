'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuthStore } from '@/store';
import { cn } from '@/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

// Rutas que no necesitan header/footer (ej: páginas de autenticación)
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

// Rutas que solo necesitan header (ej: checkout)
const headerOnlyRoutes = ['/checkout', '/payment'];

export function Layout({ children, className }: LayoutProps) {
  const pathname = usePathname();
  const { checkAuth } = useAuthStore();

  const isAuthRoute = authRoutes.includes(pathname);
  const isHeaderOnlyRoute = headerOnlyRoutes.includes(pathname);
  const showHeader = !isAuthRoute;
  const showFooter = !isAuthRoute && !isHeaderOnlyRoute;

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className={cn('flex-1', className)}>
          {children}
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showHeader && <Header />}
      
      <main className={cn('flex-1', className)}>
        {children}
      </main>
      
      {showFooter && <Footer />}
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}